const Product = require('../models/product.model');

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        lean: true 
      };

      const filter = {};
      if (query) {
        if (query === 'available') {
          filter.stock = { $gt: 0 };
        } else {
          filter.category = query;
        }
      }

      const result = await Product.paginate(filter, options);

      const response = {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.pid);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.pid,
        req.body,
        { new: true }
      );
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
      if (deletedProduct) {
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();