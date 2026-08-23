const Product = require("../models/product");

const upload = require("../services/multer");

const {restrictToAdminOnly,} = require("../middlewares/admin");
const { Router } = require("express");
const {
    restrictToLoggedInUserOnly,
} = require("../middlewares/auth");

const router = Router();

router.get("/", async (req, res) => {

    const allProducts = await Product.find({});

    return res.json(allProducts);
});

router.get(
    "/secret",
    restrictToLoggedInUserOnly,
    (req, res) => {
        return res.send(
            `Welcome ${req.user.fullName}`
        );
    }
);

router.get(
    "/admin",
    restrictToLoggedInUserOnly,
    restrictToAdminOnly,
    (req, res) => {
        return res.send("Admin Access Granted");
    }
);



// yaha product add karange.
router.post(
    "/add",
    restrictToLoggedInUserOnly,
    restrictToAdminOnly,
    upload.single("productImage"),
    async (req, res) => {

        const {
            title,
            description,
            price,
            stock,
            category,
        } = req.body;

        await Product.create({
            title,
            description,
            price,
            stock,
            category,
            productImageURL: `/uploads/${req.file.filename}`,
            createdBy: req.user._id,
        });

        return res.send("Product Created Successfully");
    }
);

// abb ham product ke details fetch karange
router.get("/", async (req, res) => {

    const allProducts = await Product.find({});

    return res.json(allProducts);
});



//Ab product detail page ke liye ek product fetch karenge.
router.get("/:id", async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Product Not Found");
    }

    return res.json(product);
});

//patch method :(Admin Product Delete API) banayenge. Ye ecommerce CRUD ka final part hoga.

router.patch(
    "/edit/:id",
    restrictToLoggedInUserOnly,
    restrictToAdminOnly,
    async (req, res) => {

        const productId = req.params.id;

        await Product.findByIdAndUpdate(
            productId,
            req.body
        );

        return res.send("Product Updated Successfully");
    }
);


router.delete(
    "/delete/:id",
    restrictToLoggedInUserOnly,
    restrictToAdminOnly,
    async (req, res) => {

        const productId = req.params.id;

        await Product.findByIdAndDelete(productId);

        return res.send("Product Deleted Successfully");
    }
);

module.exports = router;