const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const User = sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = User;