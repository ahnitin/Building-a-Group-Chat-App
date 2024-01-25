const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const path = require("path");
env.config();

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");
const passwordRoutes = require("./routes/resetPassword");

const sequelize = require("./connection/database");
const User = require("./models/user");
const Chats = require("./models/chats");
const Groups = require('./models/groups')
const ForgetPassword = require("./models/forgotpassword");
const Admin = require("./models/admin");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({
    origin:"http://127.0.0.1:5500",
    methods:["GET","POST","PUT","DELETE"]
}));
app.use(express.static("public"));
app.use(userRoutes);
app.use(chatRoutes);
app.use("/password",passwordRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})

User.hasMany(Chats)
Chats.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

User.belongsToMany(Groups,{through: 'user_group'});
Groups.belongsToMany(User,{through: 'user_group'});

Groups.hasMany(Chats);
Chats.belongsTo(Groups);

User.hasMany(Admin);
Groups.hasMany(Admin);



async function main()
{
    try {
        await sequelize.sync({force:false});
        console.log("Database Connection Successfull");
        app.listen(process.env.PORT || 3000);
        console.log("connected to Port",process.env.PORT);
    } catch (error) {
        console.log("Connection Failed")
    }
}
main();