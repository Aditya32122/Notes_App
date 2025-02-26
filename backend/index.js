require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.models');
const Note = require('./models/note.model');

const express = require('express'); 
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(cors({
    origin: '*',
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ date: 'Hello World' });  
});

// Create account
app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ message: 'Fullname is required' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const accessToken = jwt.sign(
        { _id: user._id, email: user.email },  // Ensure only necessary fields are included
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    return res.json({ error: false, message: 'Account created successfully', accessToken });
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign(
        { _id: user._id, email: user.email },  // Consistent token structure
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    return res.json({ error: false, message: 'Login successful', accessToken });
});

// Add note
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }

    const note = new Note({
        title,
        content,
        tags: tags || [],
        userId: user._id,
    });
    await note.save();
    return res.json({ error: false, message: 'Note added successfully' });
});

app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const { title, content, tags , isPinned } = req.body;
    const user = req.user;

    if(!title && !content && !tags ){
        return res.status(400).json({ error: true, message: 'At least one field is required' });
    }

    try{
        const note = await Note.findOne({ _id: req.params.noteId, userId: user._id });
        if(!note){
            return res.status(404).json({ error: true, message: 'Note not found' });
        }

        if(title){
            note.title = title;
        }
        if(content){
            note.content = content;
        }
        if(tags){
            note.tags = tags;
        }
        if(isPinned){
            note.isPinned = isPinned;
        }

        await note.save();
        return res.json({ error: false, message: 'Note updated successfully' });
    } catch(err){
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

app.get('/get-notes', authenticateToken, async (req, res) => {
    const user = req.user;

    try{
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1});
        
        return res.json({ error: false, notes });
    }
    catch(err){
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
}
);

app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if(!note){
            return res.status(404).json({ error: true, message: 'Note not found' });
        }
        await Note.deleteOne({ _id: noteId , userId: user._id });

        return res.json({ error: false, message: 'Note deleted successfully' });
    } catch(err){
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const user = req.user;
    const noteId = req.params.noteId;
    const isPinned = req.body.isPinned;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if(!note){
            return res.status(404).json({ error: true, message: 'Note not found' });
        }

        note.isPinned = isPinned;
        await note.save();
        return res.json({ error: false, message: 'Note pinned status updated successfully' });
    } catch(err){
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
});

app.get('/get-user', authenticateToken,async (req, res) => {
    const user = req.user;

    const isUser = await User.findOne({ _id: user._id });
    if(!isUser){
        return res.status(404).json({ error: true, message: 'User not found' });
    }

    return res.json({ user:{fullName:isUser.fullName , email: isUser.email , "_id": isUser._id , createdOn : isUser.createdOn } , message: '' });
});

app.get('/search-notes/', authenticateToken, async (req, res) => {
   const user = req.user;
   const query = req.query.query;

   if(!query){
       return res.status(400).json({ error: true, message: 'Query is required' });
   }
   try{
    const matchingNotes= await Note.find({
        userId: user._id,
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
        ],
    });
    return res.json({ error: false, notes: matchingNotes });
    } catch(err){
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }

}
);

app.listen(8000);
module.exports = app;
