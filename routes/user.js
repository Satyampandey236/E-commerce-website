const { Router } = require("express");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../services/authentication");

const router = Router();




router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", async (req, res) => {
     console.log(req.body);
    const { fullName, email, password } = req.body;
     

    const existingUser = await User.findOne({
        email,
    });
    
     if (existingUser) {
        return res.send("User Already Exists");
    }

    await User.create({
        fullName,
        email,
        password,
    });

    //return res.send("User Created");
    return res.redirect("/user/signin");
    
});




router.get("/signin", (req, res) => {
    return res.render("signin");
});


router.post("/signin", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password,
    });

    if (!user) {
        return res.send("Invalid Email or Password");
    }

    const sessionId = uuidv4();

    setUser(sessionId, user);

    res.cookie("uid", sessionId);

    //return res.send("Login Success");
    return res.redirect("/");
});




module.exports = router;