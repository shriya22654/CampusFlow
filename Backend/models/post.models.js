import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },      
    title: String,         
    description: String,  
    category: String       
});

export const Post = mongoose.model('Post', postSchema);