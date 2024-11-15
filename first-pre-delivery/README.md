**Primera Entrega**

**Objetivos**

Desarrollar un servidor basado en Node.JS y Express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: `/products` y `/carts`. Dichos endpoints estarán implementados con el router de Express, con las siguientes especificaciones:

**Rutas de Productos**

El router de productos se encuentra en `/api/products/`, configurado con las siguientes rutas:

* **GET /**: Listar todos los productos de la base, incluyendo la limitación `?limit` del desafío anterior.
* **GET /:pid**: Traer solo el producto con el id proporcionado.
* **POST /**: Agregar un nuevo producto con los campos:
	+ id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
	+ title: String,
	+ description: String
	+ code: String
	+ price: Number
	+ status: Boolean (default: true)
	+ stock: Number (default: 0)
	+ category: String
	+ thumbnails: Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
	+ Status es true por defecto.
	+ Todos los campos son obligatorios, a excepción de thumbnails
* **PUT /:pid**: Tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
* **DELETE /:pid**: Eliminar el producto con el pid indicado.

**Rutas de Carritos**

El router de carritos se encuentra en `/api/carts/`, configurado con las siguientes rutas:

* **POST /**: Crear un nuevo carrito con la siguiente estructura:
	+ Id: Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
	+ products: Array que contendrá objetos que representen cada producto
* **GET /:cid**: Listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
* **POST /:cid/product/:pid**: Agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
	+ product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
	+ quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
	Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.

**Persistencia de la Información**

La persistencia de la información se implementará utilizando el file system, donde los archivos “productos.json” y “carrito.json”, respaldan la información.

**Notas**

No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.
