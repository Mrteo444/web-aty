const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

// Funcion para mostrar  HTML
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};

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
                    // Usamos 'flex' si tus productos se muestran en línea, o 'block' si son uno debajo del otro.
                    // Si tienes dudas, puedes probar con 'flex'.
                    item.style.display = 'block'; 
                }
            });
        });
    });
    
    // Si necesitas que la lógica del carrito espere a los filtros, mantenla dentro de DOMContentLoaded
    inicializarCarrito();
});


// ===============================================
// 2. LÓGICA DEL CARRITO DE COMPRAS
// ===============================================

// Almacena los productos en el carrito
let productosCarrito = [];

function inicializarCarrito() {
    // --- Selectores del DOM ---
    // Selector CORREGIDO: Selecciona TODOS los botones de añadir carrito en la página
    const btnsAñadirAlCarrito = document.querySelectorAll('.btn-add-cart'); 
    
    const iconCart = document.querySelector('.icon-cart');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const rowProductContainer = document.querySelector('.row-product');
    const cartTotalElement = document.querySelector('.total-pagar');
    const contadorProductosElement = document.getElementById('contador-productos');
    const cartEmptyElement = document.querySelector('.cart-empty');
    const cartTotalDiv = document.querySelector('.cart-total');

    // --- Evento para mostrar/ocultar carrito ---
    iconCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    // --- Función para añadir producto ---
    btnsAñadirAlCarrito.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productoDiv = e.target.closest('.item');
            
            // Extraer datos del producto
            const infoProducto = {
                cantidad: 1,
                titulo: productoDiv.querySelector('h2').textContent,
                precio: parseFloat(productoDiv.querySelector('.price').textContent.replace('$', '').trim()),
            };

            // Revisar si el producto ya está en el carrito
            const existe = productosCarrito.some(producto => producto.titulo === infoProducto.titulo);

            if (existe) {
                // Si existe, solo aumenta la cantidad
                productosCarrito = productosCarrito.map(producto => {
                    if (producto.titulo === infoProducto.titulo) {
                        producto.cantidad++;
                        return producto;
                    } else {
                        return producto;
                    }
                });
            } else {
                // Si no existe, lo agrega al carrito
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
            contadorProductosElement.textContent = 0;
            rowProductContainer.innerHTML = ''; // Limpia el contenedor si está vacío
            return;
        }

        cartEmptyElement.classList.add('hidden');
        rowProductContainer.classList.remove('hidden');
        cartTotalDiv.classList.remove('hidden');
        rowProductContainer.innerHTML = ''; // Limpia el HTML para evitar duplicados

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

        // Añadir el listener para eliminar después de que los elementos se crean
        setupRemoveListeners();
    }

    // --- Función para eliminar producto ---
    function setupRemoveListeners() {
        const iconClose = document.querySelectorAll('.icon-close');
        
        iconClose.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const tituloProducto = e.target.closest('.icon-close').getAttribute('data-titulo');

                // Filtra el carrito, manteniendo solo los productos que NO coinciden con el título a eliminar
                productosCarrito = productosCarrito.filter(
                    producto => producto.titulo !== tituloProducto
                );

                mostrarCarritoHTML(); // Vuelve a renderizar el carrito
            });
        });
    }
    
    // Inicializa la vista del carrito al cargar
    mostrarCarritoHTML(); 
}