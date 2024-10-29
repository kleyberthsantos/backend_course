const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  const groupedProducts = products.reduce((acc, product) => {
    const key = product.code;
    if (!acc[key]) {
      acc[key] = { ...product, quantity: 0 };
    }
    acc[key].quantity += product.stock;
    return acc;
  }, {});

  const finalProducts = Object.values(groupedProducts);

  res.render("home", { products: finalProducts });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;