const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Correctly typed for MongoDB ObjectId
});

module.exports = mongoose.model('Note', NoteSchema);