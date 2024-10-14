const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product === productId
      );
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        carts[cartIndex].products.push({ product: productId, quantity: 1 });
      }
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return carts[cartIndex];
    }
    throw new Error("Cart not found");
  }
}

module.exports = CartManager;
