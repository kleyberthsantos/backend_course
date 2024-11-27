const Cart = require('../models/cart.model');

class CartManager {
  async createCart() {
    const cart = new Cart();
    return await cart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    );
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await Cart.findOneAndUpdate(
      { _id: cartId, 'products.product': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );
  }
}

module.exports = new CartManager();