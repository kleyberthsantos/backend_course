const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars").engine;
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const viewsRouter = require("./routes/views");
const ProductManager = require("./managers/ProductManager");

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager("./data/products.json");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(express.static("public"));

app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  productManager.getProducts().then(products => {
    socket.emit("updateProducts", products);
  });

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts); 
  });

  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
