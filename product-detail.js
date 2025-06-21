// DOM Elements
const productImage = document.getElementById('product-image');
const productGallery = document.getElementById('product-gallery');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productStock = document.getElementById('product-stock');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// State
let currentProduct = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProduct(productId);
    } else {
        showError('Product ID not found');
    }

    // Event listeners
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', validateQuantity);
    }
});

// Load Product
async function loadProduct(productId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        
        if (response.ok) {
            currentProduct = await response.json();
            updateProductUI();
        } else {
            throw new Error('Failed to load product');
        }
    } catch (error) {
        console.error('Error loading product:', error);
        showError('Failed to load product details. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Update Product UI
function updateProductUI() {
    if (!currentProduct) return;

    // Update main image
    if (productImage) {
        productImage.src = currentProduct.imageUrl;
        productImage.alt = currentProduct.name;
    }

    // Update gallery
    if (productGallery && currentProduct.gallery) {
        productGallery.innerHTML = currentProduct.gallery.map(image => `
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src="${image}" 
                     alt="${currentProduct.name}" 
                     class="h-full w-full object-cover object-center cursor-pointer hover:opacity-75"
                     onclick="updateMainImage('${image}')">
            </div>
        `).join('');
    }

    // Update product details
    if (productName) productName.textContent = currentProduct.name;
    if (productPrice) productPrice.textContent = `$${currentProduct.price}`;
    if (productDescription) productDescription.textContent = currentProduct.description;
    if (productStock) {
        productStock.textContent = currentProduct.stock > 0 
            ? `In Stock (${currentProduct.stock} available)` 
            : 'Out of Stock';
    }

    // Update quantity input
    if (quantityInput) {
        quantityInput.max = currentProduct.stock;
        quantityInput.value = 1;
    }

    // Update add to cart button
    if (addToCartBtn) {
        addToCartBtn.disabled = currentProduct.stock === 0;
        addToCartBtn.classList.toggle('opacity-50', currentProduct.stock === 0);
    }
}

// Update Main Image
function updateMainImage(imageUrl) {
    if (productImage) {
        productImage.src = imageUrl;
    }
}

// Validate Quantity
function validateQuantity() {
    if (!currentProduct || !quantityInput) return;

    const quantity = parseInt(quantityInput.value);
    if (quantity < 1) {
        quantityInput.value = 1;
    } else if (quantity > currentProduct.stock) {
        quantityInput.value = currentProduct.stock;
    }
}

// Handle Add to Cart
async function handleAddToCart() {
    if (!currentProduct) return;

    const token = localStorage.getItem('token');
    if (!token) {
        showModal(loginModal);
        return;
    }

    const quantity = parseInt(quantityInput.value);
    if (quantity < 1 || quantity > currentProduct.stock) {
        alert('Invalid quantity');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: currentProduct._id,
                quantity: quantity
            })
        });

        if (response.ok) {
            updateCartCount();
            alert('Product added to cart');
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred while adding to cart');
    }
}

// Helper Functions
function showLoading() {
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
}

function showError(message) {
    const container = document.querySelector('.product-detail-container');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-500">${message}</p>
            </div>
        `;
    }
} 