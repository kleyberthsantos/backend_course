const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
    };

    const filter = query ? { category: query } : {};
    const result = await Product.paginate(filter, options);
    
    const categories = await Product.distinct('category');

    res.render('products', {
      title: 'Productos',
      payload: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      categories
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { error: 'Error al cargar los productos' });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (product) {
      res.render('productDetail', { product });
    } else {
      res.status(404).render('error', { error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (cart) {
      res.render('cart', { cartId: cart._id, products: cart.products });
    } else {
      res.status(404).render('error', { error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

module.exports = router;