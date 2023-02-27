const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Give the condition for the two fields
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);