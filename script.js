// Variables globales
let productos = [];
let currentCategory = 'all';

// Mapa de categorías
const categoriasMap = {
    'frutas-verduras': 'Frutas y Verduras',
    'panaderia': 'Panadería',
    'carnes': 'Carnes',
    'pescado': 'Pescado',
    'bebidas': 'Bebidas',
    'limpieza': 'Limpieza',
    'dulces-snacks': 'Dulces y Snacks',
    'all': 'Todos los Productos'
};

// Obtener parámetros de URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Estrellas
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star star"></i>';
        } else {
            stars += '<i class="far fa-star star empty"></i>';
        }
    }
    return stars;
}

// Tarjeta producto
function crearProductCard(producto, esDestacado = false) {
    return `
        <div class="product-card" data-id="${producto.id}">
            ${producto.temporada ? '<div class="product-badge season"><i class="fas fa-leaf"></i> Temporada</div>' : ''}
            ${esDestacado ? '<div class="product-badge featured">DESTACADO</div>' : ''}
            <img class="product-image" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="product-content">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-rating">
                    <div class="stars-container">${renderStars(producto.rating)}</div>
                    <span class="rating-value">(${producto.rating})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">€${producto.precio.toFixed(2)}</div>
                    <a href="https://super-click.alesismedia.es/producto?id=${producto.id}" class="product-button view-product">Ver producto</a>
                </div>
            </div>
        </div>
    `;
}

// Cargar JSON
async function cargarProductos() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
        const data = await response.json();
        return data.productos;
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Datos de respaldo
        return [
            {
                id: 61,
                nombre: "Turrón de Almendra Premium",
                categoria: "dulces-snacks",
                precio: 8.99,
                imagen: "https://placehold.co/600x600/FFCC66/FFFFFF?text=Turrón",
                descripcion: "Turrón artesanal de almendra premium",
                rating: 4.8,
                stock: true,
                temporada: true,
                destacado: true
            },
            {
                id: 21,
                nombre: "Jamón Serrano Reserva",
                categoria: "carnes",
                precio: 45.99,
                imagen: "https://placehold.co/600x600/CC6666/FFFFFF?text=Jamón+Serrano",
                descripcion: "Jamón serrano reserva curado 24 meses",
                rating: 4.9,
                stock: true,
                temporada: true,
                destacado: true
            },
            {
                id: 1,
                nombre: "Manzanas Gala",
                categoria: "frutas-verduras",
                precio: 2.99,
                imagen: "https://placehold.co/600x600/33CC66/FFFFFF?text=Manzanas",
                descripcion: "Manzanas frescas de temporada",
                rating: 4.5,
                stock: true,
                temporada: true,
                destacado: false
            }
        ];
    }
}

// Inicializa index
async function initIndex() {
    productos = await cargarProductos();
    
    const productosDestacados = productos.filter(p => p.destacado);
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) {
        featuredGrid.innerHTML = productosDestacados.map(p => crearProductCard(p, true)).join('');
    }
    
    const allProductsGrid = document.getElementById('all-products');
    if (allProductsGrid) {
        allProductsGrid.innerHTML = productos.map(p => crearProductCard(p)).join('');
    }
    
    const hash = window.location.hash;
    if (hash) {
        const categoriaId = hash.replace('#', '');
        if (categoriaId in categoriasMap) {
            filtrarPorCategoria(categoriaId, false);
        }
    }
    
    setupEventListeners();
    setupNavigation();
}

// Detalles productos
async function initProducto() {
    productos = await cargarProductos();
    const productoId = parseInt(getQueryParam('id'));
    const producto = productos.find(p => p.id === productoId);
    const container = document.getElementById('product-detail-container');
    
    if (producto && container) {
        container.innerHTML = `
            <div class="detail-image-container">
                <img class="detail-image" src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="detail-content">
                <div class="detail-header">
                    <h1 class="detail-title">${producto.nombre}</h1>
                    ${producto.destacado ? '<span class="detail-badge">PRODUCTO DESTACADO</span>' : ''}
                </div>
                ${producto.temporada ? '<div class="detail-season"><i class="fas fa-leaf"></i><span>Producto de temporada</span></div>' : ''}
                <p class="detail-description">${producto.descripcion}</p>
                <div class="detail-rating">
                    <div class="stars-container">${renderStars(producto.rating)}</div>
                    <span class="rating-count">${producto.rating} (${Math.floor(producto.rating * 12)} valoraciones)</span>
                </div>
                <div class="detail-price">€${producto.precio.toFixed(2)}</div>
                <div class="detail-availability ${producto.stock ? 'available' : 'unavailable'}">
                    <span class="availability-text">
                        <i class="fas fa-${producto.stock ? 'check' : 'times'}"></i>
                        ${producto.stock ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
                <a href="https://super-click.alesismedia.es/informacion?id=${producto.id}" class="detail-button info-button">Más información</a>
            </div>
        `;
    }
    
    setupEventListeners();
    setupNavigation();
}

// Info de productos
async function initInformacion() {
    productos = await cargarProductos();
    const productoId = parseInt(getQueryParam('id'));
    const producto = productos.find(p => p.id === productoId);
    const container = document.getElementById('info-content-container');
    const backButton = document.getElementById('back-to-product-link');
    
    if (producto && container) {
        container.innerHTML = `
            <div class="info-header">
                <h1 class="info-title">${producto.nombre}</h1>
                <div class="info-category">${categoriasMap[producto.categoria] || producto.categoria}</div>
                <div class="info-badges">
                    ${producto.temporada ? '<span class="info-badge season"><i class="fas fa-leaf"></i> Producto de Temporada</span>' : ''}
                    ${producto.destacado ? '<span class="info-badge featured">Producto Destacado</span>' : ''}
                </div>
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <h3>Información del Producto</h3>
                    <ul>
                        <li><strong>ID del Producto:</strong> ${producto.id}</li>
                        <li><strong>Categoría:</strong> ${categoriasMap[producto.categoria] || producto.categoria}</li>
                        <li><strong>Precio:</strong> €${producto.precio.toFixed(2)}</li>
                        <li><strong>Valoración:</strong> ${producto.rating}/5 ${renderStars(producto.rating)}</li>
                        <li><strong>Estado:</strong> ${producto.stock ? 'Disponible' : 'No disponible'}</li>
                    </ul>
                </div>
                
                <div class="info-card">
                    <h3>Detalles Adicionales</h3>
                    <ul>
                        <li><strong>Disponibilidad:</strong> ${producto.stock ? 'En stock' : 'Agotado'}</li>
                        <li><strong>Temporada:</strong> ${producto.temporada ? 'Sí' : 'No'}</li>
                        <li><strong>Destacado:</strong> ${producto.destacado ? 'Sí' : 'No'}</li>
                        <li><strong>Valoraciones estimadas:</strong> ${Math.floor(producto.rating * 12)}</li>
                    </ul>
                </div>
            </div>
            
            <div class="info-card" style="grid-column: 1 / -1; margin-top: 20px;">
                <h3>Descripción Completa</h3>
                <p>${producto.descripcion}</p>
            </div>
        `;
        
        if (backButton) {
            backButton.href = `https://super-click.alesismedia.es/producto?id=${producto.id}`;
        }
    }
    
    setupEventListeners();
    setupNavigation();
}

function filtrarPorCategoria(categoriaId, doScroll = true) {
    currentCategory = categoriaId;
    
    const productosFiltrados = categoriaId === 'all' 
        ? productos 
        : productos.filter(p => p.categoria === categoriaId);
    
    const allProductsGrid = document.getElementById('all-products');
    if (allProductsGrid) {
        if (productosFiltrados.length === 0) {
            allProductsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No hay productos en esta categoría</h3>
                    <p>Prueba con otra categoría</p>
                </div>
            `;
        } else {
            allProductsGrid.innerHTML = productosFiltrados.map(p => crearProductCard(p)).join('');
        }
        
        const tituloSeccion = document.querySelector('.products-section .section-title');
        if (tituloSeccion) {
            tituloSeccion.textContent = categoriasMap[categoriaId] || 'Productos';
        }
        
        updateActiveNavigation(categoriaId);
        
        if (doScroll) {
            if (categoriaId === 'all') {
                // Si es Todos sube pa arriba
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                // Si es otra categoria se mueve a los productos
                setTimeout(() => {
                    const seccionProductos = document.getElementById('productos-section');
                    if (seccionProductos) {
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 100;
                        
                        const targetPosition = seccionProductos.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                    }
                }, 100);
            }
        }
    }
}

function updateActiveNavigation(categoriaId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.href.includes('https://super-click.alesismedia.es/inicio')) {
            if (categoriaId === 'all' && !link.hasAttribute('data-category')) {
                link.classList.add('active');
            } else if (link.getAttribute('data-category') === categoriaId) {
                link.classList.add('active');
            }
        }
    });
}


function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-category]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('https://super-click.alesismedia.es/inicio')) {
                e.preventDefault();
                const categoriaId = this.getAttribute('data-category');
                filtrarPorCategoria(categoriaId);
            }
        });
    });
    
    // Enlace Todos
    const allLink = document.querySelector('.nav-link[href="https://super-click.alesismedia.es/inicio"]:not([data-category])');
    if (allLink) {
        allLink.addEventListener('click', function(e) {
            e.preventDefault();
            filtrarPorCategoria('all');
        });
    }
}

function setupEventListeners() {
    const botonArriba = document.getElementById('ir-arriba');
    if (botonArriba) {
        window.addEventListener('scroll', function() {
            botonArriba.classList.toggle('visible', window.scrollY > 500);
        });
        
        botonArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path.includes('https://super-click.alesismedia.es/producto')) {
        initProducto();
    } else if (path.includes('https://super-click.alesismedia.es/informacion')) {
        initInformacion();
    } else {
        initIndex();
    }
});