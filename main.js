// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');
const loginBtn = document.getElementById('login-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const cartCount = document.getElementById('cart-count');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    setupEventListeners();
    updateCartCount();
});

// Load featured products when the page loads
async function loadFeaturedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products?featured=true');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading featured products:', error);
        featuredProductsContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">Failed to load products. Please try again later.</p>';
    }
}

// Function to display products
function displayProducts(products) {
    if (!products || products.length === 0) {
        featuredProductsContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full animate-fadeIn">No featured products available.</p>';
        return;
    }

    const productsHTML = products.map((product, index) => `
        <div class="product-card group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
             style="animation-delay: ${index * 100}ms">
            <div class="relative w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-lg overflow-hidden">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image w-full h-full object-center object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                <button onclick="addToCart('${product._id}')" 
                        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 
                               bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add to Cart
                </button>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                            <a href="/product-detail.html?id=${product._id}">
                                <span aria-hidden="true" class="absolute inset-0"></span>
                                ${product.name}
                            </a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">${product.category}</p>
                    </div>
                    <p class="price-tag text-lg font-semibold text-gray-900">$${product.price.toFixed(2)}</p>
                </div>
                <div class="mt-2">
                    <p class="text-sm text-gray-600 line-clamp-2">${product.description}</p>
                </div>
                <div class="mt-3 flex items-center">
                    <div class="flex items-center">
                        ${Array(5).fill().map((_, i) => `
                            <svg class="w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <span class="ml-2 text-sm text-gray-500">(${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                ${product.stock < 5 ? `
                    <div class="mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Only ${product.stock} left in stock
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    featuredProductsContainer.innerHTML = productsHTML;
}

// Add to Cart
async function addToCart(productId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showLoginModal();
            return;
        }

        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        
        const result = await response.json();
        updateCartCount();
        showSuccess('Product added to cart!');
    } catch (error) {
        showError('Failed to add product to cart');
        console.error('Error:', error);
    }
}

// Update Cart Count
async function updateCartCount() {
    try {
        const token = localStorage.getItem('token');
        if (!token || !cartCount) return;

        const response = await fetch('http://localhost:5000/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch cart');
        
        const cart = await response.json();
        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Show Success Message with enhanced animation
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.style.transform = 'translateX(0)', 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show Error Message with enhanced animation
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.style.transform = 'translateX(0)', 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading Indicator
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
}

// Modal Functions
function showLoginModal() {
    if (loginModal) {
        loginModal.classList.remove('hidden');
    }
}

function hideLoginModal() {
    if (loginModal) {
        loginModal.classList.add('hidden');
    }
}

// Event Listeners
function setupEventListeners() {
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }

    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', showLoginModal);
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('hidden');
            registerModal.classList.remove('hidden');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        });
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideLoginModal();
        }
        if (e.target === registerModal) {
            registerModal.classList.add('hidden');
        }
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            const email = loginForm.querySelector('[name="email"]').value;
            const password = loginForm.querySelector('[name="password"]').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) throw new Error('Login failed');

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Update UI
                updateUIAfterLogin(data.user);
                hideLoginModal();
                updateCartCount();
                showSuccess('Logged in successfully!');
                
                // Clear form
                loginForm.reset();
            } catch (error) {
                showError('Login failed. Please try again.');
            } finally {
                hideLoading();
            }
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            const name = registerForm.querySelector('[name="name"]').value;
            const email = registerForm.querySelector('[name="email"]').value;
            const password = registerForm.querySelector('[name="password"]').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (!response.ok) throw new Error('Registration failed');

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Update UI
                updateUIAfterLogin(data.user);
                registerModal.classList.add('hidden');
                updateCartCount();
                showSuccess('Registered successfully!');
                
                // Clear form
                registerForm.reset();
            } catch (error) {
                showError('Registration failed. Please try again.');
            } finally {
                hideLoading();
            }
        });
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
        updateUIAfterLogin(user);
    }
}

// Function to update UI after successful login
function updateUIAfterLogin(user) {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${user.name}</span>
                <button onclick="logout()" class="text-sm text-red-500 hover:text-red-700">(Logout)</button>
            </div>
        `;
    }

    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${user.name}</span>
                <button onclick="logout()" class="text-sm text-red-500 hover:text-red-700">(Logout)</button>
            </div>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
} 