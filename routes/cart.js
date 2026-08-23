const { Router } = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");




const router = Router();


router.post("/add/:productId", async (req, res) => {

    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.status(404).send("Product Not Found");
    }

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [],
        });
    }

    const existingItem = cart.items.find(
        item => item.product.toString() === req.params.productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            product: req.params.productId,
            quantity: 1,
        });
    }

    await cart.save();

    return res.send("Product Added To Cart");
});



router.get("/", async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate("items.product");

    if (!cart) {
        return res.send("Cart Empty");
    }

    return res.json(cart);
});







module.exports = router;