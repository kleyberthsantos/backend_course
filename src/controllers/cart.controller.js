const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartController {
  async createCart(req, res) {
    try {
      const newCart = new Cart();
      await newCart.save();
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
      const { cid, pid } = req.params;
      const cart = await Cart.findByIdAndUpdate(
        cid,
        { $pull: { products: { product: pid } } },
        { new: true }
      );
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      for (const item of products) {
        const productExists = await Product.findById(item.product);
        if (!productExists) {
          return res.status(404).json({ error: `Producto ${item.product} no encontrado` });
        }
      }

      const cart = await Cart.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      );
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Cantidad inválida' });
      }

      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const existingProduct = cart.products.find(p => p.product.toString() === pid);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await Cart.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      );
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await Cart.findById(cid).populate('products.product');
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;