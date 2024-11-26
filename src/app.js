require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db.config');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

connectDB();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('newProduct', async (product) => {
    try {
      io.emit('updateProducts');
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      io.emit('updateProducts');
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});