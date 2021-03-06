import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

/*
  Get all post
 */
export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
/*
  Crate a post
 */
export const createPost = async (req, res) => {
  const { title, message, selectedFile, creator, tags } = req.body;

  const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

/*
  Update a post
 */
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body
  // console.log(post);
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post found with that ${_id}`)
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
  res.json(updatedPost);
}

/*
  Delete a post
 */
export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post found with that ${id}`)
  await PostMessage.findByIdAndDelete(id)
  res.json({ message: 'Post deleted Successfully' })
}

/*
  Like a post
 */

export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post found with that ${id}`);

  const post = await PostMessage.findById(id);
  const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
  res.json(updatedPost);
}