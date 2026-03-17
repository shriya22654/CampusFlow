import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userName: String,      
    title: String,         
    description: String,  
    category: String       
});

export const Post = mongoose.model('Post', postSchema);