const jwt = require('jsonwebtoken');

/**
 * Get the token from the header
 * Decode it and create the userId
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
        const userId = decodedToken.userId;
        req.auth = {userId};   
        next();
    } catch(error){
        res.status(401).json({error});
    }
};