// const Product = require("../models/Products.model");
const router = require("express").Router();

let ProductsModel = require('../models/Products.model')


//GET PRODUCT
router.get('/products', (req, res) => {
    ProductsModel.find()
         .then((response) => {
              res.status(200).json(response)
         })
         .catch((err) => {
              res.status(500).json({
                   error: 'Something went wrong',
                   message: err
              })
         })         
})

router.get('/:productId', (req, res) => {
    const {productId} = req.params

    ProductsModel.findById(productId)
         .then((response) => {
              res.status(200).json(response)
         })
         .catch((err) => {
              res.status(500).json({
                   error: 'Something went wrong',
                   message: err
              })
         })         
})



//CREATE
router.post('/create', (req, res) => {  
  
    const {title, desc, completed, price, categories, img} = req.body;
    console.log(req.body)

    ProductsModel.create({title, desc, completed, price, categories, img})
          .then((response) => {
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});



// //GET ALL PRODUCTS
// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   try {
//     let products;

//     if (qNew) {
//       products = await ProductsModel.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await ProductsModel.find({
//         categories: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       products = await ProductsModel.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;