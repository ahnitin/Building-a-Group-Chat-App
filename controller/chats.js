const sequelize = require("../connection/database");
const Sequelize = require("sequelize");
const { Op, where } = require('sequelize');
const Chats = require("../models/chats");
const User = require("../models/user")
const Groups = require("../models/groups");
const Admin = require("../models/admin");
exports.postAddChat = async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        let message = req.body.message;
        let userId = req.user.id;
        let groupId = req.query.groupid;
        if(groupId == null)
        {
            return res.status(404).json({
                error:"NO Group Selected!"
            })
        }
        let chat = await Chats.create({
            message,
            userId,
            groupId,
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
        console.log("fine")
        let items = req.query.items;
        let groupid = req.query.groupid;
        if(items == undefined || NaN){
            items = "0";
        } 
        items = Number.parseInt(items)
        let group = await Groups.findByPk(groupid);
        let chats = await Chats.findAll({
            where:{
                groupId:groupid,
                id:{
                    [Op.gt]: items
                }
            }})
        // let chats = await Chats.findAll({
        //    where:{
        //     id:{
        //         [Op.gt]: items
        //     }
        //    }
        // });
        // let users = await User.findAll();
        let users = await group.getUsers();
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
exports.postAddGroup = async(req,res)=>{
    try {
        let users = req.body.users;
        let groupname = req.body.groupname;
        console.log(users,groupname,users.length,users[0])
        let Group = await Groups.create({
            name:groupname,
            createdby:req.user.name
        })
        await Group.addUser(req.user,{through:{selfGranted:false}})
        for(let i =0;i<users.length;i++)
        {
            let user = await User.findOne({where:{email:users[i]}})
            await Group.addUser(user,{through:{selfGranted:false}})
        }
        await Admin.create({
            groupname:groupname,
            email:req.user.email,
            groupId: Group.id,
            userId: req.user.id
        })
    } catch (error) {
        res.status(500).json({
            error:"Something Went Wrong!!"
        })
    }
}
exports.getGroups = async(req,res)=>{
    try {
        let groups = await req.user.getGroups();
        let admins = await req.user.getAdmins();
        res.status(201).json({
            groups,
            admins
        })
    } catch (error) {
        res.status(500).json({
            error:"Something Went Wrong!!"
        })
    }
}
exports.CreateUserAdmin = async(req,res)=>{
    try {
        let email = req.body.email;
        let groupid = req.body.groupid;
        console.log(req.body.groupid,req.body.email,"for creating admin")
        let user = await User.findOne({where:{email}});
        let group = await Groups.findByPk(groupid);
        await Admin.create({
            groupname:group.name,
            email:email,
            groupId: group.id,
            userId:user.id
        })
        return res.status(201).json({message:"Admin Created Successfully"})
        
    } catch (error) {
        res.status(500).json({
            error:"Unable to Add User as Admin!"
        })
    }
}
exports.getAllUsers = async(req,res)=>{
    try {
        let groupid = req.query.groupid;
        console.log(groupid,"ye hai group  id")
        const adminUsers = await User.findAll({
            include: [
                {
                    model: Admin,
                    where: { groupId: groupid }
                }
            ]
        });

        let group = await Groups.findByPk(groupid);
        let groupUsers = await group.getUsers();
        const gpusers = groupUsers.filter(user => {
            // Check if user ID exists in adminUsers
            return !adminUsers.some(adminUser => adminUser.id === user.id);
        });
        console.log(gpusers,"gpusers")
        const otherUsers = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: groupUsers.map(user => user.id),
                },
            },
            include: [
                {
                    model: Admin,
                    where: { groupId: groupid },
                    required: false,
                },
            ],
        });
        console.log("working")
        res.status(200).json({
            adminUsers,
            groupUsers: gpusers,
            otherUsers
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Unable to Add User as Admin!"
        })
    }
}
exports.romoveAdmin =async(req,res)=>{
    try {
        let groupid = req.body.groupid;
        let user = await User.findOne({where:{email:req.body.email}});
        await Admin.destroy({where:{userId:user.id,groupId:groupid}});
        res.status(200).json({
            message:"User is No More Admin"
        })
    } catch (error) {
        res.status(500).json({
            error:"Unable to Remove User as Admin!"
        })
    }
}
exports.romoveGroupUser=async(req,res)=>{
    try {
        let groupid = req.body.groupid;
        let user = await User.findOne({where:{email:req.body.email}});
        let group = await Groups.findByPk(groupid);
        let admin = await Admin.findOne({where:{groupId:groupid,userId:user.id}});
        if(admin)
        {
            await Admin.destroy({where:{userId:user.id,groupId:groupid}});
        }
        await group.removeUser(user);
        res.status(200).json({
            message:"User Removed Successfully"
        })
    } catch (error) {
        res.status(500).json({
            error:"Unable to Remove User From Group!"
        })
    }
}
exports.postAddUsersToGroup= async(req,res)=>{
    try {
        let arr= req.body.arr;
        let groupid = req.body.groupid;
        let Group = await Groups.findByPk(groupid);
        for(let i=0;i<arr.length;i++)
        {
            let user = await User.findOne({where:{email:arr[i]}})
            await Group.addUser(user)
        }
        res.status(201).json({
            message:"Users Added Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            error:"Unable to Add Users To Group!"
        })
    }
}