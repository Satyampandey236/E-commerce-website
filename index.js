const express = require("express");
const { connectMongoDB } = require("./connection");
const productRoute = require("./routes/product");   // import product file in routes folder.
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const cartRouter = require("./routes/cart");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");

//admin routes and middleware import

const adminRouter = require("./routes/admin");
const { restrictToAdminOnly } = require("./middlewares/admin");


const path = require("path");


const app = express();
const PORT = 8000; 
// set engine EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));




connectMongoDB("mongodb://127.0.0.1:27017/ecommerce")
    .then(() => console.log("MongoDB Connected"));



//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));





//show name of loggedin useer and admin

const { getUser } = require("./services/authentication");

app.use((req, res, next) => {

    const uid = req.cookies?.uid;

    if (uid) {
        const user = getUser(uid);
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }

    next();
});

// app.get("/", (req, res) => {
//     res.send("E-Commerce Backend Running");
    
// });


app.get("/", (req, res) => {
    return res.render("home");
});

//products-page route


const Product = require("./models/product");

app.get("/products-page", async (req, res) => {
    const Product = require("./models/product");
    const products = await Product.find();

    return res.render("products", {
        products,
    });
});







app.use("/products", productRoute);
app.use("/user", userRoute);
app.use("/cart", restrictToLoggedInUserOnly, cartRouter);

//admin
app.use(
    "/admin",
    restrictToLoggedInUserOnly,
    restrictToAdminOnly,
    adminRouter
);


app.listen(PORT, ()=> console.log(`Server Started at PORT:${PORT}`));
