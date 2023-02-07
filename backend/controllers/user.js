const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// User signup
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//User login
exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' })
                return;
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' })
                        return;
                    } 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, process.env.JWT_PASSWORD, {expiresIn: '24h'})
                    });
                        
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
