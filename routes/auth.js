var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");
const { blogsDB } = require("../mongo");

const createUser = async = (username, passwordHash) => {
    const collection = await blogsDB().collection("users")

    const user = {
          username: username, 
          password: passwordHash,
          uid: uuid() // uid stands for User ID. This will be a unique string that we will can to identify our user
        }

    try {
    await collection.insertOne({user});
    return true;
    } catch (e) {
    console.error(e);
    return false;
    }

}

router.post("/register-user", async function (req, res, next){
    try {
        const username = req.body.username;
        const password = req.body.password;
        const saltRounds = 5;
        const salt = await bcrypt.genSalt(saltRounds); 
        const hash = await bcrypt.hash(password, salt)
        const userSaveSuccess = await createUser(username, hash);
        res.status(200).json({success: userSaveSuccess})
    } catch(e) {
        res.status(400).json({success: false, message: "Error" + e});
    }
})

router.post("/login-user", async function (req, res, next) {
    const collection = await blogsDB().collection("users");

    try {
        const user = await collection.findOne({
          username: req.body.username
        });
        const match = await bcrypt.compare(req.body.password, user.password);
        res.status(200).json({success: true})
    } catch(e) {
        res.status(400).json({success: false, message: "Error" + e});
    }
})


module.exports = router;
