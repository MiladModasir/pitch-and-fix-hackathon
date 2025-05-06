// Main JavaScript for ShopEase

  function setupWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const { productId, productName, productPrice, productImage } = btn.dataset;

      let wishlist = JSON.parse(localStorage.getItem("shopease_wishlist")) || [];

      const alreadyInWishlist = wishlist.some(item => item.id === productId);
      if (alreadyInWishlist) {
        alert("Already in wishlist!");
        return;
      }

      wishlist.push({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage
      });

      localStorage.setItem("shopease_wishlist", JSON.stringify(wishlist));
      alert("Added to wishlist!");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the site
  initializeSite();
  updateCartCount();
  setupEventListeners();
  setupCheckoutButton();
  setupWishlistButtons();
});

// Initialize site functionality
function initializeSite() {
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCart);
  }

  setupNewsletterForm();
}

// Handle all add-to-cart buttons (homepage, featured, etc.)
function setupEventListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const { productId, productName, productPrice, productImage } = button.dataset;

      const quantity = 1; // default for featured products

      addToCart(productId, productName, productPrice, quantity, productImage);
      showMessage("Product added to cart!", "success");
    });
  });
}

function setupCheckoutButton() {
  const btn = document.getElementById("checkout-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.location.href = "../pages/cart.html";
    alert("Checkout is not ready yet. Coming soon!");
  });
}

function showMessage(message, type) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.remove();
  });
}

function setupNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");

  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const emailInput = document.getElementById("newsletter-email").value;

    setTimeout(() => {
      document.getElementById("newsletter-email").value = "";
      newsletterSuccess.textContent = "Thank you for subscribing!";
    }, 1000);
  });
}
