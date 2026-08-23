const { getUser } = require("../services/authentication");

function restrictToLoggedInUserOnly(req, res, next) {

    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.status(401).send("Unauthorized");
    }

    const user = getUser(userUid);

    if (!user) {
        return res.status(401).send("Unauthorized");
    }

    req.user = user;

    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
};