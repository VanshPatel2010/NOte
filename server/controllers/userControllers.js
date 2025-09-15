import userModel from "../models/userModel.js";

export const getUserData = async (req, res) =>{
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }
    try {
        return res.status(200).json({success: true, message: "User data fetched successfully", data: user});
    } catch (error) {
        
    }
}

export const getNotes = async (req, res) =>{
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }
    try {
        return res.status(200).json({success: true, message: "Notes fetched successfully", data: user.notes});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const deleteNote = async (req, res) =>{
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }
    // delete note with specific id
    const noteId = req.params.id;
    const noteIndex = user.notes.findIndex(note => note._id.toString() === noteId);
    if(noteIndex === -1){
        return res.status(400).json({message: "Note does not exist"});
    }
    user.notes.splice(noteIndex, 1);
    await user.save();
    try {
        return res.status(200).json({success: true, message: "Note deleted successfully", data: user.notes});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const addNote = async (req, res) =>{
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({message: "User does not exist"});
    }
    const {title, content} = req.body;
    if(!title || !content){
        return res.status(400).json({message: "Title and content are required"});
    }
    user.notes.push({title, content});
    await user.save();
    try {
        return res.status(200).json({success: true, message: "Note added successfully", data: user.notes});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message, message: "uncaught error"});
    }
}

export const updateNote = async (req, res) =>{
    const userId = req.user.id;
    const user = await userModel.findById(userId);    
    if(!user){
        return res.status(400).json({message: "User does not exist"});  
    }
    const noteId = req.params.id;
    const {title, content} = req.body;
    if(!title || !content){
        return res.status(400).json({message: "Title and content are required"});
    }
    const noteIndex = user.notes.findIndex(note => note._id.toString() === noteId);
    if(noteIndex === -1){
        return res.status(400).json({message: "Note does not exist"});
    }
    user.notes[noteIndex].title = title;
    user.notes[noteIndex].content = content;
    await user.save();
    try {
        return res.status(200).json({success: true, message: "Note updated successfully", data: user.notes});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}