const Sauce = require('../models/sauce'); // Import Sauce model
const fs = require('fs'); // Package allowing to modify/delete files

/**
 * Get all the sauces available on the website
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(response => res.status(200).json(response))
        .catch(error => res.status(404).json({error}))
};

/**
 * Get the infomration from the body
 * Delete the id of the sauce
 * Create the new sauce with all the required parameters
 * Save it or send an error message
 * @param {*} req 
 * @param {*} res 
 */
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        //...sauceObject,
        userId:"",
        name:"",
        manufacturer:"",
        description: "",
        mainPepper: "",
        heat: 0,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès !'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Access the page of one sauce otherwise send an error message
 * @param {*} req 
 * @param {*} res 
 */
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

/**
 * Get the info of the sauce
 * Uses sauceObject to modify the info
 * Save it or send an error messsage
 * @param {*} req 
 * @param {*} res 
 */
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body} ;
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !'}))
        .catch(error => res.status(400).json({ error }))
};

/**
 * Identify the sauce
 * Get the image adress
 * Delete the image from the server
 * Delete the sauce from the database or send an error message
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fs.unlink(`images/${filename}`, () => { /// on la supprime du serveur
            Sauce.deleteOne({_id: req.params.id}) // on supprime la sauce de la bdd
                .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
                .catch(error => res.status(400).json({ error}))
    });
})
};

/**
 * Identify the sauce
 * Check if the user already liked it or not
 * If not, add the like if the user wants it
 * Check if the user already disliked it or not
 * If not add the dislikes if the user wants it
 * The user can delete his like/dislike if he wants to
 * @param {*} req 
 * @param {*} res 
 */
exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déja liké'});
                    return;
                }
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                    .catch(error => res.status(400).json({ error }))
            } 
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déja disliké'});
                    return;
                }
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));   
};