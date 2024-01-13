const User = require("../models/user");
const bcrypt = require("bcrypt");
const sequelize = require("../connection/database");
exports.postSignup = async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        let name = req.body.name;
        let email = req.body.email;
        let phone = req.body.phone;
        let password = req.body.password;
        let userWithEmail = await User.findOne({where:{
            email
        }})
        let userWithPhone = await User.findOne({where:{
            phone
        }})
        if(userWithEmail || userWithPhone)
        {
            return res.status(401).json({
                error: "User Already Exists"
            })
        }
        let saltrounds = 10;
        let hash = await bcrypt.hash(password,saltrounds);
        await User.create({
            name,
            email,
            phone,
            password:hash
        })
        await t.commit();
        res.status(201).json({
            message:"User Created Successfully"
        })
        
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            error:"Something Went Wrong !!"
        })
    }
}