const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    return res.render("admin/dashboard");
});

module.exports = router;