const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const Groups = sequelize.define("group",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    createdby:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})
module.exports = Groups
