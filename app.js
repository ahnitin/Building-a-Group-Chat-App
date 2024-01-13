const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const path = require("path");
env.config();

const userRoutes = require("./routes/user");

const sequelize = require("./connection/database");
const User = require("./models/user");

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({
    origin:"http://localhost:127.0.0.1:5500",
    methods:["GET","POST","PUT","DELETE"]
}));
app.use(express.static("public"));
app.use(userRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})


async function main()
{
    try {
        await sequelize.sync({force:true});
        console.log("Database Connection Successfull");
        app.listen(process.env.PORT || 3000);
        console.log("connected to Port",process.env.PORT);
    } catch (error) {
        console.log("Connection Failed")
    }
}
main();