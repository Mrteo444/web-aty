// ===============================================
// 1. LÓGICA DEL FILTRO DE CATEGORÍAS
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    // Selecciona todos los productos (elementos con clase product-item)
    const productItems = document.querySelectorAll('.product-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const filterValue = event.target.getAttribute('data-filter');

            // 1. Manejar la clase 'active' para los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // 2. Filtrar los productos
            productItems.forEach(item => {
                // Ocultar todos los productos
                item.style.display = 'none';

                // Mostrar si es 'all' o si el producto tiene la clase de la categoría
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    // Usamos 'block' para que se muestren correctamente
                    item.style.display = 'block'; 
                }
            });
        });
    });
    
    // Llamar a la lógica del carrito una vez que el DOM esté listo
    inicializarCarrito();
});


// ===============================================
// 2. LÓGICA DEL CARRITO DE COMPRAS
// ===============================================

// Almacena los productos en el carrito
let productosCarrito = [];

function inicializarCarrito() {
    // --- Selectores del DOM ---
    const iconCart = document.querySelector('.container-cart-icon'); 
    
    // Selectores del Contenedor Principal del Carrito (Overlay + Carrito)
    const cartContainerMain = document.getElementById('cart-container-main'); // <-- Nuevo
    const closeCartBtn = document.getElementById('close-cart-btn');           // <-- Nuevo
    const rowProductContainer = document.querySelector('.row-product'); // Donde se listan los productos
    const cartEmptyElement = document.querySelector('.cart-empty');
    const cartTotalDiv = document.querySelector('.cart-total');

    // --- Selectores para WhatsApp ---
    const cartCheckoutDiv = document.querySelector('.cart-checkout');
    const btnWhatsappCheckout = document.getElementById('btn-whatsapp-checkout');
    
    // Selectores de Información (Total y Contador)
    const cartTotalElement = document.querySelector('.total-pagar');
    const contadorProductosElement = document.getElementById('contador-productos');
    
    // Selector para añadir:
    const btnsAñadirAlCarrito = document.querySelectorAll('.btn-add-cart'); 

    // --- Evento para mostrar carrito ---
    iconCart.addEventListener('click', () => {
        // Muestra el contenedor principal (overlay + carrito)
        cartContainerMain.classList.remove('hidden'); 
    });
    
    // --- NUEVO Evento para ocultar carrito con el botón X o al hacer click en el overlay ---
    closeCartBtn.addEventListener('click', () => {
        cartContainerMain.classList.add('hidden');
    });
    
    // Opcional: Cerrar el carrito si se hace clic en el overlay (fondo oscuro)
    document.querySelector('.cart-overlay').addEventListener('click', () => {
        cartContainerMain.classList.add('hidden');
    });


    // --- Evento para ENVIAR A WHATSAPP ---
    btnWhatsappCheckout.addEventListener('click', () => {
        // === ¡IMPORTANTE! CAMBIA ESTE NÚMERO ===
        const numeroTelefono = '593978667297'; // Reemplaza con tu número
        // =========================================

        // 1. Construir el mensaje
        let mensaje = '¡Hola! Quisiera hacer el siguiente pedido:\n\n';
        let totalPedido = 0;

        productosCarrito.forEach(producto => {
            const subtotal = (producto.cantidad * producto.precio).toFixed(2);
            mensaje += `*Producto:* ${producto.titulo}\n`;
            mensaje += `*Cantidad:* ${producto.cantidad}\n`;
            mensaje += `*Subtotal:* $${subtotal}\n`;
            mensaje += `--------------------\n`;
            
            totalPedido += producto.cantidad * producto.precio;
        });

        mensaje += `\n*TOTAL DEL PEDIDO: $${totalPedido.toFixed(2)}*`;

        // 2. Codificar mensaje para URL
        const mensajeCodificado = encodeURIComponent(mensaje);

        // 3. Crear la URL de WhatsApp
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        // 4. Abrir en una nueva pestaña
        window.open(urlWhatsApp, '_blank');
    });


    // --- Evento para añadir producto ---
    btnsAñadirAlCarrito.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productoDiv = e.target.closest('.item');
            if (!productoDiv) return;
            
            const infoProducto = {
                cantidad: 1,
                titulo: productoDiv.querySelector('h2').textContent,
                // Usamos parseFloat para el precio
                precio: parseFloat(productoDiv.querySelector('.price').textContent.replace('$', '').trim()), 
            };

            const existe = productosCarrito.some(producto => producto.titulo === infoProducto.titulo);

            if (existe) {
                productosCarrito = productosCarrito.map(producto => {
                    if (producto.titulo === infoProducto.titulo) {
                        producto.cantidad++;
                        return producto;
                    }
                    return producto;
                });
            } else {
                productosCarrito.push(infoProducto);
            }

            mostrarCarritoHTML();
        });
    });

    // --- Función para mostrar el carrito y calcular el total ---
    function mostrarCarritoHTML() {
        if (!productosCarrito.length) {
            cartEmptyElement.classList.remove('hidden');
            rowProductContainer.classList.add('hidden');
            cartTotalDiv.classList.add('hidden');
            cartCheckoutDiv.classList.add('hidden'); // <-- Oculta botón WhatsApp
            
            contadorProductosElement.textContent = 0;
            rowProductContainer.innerHTML = '';
            return;
        }

        cartEmptyElement.classList.add('hidden');
        rowProductContainer.classList.remove('hidden');
        cartTotalDiv.classList.remove('hidden');
        cartCheckoutDiv.classList.remove('hidden'); // <-- Muestra botón WhatsApp

        rowProductContainer.innerHTML = '';

        let total = 0;
        let totalProductos = 0;

        productosCarrito.forEach(producto => {
            const nuevoProducto = document.createElement('div');
            nuevoProducto.classList.add('cart-product');
            nuevoProducto.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${producto.cantidad}</span>
                    <p class="titulo-producto-carrito">${producto.titulo}</p>
                    <span class="precio-producto-carrito">$${producto.precio.toFixed(2)}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="icon-close" data-titulo="${producto.titulo}">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;
            rowProductContainer.appendChild(nuevoProducto);

            total += producto.cantidad * producto.precio;
            totalProductos += producto.cantidad;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        contadorProductosElement.textContent = totalProductos;

        setupRemoveListeners();
    }

    // --- Función para eliminar producto ---
    function setupRemoveListeners() {
        const iconClose = document.querySelectorAll('.icon-close');
        
        iconClose.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const tituloProducto = e.currentTarget.getAttribute('data-titulo');
                
                productosCarrito = productosCarrito.filter(
                    producto => producto.titulo !== tituloProducto
                );

                mostrarCarritoHTML();
            });
        });
    }
    
    // Inicializa la vista del carrito al cargar
    mostrarCarritoHTML(); 
}