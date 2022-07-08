
import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"



export const getPost = async (req, res) => {
    const { id } = req.params

    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
 }

 export const getPostsBySearch = async (req, res) => {
     const { searchQuery, tags } = req.query
     try {
         const title = new RegExp(searchQuery, 'i')

         const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } }]  })
     
         res.json({ data: posts })
        } catch (error) {
         res.status(404).json({ message: error.message })
     }
 }


 export const createPost = async (req, res) => {
     const post = req.body

     const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()  })
    try {
        await newPostMessage.save()
        res.status(201).json(newPostMessage)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
 }

 export const updatePost = async (req, res) => {
     const { id: _id } = req.params
     const post = req.body

     if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Invalid credentials')
     
     
     const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true })

     res.json(updatedPost)
 }

 export const deletePost = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Invalid credentials')

    await PostMessage.findByIdAndRemove(id)

    res.json({ message: 'Post deleted successfully' })
 }

 export const likePost = async (req, res) => {
    const { id } = req.params 

    if(!req.userId) return res.json({ message: 'Unauthenticated' })

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Invalid credentials')

    const post = await PostMessage.findById(id)
    
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1) {
        // like the post
        post.likes.push(req.userId)
    } else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.status(200).json(updatedPost)
 }


//  export const commentPost = async (req, res) => {
//     try {
//         const post = await PostMessage.findById(req.params.id)
       
//         const newComment = {
//             value: req.body.value
//         }
//         post.comments.unshift(newComment)

//         await post.save()

//          res.json(post.comments)
//     } catch (error) {
//         console.log(error)
//     }
    
// };

export const commentPost = async (req, res) => {
 try
 {   const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)

    if(!Array.isArray(post.comments)){
        post.comments = []
    }
       post.comments.push(value)

       const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
      
       res.json(updatedPost)

   } catch (error) {
    console.log(error.message)
       res.status(500).json({ message: error.message })
   }
}