const express = require("express");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
