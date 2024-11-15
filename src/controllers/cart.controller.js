const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await Cart.create({ products: [] });
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cart = await Cart.findById(req.params.cid).populate('products.product');
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      const cart = await Cart.findById(req.params.cid);
      const productExists = await Product.findById(req.params.pid);

      if (!cart || !productExists) {
        return res.status(404).json({ error: "Cart or Product not found" });
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === req.params.pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const cart = await Cart.findById(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.products = cart.products.filter(
        item => item.product.toString() !== req.params.pid
      );

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.cid,
        { products: req.body.products },
        { new: true }
      );
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const cart = await Cart.findById(req.params.cid);
      const productItem = cart.products.find(
        item => item.product.toString() === req.params.pid
      );

      if (!productItem) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      productItem.quantity = req.body.quantity;
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        req.params.cid,
        { products: [] },
        { new: true }
      );
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController();