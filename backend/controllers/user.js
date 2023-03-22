const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); //Import user model
const errorMessage = require('../errors/error'); // Import error function


/** Signup function 
 * Get the password and use the hash from bcrypt to protect it
 * Create a new user with the email and use toLowerCase() to make sure the field is case insensitive
 * Hash the password in the database
 * Save the user
 * Sends an error code if there is a necessity
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email.toLowerCase(),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json(errorMessage(error)));
        })
        .catch(error => res.status(500).json(errorMessage(error)));
};


/** Login function
 * Get the email and use toLowerCase() to make sure the field is case insensitive
 * Verify is the user exists or not, if it doesn't send an error otherwise resume
 * Check if the passwords are the same, if it isn't send an error otherwise resume
 * If correct, creates an userId and a token which expires in 24h
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
*/
exports.login = (req, res) => {
    User.findOne({email: req.body.email.toLowerCase()})
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
                .catch(error => res.status(500).json(errorMessage(error)));
        })
        .catch(error => res.status(500).json(errorMessage(error)));
};
