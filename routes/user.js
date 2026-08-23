const { Router } = require("express");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../services/authentication");

const router = Router();

router.post("/signup", async (req, res) => {

    const { fullName, email, password } = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    return res.send("User Created");
});



router.post("/login", async (req, res) => {

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

    return res.send("Login Success");
});




module.exports = router;