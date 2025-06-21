// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const noProducts = document.getElementById('no-products');
const categoryTitle = document.getElementById('category-title');
const sortOptions = document.getElementById('sort-options');
const applyFiltersBtn = document.getElementById('apply-filters');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');

// State
let products = [];
let filteredProducts = [];
let currentCategory = new URLSearchParams(window.location.search).get('category') || 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateCategoryTitle();
});

// Load products
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/products`);
        products = await response.json();
        filteredProducts = [...products];
        applyFilters();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Apply filters
function applyFilters() {
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const maxPrice = parseInt(priceRange.value);
    const sortBy = sortOptions.value;

    // Filter products
    filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category) ||
            (currentCategory !== 'all' && product.subCategory === currentCategory);
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    // Sort products
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // For 'default', show featured items first
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });
    }

    updateProductsGrid();
}

// Update products grid
function updateProductsGrid() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }

    noProducts.classList.add('hidden');
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div class="relative aspect-w-1 aspect-h-1">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="w-full h-64 object-cover">
                <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900">
                    <a href="/product-detail.html?id=${product._id}" class="hover:text-indigo-600 transition-colors">
                        ${product.name}
                    </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">${product.category}</p>
                <div class="mt-2 flex items-center justify-between">
                    <p class="text-lg font-semibold text-gray-900">$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart('${product._id}')" 
                            class="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Add to Cart
                    </button>
                </div>
                ${product.stock < 5 ? `
                    <div class="mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Only ${product.stock} left
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update category title
function updateCategoryTitle() {
    const category = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    categoryTitle.textContent = category === 'All' ? 'All Products' : `${category}'s Accessories`;
}

// Event listeners
function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    sortOptions.addEventListener('change', applyFilters);
    
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Uncheck other checkboxes if this is a different category
                categoryCheckboxes.forEach(cb => {
                    if (cb !== checkbox && cb.value !== checkbox.value) {
                        cb.checked = false;
                    }
                });
            }
        });
    });

    // Pre-select category based on URL parameter
    if (currentCategory !== 'all') {
        const checkbox = Array.from(categoryCheckboxes)
            .find(cb => cb.value === currentCategory);
        if (checkbox) {
            checkbox.checked = true;
        }
    }
}

// Show/hide loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    productsGrid.classList.add('opacity-50');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
    productsGrid.classList.remove('opacity-50');
}

// Add to Cart
async function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        showModal(loginModal);
        return;
    }

    try {
        // In a real application, this would be an API call
        // const response = await fetch(`${API_BASE_URL}/cart/add`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     },
        //     body: JSON.stringify({
        //         productId,
        //         quantity: 1
        //     })
        // });

        showSuccess('Product added to cart!');
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add product to cart. Please try again.');
    }
}

// Helper Functions
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
} 