require('dotenv').config({path: '.env.js'});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');


//Connection to the database
require('./mongo');

//Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 


//Routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;