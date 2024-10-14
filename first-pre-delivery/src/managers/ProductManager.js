const fs = require('fs').promises;
const crypto = require("crypto");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  generateShortId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
        id: this.generateShortId(),
      ...productData,
      status: productData.status !== undefined ? productData.status : true
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updateData, id };
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length < products.length) {
      await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    } else {
      throw new Error('Product not found');
    }
  }
}

module.exports = ProductManager;