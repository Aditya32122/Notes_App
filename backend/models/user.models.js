const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true }, // Consistent naming
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);


module.exports = mongoose.model('User', userSchema);