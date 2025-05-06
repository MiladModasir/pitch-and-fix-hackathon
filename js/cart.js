 // cart.js

// —————————————————————————————
// 0) Cart data + UI refresh helper
// —————————————————————————————
let cart = [];
let promoDiscount = 0;

// Redraws either the cart‐page table or the mini dropdown */
function refreshCartUI() {
  if (document.querySelector(".cart-page-container")) {
    displayCartItems();
    updateCartTotals();
  } else {
    displayCartDropdown();
  }
}

// —————————————————————————————
// 1) Persist & load cart
// —————————————————————————————
function loadCart() {
  const saved = localStorage.getItem("shopease_cart");
  if (saved) cart = JSON.parse(saved);
}

function saveCart() {
  localStorage.setItem("shopease_cart", JSON.stringify(cart));
}

// —————————————————————————————
// 2) Add / update items
// —————————————————————————————
function addToCart(productId, productName, productPrice, quantity = 1, image) {
  const price = parseFloat(productPrice);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity + quantity;
    existing.total = existing.price * existing.quantity;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price,
      quantity,
      total: price * quantity,
      image
    });
  }

  saveCart();
  updateCartCount();
  refreshCartUI();
}



// —————————————————————————————
// 3) Remove exactly one entry
// —————————————————————————————
function removeFromCart(productId) {
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart.splice(idx, 1);
    saveCart();
    updateCartCount();
    refreshCartUI();
  }
}

// —————————————————————————————
// 4) Set quantity
// —————————————————————————————
function updateItemQuantity(productId, newQty) {
  newQty = Math.max(1, parseInt(newQty, 10));
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity = newQty;
  item.total = item.price * newQty;

  saveCart();
  updateCartCount();
  refreshCartUI();
}

// —————————————————————————————
// 5) Cart count in header
// —————————————————————————————
function updateCartCount() {
  const el = document.querySelector(".cart-count");
  if (!el) return;
  const sum = cart.reduce((acc, i) => acc + i.quantity, 0);
  el.textContent = sum;
}

// —————————————————————————————
// 6) Dropdown toggle & rendering
// —————————————————————————————
function toggleCart() {
  const dropdown = document.querySelector(".cart-dropdown");
  if (!dropdown) return;

  const showing = dropdown.style.display === "block";
  dropdown.style.display = showing ? "none" : "block";
  if (!showing) displayCartDropdown();
}

function displayCartDropdown() {
  const container = document.querySelector(".cart-dropdown .cart-items");
  const totalEl  = document.getElementById("cart-total-amount");
  if (!container || !totalEl) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.total;
    const div = document.createElement("div");
    div.className = "cart-dropdown-item";
    div.innerHTML = `
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>$${item.total.toFixed(2)} (${item.quantity})</p>
      </div>
      <button class="remove-item" data-product-id="${item.id}">×</button>
    `;
    container.appendChild(div);
  });

  // wire up remove buttons
  container.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.productId);
      displayCartDropdown();
    });
  });

  totalEl.textContent = total.toFixed(2);
}

// —————————————————————————————
// 7) Cart‐page full table
// —————————————————————————————
function displayCartItems() {
  const list = document.getElementById("cart-items-list");
  if (!list) return;
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = '<tr><td colspan="5">Your cart is empty</td></tr>';
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.className = "cart-item";
    row.dataset.productId = item.id;
    const itemTotal = item.price * item.quantity;

    row.innerHTML = `
      <td class="product-info">
        <img src="../images/product${item.id}.jpg"
          alt="${item.name}" class="cart-item-image">
        <div class="product-details">
          <h3>${item.name}</h3>
        </div>
      </td>
      <td class="product-price">$${item.price.toFixed(2)}</td>
      <td class="product-quantity">
        <div class="quantity-controls">
          <button class="quantity-decrease">-</button>
          <input type="number" value="${item.quantity}"
                max="10" class="quantity-input">
          <button class="quantity-increase">+</button>
        </div>
      </td>
      <td class="product-total">$${itemTotal.toFixed(2)}</td>
      <td class="product-actions">
        <button class="remove-item-btn">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    list.appendChild(row);
  });

  setupCartItemsEventListeners();
}

function setupCartItemsEventListeners() {
  document.querySelectorAll(".cart-item").forEach(row => {
    const dec       = row.querySelector(".quantity-decrease");
    const inc       = row.querySelector(".quantity-increase");
    const input     = row.querySelector(".quantity-input");
    const removeBtn = row.querySelector(".remove-item-btn");
    const productId = row.dataset.productId;

    dec.addEventListener("click", () => {
      let v = Math.max(1, parseInt(input.value, 10) - 1);
      input.value = v;
      updateItemQuantity(productId, v);
    });
    inc.addEventListener("click", () => {
      let v = parseInt(input.value, 10) + 1;
      input.value = v;
      updateItemQuantity(productId, v);
    });
    input.addEventListener("change", () => {
      let v = Math.max(1, parseInt(input.value, 10) || 1);
      input.value = v;
      updateItemQuantity(productId, v);
    });
    removeBtn.addEventListener("click", () => {
      removeFromCart(productId);
      displayCartItems();
      updateCartTotals();
    });
  });
}
function updateCartTotals() {
  const subEl = document.getElementById("subtotal");
  const shipEl = document.getElementById("shipping");
  const taxEl  = document.getElementById("tax");
  const totEl  = document.getElementById("total");
  const discountEl = document.getElementById("discount");
  const discountRow = document.querySelector(".discount-row");

  if (!(subEl && shipEl && taxEl && totEl)) return;

  const originalSubtotal = cart.reduce((sum, i) => sum + i.total, 0);
  const discountAmount = originalSubtotal * promoDiscount;
  const subtotal = originalSubtotal - discountAmount;
  const shipping = 5.00;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  subEl.textContent  = `$${subtotal.toFixed(2)}`;
  shipEl.textContent = `$${shipping.toFixed(2)}`;
  taxEl.textContent  = `$${tax.toFixed(2)}`;
  totEl.textContent  = `$${total.toFixed(2)}`;

  // SHOW the discount line if there is a discount
  if (promoDiscount > 0) {
    const discountAmount  = originalSubtotal * promoDiscount
    discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    discountRow.style.display = "flex"; // or "block" depending on your layout
  } else if (discountRow) {
    discountRow.style.display = "none";
  }
}


// Apply promo code
function applyPromoCode(code) {
  // Check for valid codes
  if (code === "DISCOUNT20") {
    promoDiscount = 0.20; // set 20% discount
    // Apply 20% discount
    alert("Promo code applied successfully!");

    // Update cart totals
    updateCartTotals();

    return true;
  } else {
    alert("Invalid promo code");
    return false;
  }
}


// Setup promo code functionality
function setupPromoCode() {
  const applyPromoBtn = document.getElementById("apply-promo-btn");

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", function () {
      const promoInput = document.getElementById("promocode");

      if (promoInput) {
        const code = promoInput.value.trim();
        applyPromoCode(code);
      }
    });
  }
}

// Setup checkout button
function setupCheckoutButton() {
  const btn = document.getElementById("checkout-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    alert("Checkout is not ready yet. Coming soon!");
  });
}

// —————————————————————————————
// 8) Initialization
// —————————————————————————————
  document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updateCartCount();
    //setup event listenrs
    setupPromoCode();
    setupCheckoutButton();
  
    // cart‐icon toggle
    document.querySelectorAll(".cart-icon").forEach(icon =>
      icon.addEventListener("click", toggleCart)
    );
  
    // if on full cart page
    if (document.querySelector(".cart-page-container")) {
      displayCartItems();
      updateCartTotals();
    }
  })