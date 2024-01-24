const Sequelize = require("sequelize")
const sequelize = require("../connection/database")
const Admin = sequelize.define("admin",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupname:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING
    }
})
module.exports = Admin;