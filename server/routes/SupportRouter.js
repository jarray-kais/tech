import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Conversation from '../models/Support.js'
import User from '../models/userModel.js'
import { isAdmin, isAuth } from '../utils.js'
import data from '../data.js'

const SupportRouter = express.Router()

SupportRouter.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
      const createdconversations = await Conversation.insertMany(data.conversations);
      res.send({ createdconversations });
    })
  );
  

SupportRouter.get('/' , isAuth , isAdmin , expressAsyncHandler(async(req , res)=>{
    const conversations = await Conversation.find();

        // Récupérer les informations des utilisateurs à partir des conversations
        const users = await Promise.all(conversations.map(async (conversation) => {
            const user = await User.findOne(conversation.userId);
            return {
                _id: user._id,
                name: user.name,
                image: user.image,
                online: conversation.status 
            };
        }));
        res.status(200).json(users);
    })
);


SupportRouter.get('/:userId' , isAuth , isAdmin , expressAsyncHandler(async(req,res)=>{
    const userId = req.params.userId 
    console.log(userId)
    const conversation = await Conversation.findOne({userId})
    res.send(conversation)
    console.log(conversation)
}))

export default SupportRouter