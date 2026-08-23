const { Schema, model } = require("mongoose");

const productSchema = new Schema(
{
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    stock: {
        type: Number,
        default: 1,
    },

    category: {
        type: String,
        required: true,
    },

    productImageURL: {
        type: String,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
}
);

const Product = model("Product", productSchema);

module.exports = Product;