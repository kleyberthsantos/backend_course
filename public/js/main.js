const socket = io();

// Manejo de eventos de WebSocket
socket.on('updateProducts', () => {
  location.reload();
});

socket.on('error', (error) => {
  alert(error);
});

// Funciones auxiliares
function createCart() {
  fetch('/api/carts', {
    method: 'POST'
  })
  .then(response => response.json())
  .then(cart => {
    localStorage.setItem('cartId', cart._id);
    updateCartLink();
  })
  .catch(error => console.error('Error:', error));
}

function updateCartLink() {
  const cartId = localStorage.getItem('cartId');
  const cartLink = document.getElementById('cart-link');
  if (cartId) {
    cartLink.href = `/carts/${cartId}`;
    cartLink.textContent = 'Ver Carrito';
  } else {
    cartLink.href = '#';
    cartLink.textContent = 'Carrito';
    createCart();
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateCartLink();
});