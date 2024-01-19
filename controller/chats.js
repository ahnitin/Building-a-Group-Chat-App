const sequelize = require("../connection/database");
const { Op } = require('sequelize');
const Chats = require("../models/chats");
const User = require("../models/user")
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
        let items = req.query.items;
        if(items == undefined || NaN){
            items = "0";
        } 
        console.log(items,"ye hain items")
        items = Number.parseInt(items)
        
        let chats = await Chats.findAll({
           where:{
            id:{
                [Op.gt]: items
            }
           }
        });
        if(chats == undefined)
        {
            console.log("it's undefined")
        }
        let users = await User.findAll();
        console.log("Working")
        res.status(201).json({
            chats,
            name:req.user.name,
            id:req.user.id,
            users
        })
        
    } catch (error) {
        res.status(500).json({
            error:"Something Went Wrong!!"
        })
    }
}