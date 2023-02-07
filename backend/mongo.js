const mongoose = require('mongoose');

const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const uri = `mongodb+srv://${USER}:${PASSWORD}@${DATABASE}.lvrkxbu.mongodb.net/?retryWrites=true&w=majority`;

//Connexion à mongooseDB
mongoose.connect(uri)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));