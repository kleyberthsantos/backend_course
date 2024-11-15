const express = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const cartManager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const productExists = await ProductManager.getProductById(req.params.pid);
    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
