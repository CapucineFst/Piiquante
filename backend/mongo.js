const mongoose = require('mongoose');

//process.env for better security
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const uri = `mongodb+srv://${USER}:${PASSWORD}@${DATABASE}.lvrkxbu.mongodb.net/?retryWrites=true&w=majority`;

/** Connexion to mongoose DB
 * Send a message giving the status of the connexion
*/
mongoose.connect(uri)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));