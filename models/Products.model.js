const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { 
            type: String, 
            required: true, 
            unique: true 
           },
    
    desc: { 
           type: String, 
           required: true 
          },
    
    img: String,

    categories: { 
                 type: Array 
                },

    price: { 
            type: Number, 
            required: true 
           },
  },
    { timestamps: true }
);
let ProductsModel = mongoose.model("Product", ProductSchema);

module.exports = ProductsModel;