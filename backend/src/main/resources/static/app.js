// App State
let products = JSON.parse(localStorage.getItem('groceryProducts')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// API Base URL
const API_URL = 'http://localhost:8080/api/auth';

// DOM Elements
const views = {
    login: document.getElementById('login-view'),
    register: document.getElementById('register-view'),
    shop: document.getElementById('shop-view'),
    profile: document.getElementById('profile-view'),
    editProfile: document.getElementById('edit-profile-view'),
    addProduct: document.getElementById('add-product-view'),
    viewProducts: document.getElementById('view-products-view')
};

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addProductForm = document.getElementById('add-product-form');
const editProfileForm = document.getElementById('edit-profile-form');

// Links
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Buttons
const goToAddProductBtn = document.getElementById('go-to-add-product');
const goToViewProductsBtn = document.getElementById('go-to-view-products');
const backBtns = document.querySelectorAll('.back-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const profileIconBtn = document.getElementById('profile-icon-btn');
const profileEditBtn = document.getElementById('profile-edit-btn');

// Profile dropdown elements
const profileDropdown = document.getElementById('profile-dropdown');
const dropdownOverlay = document.getElementById('dropdown-overlay');
const menuProfile = document.getElementById('menu-profile');
const menuEditProfile = document.getElementById('menu-edit-profile');
const menuAddProduct = document.getElementById('menu-add-product');
const menuViewProducts = document.getElementById('menu-view-products');
const menuLogout = document.getElementById('menu-logout');

// Other Elements
const productsList = document.getElementById('products-list');
const productsTable = document.querySelector('#products-table');
const emptyState = document.getElementById('empty-state');
const toast = document.getElementById('toast');

// =============================
// Initialize App
// =============================
function init() {
    if (isLoggedIn && currentUser) {
        updateUIWithUserData();
        showView('shop');
    } else {
        showView('login');
    }
    setupEventListeners();
}

// =============================
// Navigation
// =============================
function showView(viewName) {
    Object.values(views).forEach(view => {
        view.classList.remove('active');
    });
    
    views[viewName].classList.add('active');
    
    // Close dropdown when navigating
    closeDropdown();
    
    // Special handling for specific views
    if (viewName === 'viewProducts') {
        renderProducts();
    }
    
    if (viewName === 'addProduct') {
        document.getElementById('product-date').valueAsDate = new Date();
    }

    if (viewName === 'profile') {
        populateProfileView();
    }

    if (viewName === 'editProfile') {
        populateEditProfileForm();
    }
}

// =============================
// Profile Dropdown
// =============================
function toggleDropdown() {
    profileDropdown.classList.toggle('open');
    dropdownOverlay.classList.toggle('open');
}

function closeDropdown() {
    profileDropdown.classList.remove('open');
    dropdownOverlay.classList.remove('open');
}

// =============================
// Update UI with User Data
// =============================
function updateUIWithUserData() {
    if (!currentUser) return;

    const firstLetter = (currentUser.userName || 'U').charAt(0).toUpperCase();

    // Header
    document.getElementById('header-shop-name').textContent = currentUser.shopName || 'My Shop';
    document.getElementById('avatar-letter').textContent = firstLetter;

    // Dropdown header
    document.getElementById('dropdown-avatar-letter').textContent = firstLetter;
    document.getElementById('dropdown-user-name').textContent = currentUser.userName || 'User';
    document.getElementById('dropdown-user-email').textContent = currentUser.email || '';

    // Shop hero
    document.getElementById('shop-display-name').textContent = currentUser.shopName || 'My Shop';
    document.getElementById('shop-display-address').textContent = currentUser.shopAddress || 'Address not set';
    document.getElementById('shop-display-license').textContent = currentUser.shopLicense || '—';
    document.getElementById('shop-display-phone').textContent = currentUser.phoneNumber || '—';
}

function populateProfileView() {
    if (!currentUser) return;
    const firstLetter = (currentUser.userName || 'U').charAt(0).toUpperCase();

    document.getElementById('profile-avatar-big').textContent = firstLetter;
    document.getElementById('profile-name-display').textContent = currentUser.userName || 'User';
    document.getElementById('profile-email-display').textContent = currentUser.email || '';
    document.getElementById('profile-shop-name').textContent = currentUser.shopName || '—';
    document.getElementById('profile-shop-address').textContent = currentUser.shopAddress || 'Not set';
    document.getElementById('profile-shop-license').textContent = currentUser.shopLicense || '—';
    document.getElementById('profile-phone').textContent = currentUser.phoneNumber || '—';
}

function populateEditProfileForm() {
    if (!currentUser) return;
    document.getElementById('edit-name').value = currentUser.userName || '';
    document.getElementById('edit-shop-name').value = currentUser.shopName || '';
    document.getElementById('edit-shop-address').value = currentUser.shopAddress || '';
    document.getElementById('edit-shop-license').value = currentUser.shopLicense || '';
    document.getElementById('edit-phone').value = currentUser.phoneNumber || '';
}

// =============================
// Event Listeners
// =============================
function setupEventListeners() {
    // Show Register View
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('register');
        });
    }

    // Show Login View
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('login');
        });
    }

    // Profile icon toggle dropdown
    profileIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Close dropdown on overlay click
    dropdownOverlay.addEventListener('click', closeDropdown);

    // Dropdown menu items
    menuProfile.addEventListener('click', () => showView('profile'));
    menuEditProfile.addEventListener('click', () => showView('editProfile'));
    menuAddProduct.addEventListener('click', () => showView('addProduct'));
    menuViewProducts.addEventListener('click', () => showView('viewProducts'));
    menuLogout.addEventListener('click', () => {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        showToast('Logged out successfully');
        showView('login');
    });

    // =============================
    // Register
    // =============================
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const user = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value,
                shopName: document.getElementById('reg-shop-name').value,
                shopAddress: document.getElementById('reg-shop-address').value,
                shopLicense: document.getElementById('reg-shop-license').value,
                phoneNumber: document.getElementById('reg-phone').value
            };

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showToast('Registration successful! Please login.');
                    showView('login');
                    registerForm.reset();
                } else {
                    showToast(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showToast('Unable to connect to the server', 'error');
                console.error('Error:', error);
            }
        });
    }

    // =============================
    // Login
    // =============================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showToast('Please enter both email and password', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                isLoggedIn = true;
                currentUser = data;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(data));
                
                updateUIWithUserData();
                showToast('Login successful!');
                showView('shop');
                loginForm.reset();
            } else {
                showToast(data.message || 'Invalid credentials', 'error');
            }
        } catch (error) {
            showToast('Unable to connect to the server', 'error');
            console.error('Error:', error);
        }
    });

    // =============================
    // Edit Profile
    // =============================
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updates = {
            name: document.getElementById('edit-name').value,
            shopName: document.getElementById('edit-shop-name').value,
            shopAddress: document.getElementById('edit-shop-address').value,
            shopLicense: document.getElementById('edit-shop-license').value,
            phoneNumber: document.getElementById('edit-phone').value
        };

        try {
            const response = await fetch(`${API_URL}/profile/${currentUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user data
                currentUser.userName = updates.name;
                currentUser.shopName = updates.shopName;
                currentUser.shopAddress = updates.shopAddress;
                currentUser.shopLicense = updates.shopLicense;
                currentUser.phoneNumber = updates.phoneNumber;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                updateUIWithUserData();
                showToast('Profile updated successfully!');
                showView('profile');
            } else {
                showToast(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            showToast('Unable to connect to the server', 'error');
            console.error('Error:', error);
        }
    });

    // Profile edit button
    profileEditBtn.addEventListener('click', () => showView('editProfile'));
    
    // Dashboard Navigation
    goToAddProductBtn.addEventListener('click', () => showView('addProduct'));
    goToViewProductsBtn.addEventListener('click', () => showView('viewProducts'));
    emptyAddBtn.addEventListener('click', () => showView('addProduct'));
    
    // Back Buttons
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-back') || 'shop';
            showView(target);
        });
    });
    
    // =============================
    // Add Product
    // =============================
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProduct = {
            id: document.getElementById('product-id').value,
            name: document.getElementById('product-name').value,
            quantity: parseInt(document.getElementById('product-quantity').value),
            price: parseFloat(document.getElementById('product-price').value),
            date: document.getElementById('product-date').value,
            timestamp: Date.now()
        };
        
        // Check if ID already exists
        if (products.some(p => p.id === newProduct.id)) {
            showToast('Product ID already exists!', 'error');
            return;
        }
        
        products.push(newProduct);
        saveProducts();
        
        showToast('Product added successfully!');
        addProductForm.reset();
        
        setTimeout(() => {
            showView('shop');
        }, 1500);
    });
}

// =============================
// Render Products Table
// =============================
function renderProducts() {
    if (products.length === 0) {
        productsTable.style.display = 'none';
        emptyState.classList.remove('hidden');
    } else {
        productsTable.style.display = 'table';
        emptyState.classList.add('hidden');
        
        const sortedProducts = [...products].sort((a, b) => b.timestamp - a.timestamp);
        
        productsList.innerHTML = sortedProducts.map(product => `
            <tr>
                <td><strong>${product.id}</strong></td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${formatDate(product.date)}</td>
            </tr>
        `).join('');
    }
}

// =============================
// Helpers
// =============================
function saveProducts() {
    localStorage.setItem('groceryProducts', JSON.stringify(products));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    
    if (type === 'error') {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Start App
init();
