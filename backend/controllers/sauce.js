const Sauce = require('../models/sauce'); // Import Sauce model
const fsPromises = require('fs.promises'); // Package allowing to modify/delete files
const errorMessage = require('../errors/error'); // Import error function
/**
 * Get all the sauces available on the website
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(response => res.status(200).json(response))
        .catch(error => res.status(404).json(errorMessage(error)))
};


/**
 * Get the information from the body
 * Delete the id of the sauce
 * Create the new sauce with all the required parameters
 * Save it or send an error message
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        userId: req.auth.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès !'}))
        .catch(error => res.status(400).json(errorMessage(error)));
}

/**
 * Access the page of one sauce otherwise send an error message
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json(errorMessage(error)))
};

/**
 * Check if we modify the picture or not
 * If we do, update the URL of the image
 * Uses sauceObject to modify the info
 * Save it or send an error message
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.modifySauce = (req, res) => {
    const sauceObject = req.headers['content-type'] === 'application/json' ?  req.body : JSON.parse(req.body.sauce);
    Sauce.findOne({_id: req.params.id, auth : req.auth.userId})
    .then((sauce) => {
        if (!sauce) {
            throw new Error("not found");
        }
        if(req.file) {
            sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        sauce.name = sauceObject.name;
        sauce.manufacturer = sauceObject.manufacturer;
        sauce.description = sauceObject.description;
        sauce.mainPepper = sauceObject.mainPepper;
        sauce.heat = sauceObject.heat;
        return sauce.save()
    })
    .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !'}))
    .catch(error => res.status(400).json(errorMessage(error)))
};

/**
 * Identify the sauce
 * Get the image adress
 * Delete the image from the server
 * Delete the sauce from the database or send an error message
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id, auth : req.auth.userId} )
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fsPromises.unlink(`images/${filename}`)
            .then (() =>
                Sauce.deleteOne({_id: req.params.id}) 
                .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
            )
        .catch(error => res.status(400).json(errorMessage(error)))
    });
};

/**
 * Identify the sauce
 * Check if the user already liked it or not
 * If not, add the like if the user wants it
 * Check if the user already disliked it or not
 * If not add the dislikes if the user wants it
 * The user can delete his like/dislike if he wants to
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    res.status(401).json({error: 'Sauce déja liké'});
                    return;
                }
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.auth.userId }})
                    .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                    .catch(error => res.status(400).json(errorMessage(error)))
            } 
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.auth.userId)) {
                    res.status(401).json({error: 'Sauce déja disliké'});
                    return;
                }
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.auth.userId }})
                    .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                    .catch(error => res.status(400).json(errorMessage(error)));
            } else {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId }})
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json(errorMessage(error)));
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.auth.userId }})
                            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json(errorMessage(error)));
                }
            }
        })
        .catch(error => res.status(400).json(errorMessage(error)));   
};