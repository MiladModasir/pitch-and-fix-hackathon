// Product Detail Page Functionality

// product-detail.js

document.addEventListener("DOMContentLoaded", () => {
  initializeProductDetail();
  setupTabNavigation();
  setupQuantityControls();
  setupAddToCart();
  setupColorSelection();
});

function initializeProductDetail() {
  setupThumbnailGallery();
}

function setupThumbnailGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImg    = document.getElementById("main-product-img");
  if (!mainImg) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;
      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

function setupTabNavigation() {
  const tabButtons  = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab;

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

function setupQuantityControls() {
  const dec = document.getElementById("decrease-quantity");
  const inc = document.getElementById("increase-quantity");
  const inp = document.getElementById("quantity");

  if (dec && inp) dec.addEventListener("click", () => {
    let v = Math.max(1, parseInt(inp.value, 10) - 1);
    inp.value = v;
  });

  if (inc && inp) inc.addEventListener("click", () => {
    inp.value = parseInt(inp.value, 10) + 1;
  });

  if (inp) inp.addEventListener("change", () => {
    if (parseInt(inp.value, 10) < 1) inp.value = 1;
  });
}

function setupAddToCart() {
  const btn = document.getElementById("add-to-cart");
  if (!btn) return;

    btn.addEventListener("click", () => {
    const { productId, productName, productPrice, productImage } = btn.dataset;
    const quantity = Math.max(
      1,
      parseInt(document.getElementById("quantity").value, 10)
    );

    // call your cart.js function
    addToCart(productId, productName, productPrice, quantity, productImage);
    showAddToCartMessage();
    updateCartCount();
  });
} 

function setupColorSelection() {
  document.querySelectorAll(".color-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".color-option")
              .forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}

function showAddToCartMessage() {
  const msg = document.createElement("div");
  msg.className = "add-to-cart-message";
  msg.textContent = "Product added to cart!";
  document.body.appendChild(msg);

  setTimeout(() => msg.classList.add("show"), 10);
  setTimeout(() => {
    msg.classList.remove("show");
    setTimeout(() => msg.remove(), 300);
  }, 3000);
}
