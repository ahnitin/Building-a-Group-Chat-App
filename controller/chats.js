const sequelize = require("../connection/database");
const Chats = require("../models/chats");
exports.postAddChat = async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        let message = req.body.message;
        let userId = req.user.id;
        console.log(message,userId)
        let chat = await Chats.create({
            message,
            userId
        },{
            transaction:t
        })
        await t.commit();
        res.status(201).json({
            chat,
            message:"Message Sent"
        })
        
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            error:"Something Went Wrong!!"
        })
    }
}
exports.getChats = async(req,res)=>{
    try {
        
        let chats = await Chats.findAll();
        console.log("Working")
        res.status(201).json({
            chats,
            name:req.user.name,
            id:req.user.id,
        })
        
    } catch (error) {
        res.status(500).json({
            error:"Something Went Wrong!!"
        })
    }
}