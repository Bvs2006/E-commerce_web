// Home Page JavaScript

let allProducts = getAllProducts();
let filteredProducts = [...allProducts];
let currentFilter = 'all';
let currentSlide = 0;
let bannerInterval;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
	const user = storageManager.getUser();
	if (user) {
		updateUserMenu(user);
	} else {
		updateUserMenuGuest();
	}

	loadProducts();
	initBannerSlider();
	updateCartBadge();
	updateWishlistBadge();
	setupSearchListener();
});

function updateUserMenu(user) {
	const userDropdown = document.getElementById('userDropdown');
	if (userDropdown) {
		const userLink = userDropdown.querySelector('a:first-child');
		if (userLink) {
			userLink.innerHTML = `<i class="fas fa-user"></i> ${user.firstName || user.name}`;
		}
	}
}

function updateUserMenuGuest() {
	const headerIcons = document.querySelector('.header-icons');
	if (headerIcons) {
		const userMenu = headerIcons.querySelector('.user-menu');
		if (userMenu) {
			userMenu.innerHTML = `
				<button onclick="window.location.href='pages/auth/login.html'" title="Login">
					<i class="fas fa-sign-in-alt"></i>
				</button>
			`;
		}
	}
}

function toggleUserMenu() {
	const dropdown = document.getElementById('userDropdown');
	if (dropdown) {
		dropdown.classList.toggle('show');
	}
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
	const userMenu = document.querySelector('.user-menu');
	if (userMenu && !userMenu.contains(e.target)) {
		const dropdown = document.getElementById('userDropdown');
		if (dropdown) {
			dropdown.classList.remove('show');
		}
	}
});

function logout() {
	showToast('Logging out...', 'info');
	setTimeout(() => {
		storageManager.logout();
	}, 500);
}

// Load and display products
function loadProducts() {
	const grid = document.getElementById('productsGrid');
	if (!grid) return;

	grid.innerHTML = filteredProducts.map(product => `
		<div class="product-card">
			<div class="product-image" onclick="window.location.href='pages/product-detail.html?id=${product.id}'" style="cursor: pointer;">
				<img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
				${product.sold > 100 ? `<span class="product-badge">Best Seller</span>` : ''}
			</div>
			<div class="product-info">
				<div class="product-name" onclick="window.location.href='pages/product-detail.html?id=${product.id}'" style="cursor: pointer;">${product.name}</div>
				<div class="product-seller">by ${product.seller}</div>
				<div class="product-rating">
					${createStarRating(product.rating)}
					<span>(${product.reviews})</span>
				</div>
				<div class="product-price">
					<span class="price-original">₹${product.price.toFixed(2)}</span>
					<span class="price-current">₹${product.discountPrice.toFixed(2)}</span>
				</div>
				<div class="product-actions">
					<button class="btn btn-add" onclick="addToCart(${product.id})">
						<i class="fas fa-shopping-bag"></i> Add
					</button>
					<button class="btn-wishlist ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
						<i class="fas fa-heart"></i>
					</button>
				</div>
			</div>
		</div>
	`).join('');
}


function isInWishlist(productId) {
	const wishlist = storageManager.getWishlist();
	return wishlist.some(item => item.id === productId);
}

function toggleWishlist(productId) {
	const allProducts = getAllProducts();
	const product = allProducts.find(p => p.id === productId);
	if (!product) return;

	let wishlist = storageManager.getWishlist();
	const index = wishlist.findIndex(item => item.id === productId);

	if (index > -1) {
		wishlist.splice(index, 1);
		showToast('Removed from wishlist', 'info');
	} else {
		wishlist.push(product);
		showToast('Added to wishlist', 'success');
	}

	storageManager.setWishlist(wishlist);
	updateWishlistBadge();
	loadProducts();
}

function addToCart(productId) {
	const user = storageManager.getUser();
	if (!user) {
		showToast('Please login to add to cart', 'warning');
		setTimeout(() => {
			window.location.href = 'pages/auth/login.html';
		}, 1000);
		return;
	}

	const allProducts = getAllProducts();
	const product = allProducts.find(p => p.id === productId);
	if (!product) return;

	let cart = storageManager.getCart();
	const cartItem = cart.find(item => item.id === productId);

	if (cartItem) {
		cartItem.quantity = (cartItem.quantity || 1) + 1;
	} else {
		cart.push({ ...product, quantity: 1 });
	}

	storageManager.setCart(cart);
	updateCartBadge();
	updateCartModal();
	showToast('Added to cart!', 'success');
}

function updateCartModal() {
	const cartItemsDiv = document.getElementById('cartItems');
	const subtotalDiv = document.getElementById('subtotal');

	if (!cartItemsDiv) return;

	const cart = storageManager.getCart();

	if (cart.length === 0) {
		cartItemsDiv.innerHTML = `
			<div class="empty-state">
				<i class="fas fa-shopping-bag"></i>
				<p>Your cart is empty</p>
				<a href="pages/products.html" class="btn" style="margin-top: 10px;">Continue Shopping</a>
			</div>
		`;
		if (subtotalDiv) subtotalDiv.textContent = '₹0.00';
		return;
	}

	let subtotal = 0;
	cartItemsDiv.innerHTML = cart.map(item => {
		const price = item.discountPrice || item.price || 0;
		const qty = item.quantity || 1;
		const itemTotal = price * qty;
		subtotal += itemTotal;
		return `
			<div class="cart-item">
				<img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80'">
				<div class="item-info">
					<h5>${item.name}</h5>
					<p class="price-current">₹${item.discountPrice.toFixed(2)}</p>
					<div class="item-quantity">
						<button onclick="updateQty(${item.id}, -1)">−</button>
						<span>${item.quantity || 1}</span>
						<button onclick="updateQty(${item.id}, 1)">+</button>
					</div>
				</div>
				<span class="item-remove" onclick="removeFromCart(${item.id})">
					<i class="fas fa-trash"></i>
				</span>
			</div>
		`;
	}).join('');

	if (subtotalDiv) subtotalDiv.textContent = formatCurrency(subtotal);
}

function updateQty(productId, change) {
	let cart = storageManager.getCart();
	const item = cart.find(p => p.id === productId);
	if (item) {
		item.quantity = (item.quantity || 1) + change;
		if (item.quantity < 1) {
			removeFromCart(productId);
			return;
		}
		storageManager.setCart(cart);
		updateCartModal();
	}
}

function removeFromCart(productId) {
	let cart = storageManager.getCart();
	cart = cart.filter(item => item.id !== productId);
	storageManager.setCart(cart);
	updateCartBadge();
	updateCartModal();
	showToast('Removed from cart', 'info');
}

function updateWishlistModal() {
	const wishlistDiv = document.getElementById('wishlistItems');
	if (!wishlistDiv) return;

	const wishlist = storageManager.getWishlist();

	if (wishlist.length === 0) {
		wishlistDiv.innerHTML = `
			<div class="empty-state">
				<i class="fas fa-heart"></i>
				<p>Your wishlist is empty</p>
				<a href="pages/products.html" class="btn" style="margin-top: 10px;">Start Shopping</a>
			</div>
		`;
		return;
	}

	wishlistDiv.innerHTML = wishlist.map(item => `
		<div class="wishlist-item">
			<img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80'">
			<div class="item-info">
				<h5>${item.name}</h5>
				<p>${item.seller}</p>
				<p class="price-current">₹${item.discountPrice.toFixed(2)}</p>
			</div>
			<button class="btn btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
			<span class="item-remove" onclick="toggleWishlist(${item.id})">
				<i class="fas fa-trash"></i>
			</span>
		</div>
	`).join('');
}

// Filter Products
function filterProducts(category) {
	currentFilter = category;

	document.querySelectorAll('.filter-btn').forEach(btn => {
		btn.classList.remove('active');
	});
	event.target.classList.add('active');

	if (category === 'all') {
		filteredProducts = [...allProducts];
	} else {
		filteredProducts = allProducts.filter(p => p.category === category);
	}

	loadProducts();
}

// Search Functionality
function setupSearchListener() {
	const searchInput = document.getElementById('searchInput');
	if (!searchInput) return;

	searchInput.addEventListener('input', function (e) {
		const query = e.target.value.toLowerCase();
		const results = document.getElementById('searchResults');

		if (!query) {
			results.classList.remove('show');
			return;
		}

		const matches = allProducts.filter(p =>
			p.name.toLowerCase().includes(query) ||
			p.category.toLowerCase().includes(query) ||
			(p.seller && p.seller.toLowerCase().includes(query))
		).slice(0, 5);

		if (matches.length === 0) {
			results.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-color);">No products found</div>';
		} else {
			results.innerHTML = matches.map(p => `
				<div class="search-result-item" onclick="window.location.href='pages/product-detail.html?id=${p.id}'">
					<img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/40'">
					<div>
						<strong>${p.name}</strong>
						<p style="margin: 0; font-size: 12px; color: var(--text-color);">₹${p.discountPrice}</p>
					</div>
				</div>
			`).join('');
		}

		results.classList.add('show');
	});
}

function searchProducts() {
	const query = document.getElementById('searchInput').value.toLowerCase();
	if (!query) {
		showToast('Please enter a search term', 'warning');
		return;
	}
	window.location.href = `pages/products.html?search=${encodeURIComponent(query)}`;
}

// FAQ Toggle
function toggleFAQ(element) {
	const faqItem = element.parentElement;
	faqItem.classList.toggle('active');
}

// Update modals when they open
document.addEventListener('click', function (e) {
	if (e.target.closest('button[onclick*="cartModal"]')) {
		setTimeout(updateCartModal, 100);
	}
	if (e.target.closest('button[onclick*="wishlistModal"]')) {
		setTimeout(updateWishlistModal, 100);
	}
});

// Close search results when clicking outside
document.addEventListener('click', function (e) {
	const searchBar = document.querySelector('.search-bar');
	if (searchBar && !searchBar.contains(e.target)) {
		const results = document.getElementById('searchResults');
		if (results) {
			results.classList.remove('show');
		}
	}
});
// Banner Slider
function initBannerSlider() {
	const banners = storageManager.getBanners();
	const sliderContainer = document.getElementById('heroSlider');
	const dotsContainer = document.getElementById('sliderDots');

	if (!sliderContainer || !dotsContainer) return;

	// Render Slides
	sliderContainer.innerHTML = banners.map(banner => `
		<div class="slide" style="background-image: url('${banner.image}')">
			<div class="hero-content">
				<h1>${banner.title}</h1>
				<p>${banner.subtitle}</p>
				<button class="btn" onclick="window.location.href='${banner.link}'">${banner.btnText}</button>
			</div>
		</div>
	`).join('');

	// Render Dots
	dotsContainer.innerHTML = banners.map((_, index) => `
		<div class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
	`).join('');

	startAutoSlide();
}

function showSlide(index) {
	const slider = document.getElementById('heroSlider');
	const dots = document.querySelectorAll('.dot');
	const banners = storageManager.getBanners();

	if (index >= banners.length) currentSlide = 0;
	if (index < 0) currentSlide = banners.length - 1;

	slider.style.transform = `translateX(-${currentSlide * 100}%)`;

	dots.forEach((dot, i) => {
		dot.classList.toggle('active', i === currentSlide);
	});
}

function moveSlide(step) {
	currentSlide += step;
	showSlide(currentSlide);
	resetAutoSlide();
}

function goToSlide(index) {
	currentSlide = index;
	showSlide(currentSlide);
	resetAutoSlide();
}

function startAutoSlide() {
	bannerInterval = setInterval(() => {
		currentSlide++;
		showSlide(currentSlide);
	}, 5000);
}

function resetAutoSlide() {
	clearInterval(bannerInterval);
	startAutoSlide();
}
