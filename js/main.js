// Local Storage Manager
const storageManager = {
	setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
	getUser: () => JSON.parse(localStorage.getItem('user')) || null,
	setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
	getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
	setWishlist: (wishlist) => localStorage.setItem('wishlist', JSON.stringify(wishlist)),
	getWishlist: () => JSON.parse(localStorage.getItem('wishlist')) || [],
	setCustomProducts: (products) => localStorage.setItem('customProducts', JSON.stringify(products)),
	getCustomProducts: () => JSON.parse(localStorage.getItem('customProducts')) || [],
	addCustomProduct: (product) => {
		const products = storageManager.getCustomProducts();
		products.push(product);
		storageManager.setCustomProducts(products);
	},
	setBanners: (banners) => localStorage.setItem('banners', JSON.stringify(banners)),
	getBanners: () => {
		const banners = JSON.parse(localStorage.getItem('banners'));
		if (!banners || banners.length === 0) {
			const defaults = [
				{
					id: 1,
					title: "EXPLORE OUR PRODUCTS",
					subtitle: "Discover high-quality items at amazing prices",
					image: "img/hero.png",
					link: "pages/products.html",
					btnText: "SHOP ALL"
				},
				{
					id: 2,
					title: "SUMMER SALE 2024",
					subtitle: "Get up to 50% off on selected items",
					image: "https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/8/z/p/-original-imagpjhfgeat7zjr.jpeg",
					link: "pages/products.html?category=Electronics",
					btnText: "GET DEALS"
				},
				{
					id: 3,
					title: "NEW ARRIVALS",
					subtitle: "Check out our latest fashion collection",
					image: "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/g/i/n/8-casual-sneaker-shoes-for-men-white-shoes-men-casual-shoes-for-original-imahfyyhgd8szwyc.jpeg",
					link: "pages/products.html?category=Shoes",
					btnText: "BROWSE NOW"
				},
				{
					id: 4,
					title: "BEAUTY ESSENTIALS",
					subtitle: "Premium skincare and cosmetics for you",
					image: "https://rukminim2.flixcart.com/image/832/832/xif0q/face-wash/g/i/y/100-anti-pollution-face-wash-whitening-skincare-kit-set-of-4-original-imaggf8f8hsz2fzh.jpeg",
					link: "pages/products.html?category=Cosmetics",
					btnText: "SHOP NOW"
				}
			];
			storageManager.setBanners(defaults);
			return defaults;
		}
		return banners;
	},
	logout: () => {
		localStorage.removeItem('user');
		window.location.href = 'pages/auth/login.html';
	}
};

// Merged Products Function
function getAllProducts() {
	const customProducts = storageManager.getCustomProducts();
	return [...mockProducts, ...customProducts];
}

window.storageManager = storageManager;
window.getAllProducts = getAllProducts;

// Toast Notification
function showToast(message, type = 'success') {
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;
	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, 3000);
}

// Modal Handler
function openModal(modalId) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.add('show');
		document.body.style.overflow = 'hidden';
	}
}

function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.remove('show');
		document.body.style.overflow = 'auto';
	}
}

// Close modal on outside click
document.addEventListener('DOMContentLoaded', function () {
	const modals = document.querySelectorAll('.modal');
	// Update cart badge
	updateCartBadge();
	// Update header UI for user/seller
	updateHeaderUI();
});

function updateHeaderUI() {
	const user = storageManager.getUser();
	const container = document.getElementById('sellerLinkContainer');
	if (!container) return;

	if (user) {
		if (user.role === 'seller') {
			container.innerHTML = `<a href="pages/seller/dashboard.html"><i class="fas fa-chart-line"></i> Seller Dashboard</a>`;
		} else {
			container.innerHTML = `<a href="pages/seller/onboarding.html"><i class="fas fa-store"></i> Become a Seller</a>`;
		}
	} else {
		container.innerHTML = '';
	}
}

function updateCartBadge() {
	const cart = storageManager.getCart();
	const badge = document.querySelector('.badge');
	if (badge) {
		badge.textContent = cart.length;
		badge.style.display = cart.length > 0 ? 'flex' : 'none';
	}
}

// Format Currency
function formatCurrency(amount) {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR'
	}).format(amount);
}

// Star Rating
function createStarRating(rating, max = 5) {
	let html = '<div class="stars">';
	for (let i = 1; i <= max; i++) {
		html += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
	}
	html += '</div>';
	return html;
}

// Form Validation
function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

function validatePassword(password) {
	return password.length >= 6;
}

function validatePhone(phone) {
	const re = /^\d{10,}$/;
	return re.test(phone.replace(/\D/g, ''));
}

// Redirect based on user role
function redirectByRole() {
	const user = storageManager.getUser();
	if (!user) {
		window.location.href = 'pages/auth/login.html';
		return;
	}

	const currentPage = window.location.pathname;

	if (user.role === 'seller' && !currentPage.includes('seller')) {
		window.location.href = 'pages/seller/dashboard.html';
	}

	if (user.role === 'admin' && !currentPage.includes('admin')) {
		window.location.href = 'pages/admin/dashboard.html';
	}
}

// Mock Products Database
const mockProducts = [
	{
		id: 1,
		name: "Men's Casual Sneakers- Stylish Trending New Fashion White Shoes for Boys Sneakers For Men (White , 8)",
		category: 'Shoes',
		price: 1999,
		discountPrice: 388,
		image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/g/i/n/8-casual-sneaker-shoes-for-men-white-shoes-men-casual-shoes-for-original-imahfyyhgd8szwyc.jpeg?q=70',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/g/i/n/8-casual-sneaker-shoes-for-men-white-shoes-men-casual-shoes-for-original-imahfyyhgd8szwyc.jpeg?q=70',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/p/u/8/8-casual-sneaker-shoes-for-men-white-shoes-men-casual-shoes-for-original-imahfyyhyqxhzrqz.jpeg?q=70',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/6/j/4/8-casual-sneaker-shoes-for-men-white-shoes-men-casual-shoes-for-original-imahfyyheg69zszr.jpeg?q=70'
		],
		rating: 3.8,
		reviews: 71,
		ratingsCount: 1974,
		stock: 45,
		sold: 234,
		seller: 'Echor',
		sellerId: 1,
		description: 'Stylish and trending white sneakers for men. Perfect for casual wear and fashion-forward looks.',
		offers: [
			{ type: 'Special Price', text: 'Get extra 14% off upto ₹280 on 50 item(s)' },
			{ type: 'Bank Offer', text: 'Flat ₹50 off on Flipkart Axis Bank Credit Card' },
			{ type: 'Bank Offer', text: '10% off up to ₹750 on Canara Bank CC and CC EMI transactions' },
			{ type: 'Bank Offer', text: '8% Off Up to ₹750 on HDFC Bank Credit Card EMI' }
		]
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		category: 'Electronics',
		price: 1500,
		discountPrice: 1199,
		image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/8/z/p/-original-imagpjhfgeat7zjr.jpeg',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/8/z/p/-original-imagpjhfgeat7zjr.jpeg',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/e/a/f/-original-imagnvqz6v8vp7yv.jpeg'
		],
		rating: 4.8,
		reviews: 89,
		ratingsCount: 450,
		stock: 30,
		sold: 156,
		seller: 'Tech Hub',
		sellerId: 2,
		description: 'High-quality noise-cancelling wireless headphones'
	},
	{
		id: 3,
		name: 'Casual T-Shirt',
		category: 'Clothes',
		price: 499,
		discountPrice: 299,
		image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/t/e/0/l-7232042-pst-vebnor-original-imaghy9zyfgtqszf.jpeg',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/t/e/0/l-7232042-pst-vebnor-original-imaghy9zyfgtqszf.jpeg',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/q/m/4/l-7232042-pst-vebnor-original-imaghy9zfhvnyghh.jpeg'
		],
		rating: 4.2,
		reviews: 234,
		ratingsCount: 1200,
		stock: 100,
		sold: 512,
		seller: 'Fashion World',
		sellerId: 3,
		description: 'Comfortable cotton t-shirt available in multiple colors'
	},
	{
		id: 4,
		name: 'Premium Skincare Set',
		category: 'Cosmetics',
		price: 1290,
		discountPrice: 990,
		image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/face-wash/g/i/y/100-anti-pollution-face-wash-whitening-skincare-kit-set-of-4-original-imaggf8f8hsz2fzh.jpeg',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/xif0q/face-wash/g/i/y/100-anti-pollution-face-wash-whitening-skincare-kit-set-of-4-original-imaggf8f8hsz2fzh.jpeg',
			'https://rukminim2.flixcart.com/image/832/832/k3dc7m80/combo-kit/h/z/x/essential-skincare-kit-set-of-5-wow-skin-science-original-imafmgrv7vgh9pht.jpeg'
		],
		rating: 4.5,
		reviews: 124,
		ratingsCount: 890,
		stock: 45,
		sold: 234,
		seller: 'Beauty Store',
		sellerId: 6,
		description: 'Complete skincare collection with natural ingredients'
	},
	{
		id: 5,
		name: 'Smart Watch',
		category: 'Electronics',
		price: 2500,
		discountPrice: 1899,
		image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/g/z/r/-original-imagpkf8zzyfzayh.jpeg',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/g/z/r/-original-imagpkf8zzyfzayh.jpeg',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/j/w/e/-original-imagvg9vshyyqyvz.jpeg'
		],
		rating: 4.7,
		reviews: 145,
		ratingsCount: 1100,
		stock: 15,
		sold: 267,
		seller: 'Tech Hub',
		sellerId: 2,
		description: 'Advanced fitness tracking and notifications'
	},
	{
		id: 6,
		name: 'Coffee Maker',
		category: 'Home Goods',
		price: 850,
		discountPrice: 590,
		image: 'https://rukminim2.flixcart.com/image/832/832/k7fphus0/coffee-maker/g/z/v/pigeon-brew-coffee-maker-original-imafpzy7m7fzy7gh.jpeg',
		images: [
			'https://rukminim2.flixcart.com/image/832/832/k7fphus0/coffee-maker/g/z/v/pigeon-brew-coffee-maker-original-imafpzy7m7fzy7gh.jpeg',
			'https://rukminim2.flixcart.com/image/832/832/xif0q/coffee-maker/h/s/l/espresso-coffee-maker-with-carafe-black-original-imaghr8zdzgjygzf.jpeg'
		],
		rating: 4.4,
		reviews: 98,
		ratingsCount: 600,
		stock: 40,
		sold: 156,
		seller: 'Home Store',
		sellerId: 5,
		description: 'Programmable coffee maker with thermal carafe'
	}
];

// User Menu Toggle
function toggleUserMenu() {
	const dropdown = document.getElementById('userDropdown');
	if (dropdown) {
		dropdown.classList.toggle('show');
	}
}

// Global logout
function logout() {
	storageManager.logout();
}

// Close dropdown on outside click
document.addEventListener('click', function (e) {
	const userMenu = document.querySelector('.user-menu');
	const dropdown = document.getElementById('userDropdown');
	if (userMenu && !userMenu.contains(e.target) && dropdown) {
		dropdown.classList.remove('show');
	}
});

// Update Badges
function updateCartBadge() {
	const cart = storageManager.getCart();
	const badge = document.getElementById('cartBadge');
	if (badge) {
		badge.textContent = cart.length;
		badge.style.display = cart.length > 0 ? 'flex' : 'none';
	}
}

function updateWishlistBadge() {
	const wishlist = storageManager.getWishlist();
	const badge = document.getElementById('wishlistBadge');
	if (badge) {
		badge.textContent = wishlist.length;
		badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
	}
}

// Export for use in other files
window.mockProducts = mockProducts;
window.updateCartBadge = updateCartBadge;
window.updateWishlistBadge = updateWishlistBadge;

// Initialize common page elements
document.addEventListener('DOMContentLoaded', function () {
	updateCartBadge();
	updateWishlistBadge();
});
