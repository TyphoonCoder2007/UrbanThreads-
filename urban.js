// Product Data
const products = [
    {
        id: 1,
        name: "Urban Graphic Tee",
        price: 35.00,
        oldPrice: 45.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Premium cotton t-shirt with exclusive urban graphic print. Comfortable fit for everyday wear.",
        collection: "mens",
        badge: "New"
    },
    {
        id: 2,
        name: "Oversized Hoodie",
        price: 65.00,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Cozy oversized hoodie with street-style design. Perfect for layering in cooler weather.",
        collection: "womens",
        badge: "Bestseller"
    },
    {
        id: 3,
        name: "Utility Cargo Pants",
        price: 75.00,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1588099768531-a72d4a198538?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Functional cargo pants with multiple pockets. Durable fabric with urban aesthetic.",
        collection: "mens",
        badge: null
    },
    {
        id: 4,
        name: "Limited Edition Sneakers",
        price: 120.00,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Exclusive sneakers with premium materials and unique design. Limited stock available.",
        collection: "accessories",
        badge: "Limited"
    },
    {
        id: 5,
        name: "Street Style Jacket",
        price: 89.00,
        oldPrice: 110.00,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Water-resistant jacket with urban design elements. Features multiple pockets and adjustable hood.",
        collection: "mens",
        badge: "Sale"
    },
    {
        id: 6,
        name: "Urban Backpack",
        price: 55.00,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Durable backpack with laptop compartment and multiple organizational pockets.",
        collection: "accessories",
        badge: null
    }
];

// Cart Data
let cart = [];
let currentProduct = null;

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const productsGrid = document.querySelector('.products-grid');
const quickViewModal = document.querySelector('.quick-view-modal');
const modalClose = document.querySelector('.modal-close');
const toast = document.querySelector('.toast');
const newsletterForm = document.getElementById('newsletter-form');
const shopNowBtn = document.getElementById('shop-now-btn');
const saleBtn = document.getElementById('sale-btn');
const collectionBtns = document.querySelectorAll('.collection-btn');
const collectionLinks = document.querySelectorAll('.collection-link');
const navLinks = document.querySelectorAll('.nav-link');
const sizes = document.querySelectorAll('.size');
const modalAddToCart = document.getElementById('modal-add-to-cart');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    setTimeout(() => {
        document.querySelector('.loading').classList.add('hidden');
    }, 1500);

    // Render products
    renderProducts(products);

    // Event Listeners
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeAllModals);
    modalClose.addEventListener('click', closeQuickView);
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    shopNowBtn.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('collections');
    });
    saleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        filterProducts('sale');
        scrollToSection('featured');
    });

    // Collection buttons
    collectionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const collection = this.getAttribute('data-collection');
            filterProducts(collection);
            scrollToSection('featured');
        });
    });

    // Collection links
    collectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const collection = this.getAttribute('data-collection');
            filterProducts(collection);
            scrollToSection('featured');
        });
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                scrollToSection(section);
            }
            
            // Close mobile menu if open
            document.querySelector('nav').classList.remove('active');
        });
    });

    // Size selection
    sizes.forEach(size => {
        size.addEventListener('click', function() {
            sizes.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Modal add to cart
    modalAddToCart.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentProduct) {
            addToCart(currentProduct);
            closeQuickView();
        }
    });

    // Mobile menu toggle
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll to Top Button
        const scrollTop = document.querySelector('.scroll-top');
        if (window.scrollY > 500) {
            scrollTop.classList.add('active');
        } else {
            scrollTop.classList.remove('active');
        }
    });

    // Scroll to top
    document.querySelector('.scroll-top').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Countdown Timer
    setInterval(updateCountdown, 1000);

    // Product Card Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Observe collection cards
    document.querySelectorAll('.collection-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Render products to the grid
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <a href="#" class="product-action wishlist-btn" data-id="${product.id}"><i class="fas fa-heart"></i></a>
                    <a href="#" class="product-action add-to-cart-btn" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></a>
                    <a href="#" class="product-action quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i></a>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                <a href="#" class="btn add-to-cart-main" data-id="${product.id}">Add to Cart</a>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to dynamically created buttons
    document.querySelectorAll('.add-to-cart-btn, .add-to-cart-main').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        });
    });

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                openQuickView(product);
            }
        });
    });

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Added to wishlist!');
        });
    });
}

// Filter products by collection
function filterProducts(collection) {
    let filteredProducts = [];
    
    if (collection === 'sale') {
        filteredProducts = products.filter(product => product.oldPrice !== null);
    } else {
        filteredProducts = products.filter(product => product.collection === collection);
    }
    
    renderProducts(filteredProducts);
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showToast(`${product.name} added to cart!`);
}

// Update cart UI
function updateCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty</p>
                <a href="#" class="btn">Continue Shopping</a>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        // Add event listeners to cart item buttons
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, -1);
            });
        });

        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Update cart count and total
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPrice.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart');
}

// Open cart sidebar
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Open quick view modal
function openQuickView(product) {
    currentProduct = product;
    
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-add-to-cart').setAttribute('data-id', product.id);
    
    // Reset size selection
    sizes.forEach(size => size.classList.remove('active'));
    
    quickViewModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close quick view modal
function closeQuickView() {
    quickViewModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close all modals
function closeAllModals() {
    closeCartSidebar();
    closeQuickView();
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    
    // In a real application, you would send this to a server
    showToast('Thanks for subscribing! Check your email for a discount code.');
    document.getElementById('newsletter-email').value = '';
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// Countdown Timer
function updateCountdown() {
    const days = document.querySelector('.countdown-item:nth-child(1) .countdown-number');
    const hours = document.querySelector('.countdown-item:nth-child(2) .countdown-number');
    const minutes = document.querySelector('.countdown-item:nth-child(3) .countdown-number');
    const seconds = document.querySelector('.countdown-item:nth-child(4) .countdown-number');
    
    let sec = parseInt(seconds.textContent);
    sec = sec > 0 ? sec - 1 : 59;
    seconds.textContent = sec < 10 ? '0' + sec : sec;
    
    if(sec === 59) {
        let min = parseInt(minutes.textContent);
        min = min > 0 ? min - 1 : 59;
        minutes.textContent = min < 10 ? '0' + min : min;
        
        if(min === 59) {
            let hr = parseInt(hours.textContent);
            hr = hr > 0 ? hr - 1 : 23;
            hours.textContent = hr < 10 ? '0' + hr : hr;
            
            if(hr === 23) {
                let d = parseInt(days.textContent);
                d = d > 0 ? d - 1 : 0;
                days.textContent = d < 10 ? '0' + d : d;
            }
        }
    }
}
