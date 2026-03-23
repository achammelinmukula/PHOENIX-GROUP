/* ============================================================
   LUXE STEPS — Main JavaScript
   Demonstrates: DOM manipulation, event handling, arrays,
   objects, localStorage, and try...catch error handling.
   ============================================================ */

/* ============================================================
   1. PRODUCT DATA
   Products are stored as an array of objects (as required).
   ============================================================ */
const products = [
  {
    id: 1,
    name: "Boho Ankle Strap Sandal",
    category: "Sandals",
    price: 89,
    image: "images/image 1.jpeg",
    desc: "A refined brown slingback sandal with gold hardware details.",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Minimal Strappy Sandal",
    category: "Sandals",
    price: 75,
    image: "images/image 2.jpeg",
    desc: "Sleek black criss-cross straps with a contemporary gold accent.",
    badge: "New"
  },
  {
    id: 3,
    name: "Double Buckle Slide",
    category: "Slides",
    price: 65,
    image: "images/image 3.jpeg",
    desc: "Taupe double-strap slide with bold gold buckles — effortlessly chic.",
    badge: ""
  },
  {
    id: 4,
    name: "SMT Buckle Collection",
    category: "Slides",
    price: 55,
    image: "images/image 4.jpeg",
    desc: "Available in white, black, tan, and leopard. Gold hardware finish.",
    badge: "4 Colors"
  },
  {
    id: 5,
    name: "Loro Piana Suede Loafer",
    category: "Sneakers",
    price: 120,
    image: "images/image 5.jpeg",
    desc: "Premium tan suede loafer with a luxe tassel detail.",
    badge: "Luxury"
  },
  {
    id: 6,
    name: "Alaïa Mesh Flat",
    category: "Flats",
    price: 195,
    image: "images/image 6.jpeg",
    desc: "Black fishnet leather ballet flat with an oversized gold medallion.",
    badge: "Designer"
  },
  {
    id: 7,
    name: "Adidas Samba Burgundy",
    category: "Sneakers",
    price: 110,
    image: "images/image 7.jpeg",
    desc: "Classic Samba silhouette in rich burgundy with white leather stripes.",
    badge: "Trending"
  },
  {
    id: 8,
    name: "Dior Mesh Slingback",
    category: "Flats",
    price: 250,
    image: "images/image 8.jpeg",
    desc: "Pointed-toe mesh flat with crystal detailing and a Dior ribbon strap.",
    badge: "Designer"
  },
  {
    id: 9,
    name: "Crystal H Slide",
    category: "Slides",
    price: 180,
    image: "images/image 9.jpeg",
    desc: "Black suede mule with dazzling Hermès-inspired crystal embroidery.",
    badge: "Exclusive"
  },
  {
    id: 10,
    name: "René Caovilla Thong",
    category: "Sandals",
    price: 320,
    image: "images/image 10.jpeg",
    desc: "Black crystal-encrusted thong sandal — red carpet ready.",
    badge: "Luxury"
  },
  {
    id: 11,
    name: "Woodworths Croc Slide",
    category: "Slides",
    price: 45,
    image: "images/image 11.jpeg",
    desc: "Beige croc-textured upper on a dark chocolate sole with gold detail.",
    badge: "Sale"
  }
];

/* ============================================================
   2. CART STATE — loaded from localStorage on every page
   ============================================================ */

/**
 * loadCart — reads the saved cart from localStorage.
 * Uses try...catch to handle corrupted or missing data gracefully.
 * Demonstrates: localStorage, try...catch
 */
function loadCart() {
  try {
    // localStorage.getItem() returns null if key does not exist
    const saved = localStorage.getItem("luxeCart");
    if (!saved) return [];           // nothing stored yet
    const parsed = JSON.parse(saved);
    // Validate: must be an array
    if (!Array.isArray(parsed)) throw new Error("Cart data is not an array.");
    return parsed;
  } catch (err) {
    // If data is corrupt, start with an empty cart
    console.error("Error loading cart from localStorage:", err.message);
    localStorage.removeItem("luxeCart");
    return [];
  }
}

/**
 * saveCart — writes the current cart array to localStorage.
 * Uses try...catch to catch any storage quota errors.
 */
function saveCart(cart) {
  try {
    localStorage.setItem("luxeCart", JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage:", err.message);
    showToast("Could not save cart. Storage may be full.", "error");
  }
}

// Keep cart in a module-level variable so all functions share it
let cart = loadCart();

/* ============================================================
   3. CART COUNTER — shown in the navbar on every page
   Demonstrates: document.getElementById(), innerHTML
   ============================================================ */
function updateCartCount() {
  // Total number of items (sum of all quantities)
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  // document.getElementById() to find the element
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.innerHTML = total;   // innerHTML to update the badge
  }
}

/* ============================================================
   4. TOAST NOTIFICATIONS
   Demonstrates: createElement(), appendChild(), querySelector()
   ============================================================ */
function showToast(message, type = "success") {
  // document.querySelector() to find the container
  const container = document.querySelector("#toast-container");
  if (!container) return;

  // createElement() to build the toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "⚠";
  toast.innerHTML = `<strong>${icon}</strong> ${message}`;

  // appendChild() to add the toast to the page
  container.appendChild(toast);

  // Auto-remove after animation ends (3.4 s total)
  setTimeout(() => toast.remove(), 3400);
}

/* ============================================================
   5. HOME PAGE — Dynamic Product Display & Filtering
   ============================================================ */

let activeCategory = "all";     // tracks the selected filter tab
let searchQuery    = "";        // tracks the current search text

/**
 * renderProducts — filters and renders product cards to the grid.
 * Demonstrates: createElement(), appendChild(), innerHTML, addEventListener()
 */
function renderProducts() {
  // document.getElementById() to get the grid container
  const grid = document.getElementById("product-grid");
  if (!grid) return;   // not on the home page

  // Filter by category
  let filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  // Filter by search query (case-insensitive)
  if (searchQuery.trim() !== "") {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Update the product count text
  const countEl = document.getElementById("product-count");
  if (countEl) {
    countEl.innerHTML = `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;
  }

  // Clear the grid
  grid.innerHTML = "";

  if (filtered.length === 0) {
    // Show a "no results" message using innerHTML
    const msg = document.createElement("div");
    msg.className = "no-results";
    msg.innerHTML = `
      <h3>No shoes found 👟</h3>
      <p>Try a different search term or category filter.</p>`;
    grid.appendChild(msg);
    return;
  }

  // Create a card for each product using createElement()
  filtered.forEach((product, index) => {
    const card = createElement_ProductCard(product, index);
    grid.appendChild(card);   // appendChild() to add to DOM
  });
}

/**
 * createElement_ProductCard — builds and returns a product card element.
 * Demonstrates: createElement(), addEventListener(), appendChild()
 */
function createElement_ProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  // Stagger the animation slightly per card
  card.style.animationDelay = `${index * 0.06}s`;

  // Check if this product is already in the cart
  const inCart = cart.some(item => item.id === product.id);

  card.innerHTML = `
    <div class="product-img-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
    </div>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-footer">
        <span class="product-price">$${product.price}<small>.00</small></span>
        <button
          class="btn-add ${inCart ? "added" : ""}"
          data-id="${product.id}"
        >
          ${inCart ? "✓ Added" : "+ Add to Cart"}
        </button>
      </div>
    </div>`;

  // addEventListener() on the "Add to Cart" button
  const btn = card.querySelector(".btn-add");
  btn.addEventListener("click", () => {
    addToCart(product.id);
    // Update this button immediately
    btn.className = "btn-add added";
    btn.innerHTML = "✓ Added";
  });

  return card;
}

/**
 * addToCart — adds a product to the cart or increases its quantity.
 * Demonstrates: arrays (find, push), localStorage, error handling
 */
function addToCart(productId) {
  try {
    // Find the product by id in the products array
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error(`Product with id ${productId} not found.`);

    // Check if already in cart
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      // Add new cart object
      cart.push({ id: product.id, qty: 1 });
    }

    saveCart(cart);          // persist to localStorage
    updateCartCount();       // update the navbar counter
    showToast(`"${product.name}" added to cart! 🛍`, "success");
  } catch (err) {
    console.error("addToCart error:", err.message);
    showToast("Could not add item to cart.", "error");
  }
}

/* ============================================================
   6. SEARCH — DOM filtering as user types
   Demonstrates: addEventListener(), querySelector()
   ============================================================ */
function initSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  // addEventListener() — fires on every keystroke
  input.addEventListener("input", () => {
    searchQuery = input.value;
    renderProducts();   // re-render with updated filter
  });
}

/* ============================================================
   7. CATEGORY FILTER TABS
   Demonstrates: querySelectorAll(), addEventListener(), classList
   ============================================================ */
function initFilterTabs() {
  // document.querySelectorAll() to get all filter buttons
  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove "active" from all tabs
      buttons.forEach(b => b.classList.remove("active"));
      // Add "active" to the clicked tab
      btn.classList.add("active");
      // Update the active category and re-render
      activeCategory = btn.dataset.category;
      renderProducts();
    });
  });
}

/* ============================================================
   8. CART PAGE — Render Cart Items
   ============================================================ */

/**
 * renderCart — displays all cart items on cart.html.
 * Demonstrates: createElement(), appendChild(), innerHTML, addEventListener()
 */
function renderCart() {
  // document.getElementById() to get the cart container
  const container = document.getElementById("cart-items");
  if (!container) return;   // not on cart page

  container.innerHTML = "";   // clear existing content

  if (cart.length === 0) {
    // Show an empty-cart message
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    empty.innerHTML = `
      <div class="big-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any shoes yet!</p>
      <a href="index.html" class="btn-primary" style="width:auto;padding:.85rem 2rem;display:inline-flex">
        Browse Collection
      </a>`;
    container.appendChild(empty);
    updateOrderSummary(0, 0);
    // Keep checkout button disabled
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  // Enable the checkout button when cart has items
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.disabled = false;

  // Render a row for each cart item
  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;   // skip if product not found (error resilience)

    const row = document.createElement("div");
    row.className = "cart-item";
    row.setAttribute("data-id", product.id);

    row.innerHTML = `
      <img class="cart-item-img" src="${product.image}" alt="${product.name}" />
      <div class="cart-item-info">
        <span class="cart-item-cat">${product.category}</span>
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-unit">$${product.price}.00 each</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn btn-decrease" data-id="${product.id}" title="Decrease">−</button>
        <span class="qty-num">${cartItem.qty}</span>
        <button class="qty-btn btn-increase" data-id="${product.id}" title="Increase">+</button>
      </div>
      <span class="cart-item-subtotal">$${(product.price * cartItem.qty).toFixed(2)}</span>
      <button class="btn-remove" data-id="${product.id}" title="Remove item">✕</button>`;

    container.appendChild(row);
  });

  // Attach quantity and remove event listeners using addEventListener()
  container.querySelectorAll(".btn-increase").forEach(btn => {
    btn.addEventListener("click", () => updateQuantity(Number(btn.dataset.id), 1));
  });
  container.querySelectorAll(".btn-decrease").forEach(btn => {
    btn.addEventListener("click", () => updateQuantity(Number(btn.dataset.id), -1));
  });
  container.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });

  // Recalculate and display totals
  calcAndShowTotals();
}

/**
 * updateQuantity — increases or decreases qty of a cart item.
 * Demonstrates: try...catch for invalid quantity values
 */
function updateQuantity(productId, delta) {
  try {
    const item = cart.find(i => i.id === productId);
    if (!item) throw new Error(`Item ${productId} not in cart.`);

    const newQty = item.qty + delta;
    if (newQty < 1) throw new Error("Quantity cannot be less than 1.");

    item.qty = newQty;
    saveCart(cart);
    updateCartCount();
    renderCart();   // re-render to reflect changes
  } catch (err) {
    // If quantity goes below 1, prompt to remove instead
    if (err.message.includes("less than 1")) {
      removeFromCart(productId);
    } else {
      console.error("updateQuantity error:", err.message);
      showToast("Could not update quantity.", "error");
    }
  }
}

/**
 * removeFromCart — removes an item from the cart entirely.
 */
function removeFromCart(productId) {
  try {
    const index = cart.findIndex(i => i.id === productId);
    if (index === -1) throw new Error(`Item ${productId} not found in cart.`);

    const product = products.find(p => p.id === productId);
    cart.splice(index, 1);   // remove 1 item at the found index

    saveCart(cart);
    updateCartCount();
    renderCart();
    showToast(`"${product ? product.name : "Item"}" removed from cart.`, "warning");
  } catch (err) {
    console.error("removeFromCart error:", err.message);
    showToast("Could not remove item.", "error");
  }
}

/**
 * calcAndShowTotals — calculates subtotal, shipping, and total.
 */
function calcAndShowTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const shipping = subtotal > 150 ? 0 : (subtotal > 0 ? 10 : 0);
  const total    = subtotal + shipping;

  updateOrderSummary(subtotal, shipping, total);
}

/**
 * updateOrderSummary — updates the summary panel text.
 * Demonstrates: document.getElementById(), innerHTML
 */
function updateOrderSummary(subtotal, shipping, total = subtotal + shipping) {
  const fmt = n => `$${n.toFixed(2)}`;

  const subEl  = document.getElementById("summary-subtotal");
  const shipEl = document.getElementById("summary-shipping");
  const totEl  = document.getElementById("summary-total");

  if (subEl)  subEl.innerHTML  = fmt(subtotal);
  if (shipEl) shipEl.innerHTML = shipping === 0 && subtotal > 0
    ? '<span style="color:var(--success)">Free</span>'
    : fmt(shipping);
  if (totEl)  totEl.innerHTML  = fmt(total);
}

/* ============================================================
   9. CHECKOUT PAGE — Order Summary + Form Validation
   ============================================================ */

/**
 * renderCheckoutSummary — populates the order summary on checkout.html.
 * Demonstrates: createElement(), appendChild(), innerHTML
 */
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:.85rem">Your cart is empty.</p>`;
    return;
  }

  let subtotal = 0;

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;

    const lineTotal = product.price * cartItem.qty;
    subtotal += lineTotal;

    // createElement() for each order line
    const row = document.createElement("div");
    row.className = "checkout-item";
    row.innerHTML = `
      <img class="checkout-item-img" src="${product.image}" alt="${product.name}" />
      <div class="checkout-item-details">
        <p class="checkout-item-name">${product.name}</p>
        <p class="checkout-item-qty">Qty: ${cartItem.qty}</p>
      </div>
      <span class="checkout-item-price">$${lineTotal.toFixed(2)}</span>`;

    container.appendChild(row);   // appendChild() to add each row
  });

  const shipping = subtotal > 150 ? 0 : (subtotal > 0 ? 10 : 0);

  // document.getElementById() to update summary fields
  const subEl  = document.getElementById("checkout-subtotal");
  const shipEl = document.getElementById("checkout-shipping");
  const totEl  = document.getElementById("checkout-total");

  if (subEl)  subEl.innerHTML  = `$${subtotal.toFixed(2)}`;
  if (shipEl) shipEl.innerHTML = shipping === 0
    ? '<span style="color:var(--success)">Free</span>'
    : `$${shipping.toFixed(2)}`;
  if (totEl)  totEl.innerHTML  = `$${(subtotal + shipping).toFixed(2)}`;
}

/**
 * initCheckoutForm — sets up form submission and real-time validation.
 * Demonstrates: addEventListener(), querySelector(), try...catch
 */
function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Format card number as user types (1234 5678...)
  const cardInput = document.getElementById("card-number");
  if (cardInput) {
    cardInput.addEventListener("input", () => {
      let v = cardInput.value.replace(/\D/g, "").substring(0, 16);
      cardInput.value = v.replace(/(.{4})/g, "$1 ").trim();
    });
  }

  // Format expiry as MM/YY
  const expiryInput = document.getElementById("expiry");
  if (expiryInput) {
    expiryInput.addEventListener("input", () => {
      let v = expiryInput.value.replace(/\D/g, "").substring(0, 4);
      if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
      expiryInput.value = v;
    });
  }

  // addEventListener() on the form's submit event
  form.addEventListener("submit", (event) => {
    event.preventDefault();   // prevent default browser submission

    try {
      // Validate the form — throws if invalid
      const isValid = validateCheckoutForm();

      if (!isValid) {
        showToast("Please fix the errors highlighted in red.", "error");
        return;
      }

      // Check that the cart is not empty before placing order
      if (cart.length === 0) {
        throw new Error("Cannot place order with an empty cart.");
      }

      // Simulate a successful order
      placeOrder();

    } catch (err) {
      // try...catch catches both validation errors and empty-cart errors
      console.error("Checkout error:", err.message);
      showToast(err.message, "error");
    }
  });
}

/**
 * validateCheckoutForm — validates every field and marks errors.
 * Returns true if all fields are valid, false otherwise.
 * Demonstrates: document.getElementById(), querySelector(), try...catch
 */
function validateCheckoutForm() {
  let valid = true;

  /**
   * Helper: marks a form-group as valid or invalid.
   */
  function setFieldState(groupId, isValid) {
    const group = document.getElementById(groupId);
    if (!group) return;
    if (isValid) {
      group.classList.remove("error");
    } else {
      group.classList.add("error");
      valid = false;
    }
  }

  try {
    // --- Full Name ---
    const name = document.getElementById("name").value.trim();
    setFieldState("group-name", name.length >= 3);

    // --- Email — must match basic email pattern ---
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setFieldState("group-email", emailRegex.test(email));

    // --- Phone — 7 to 15 digits (allows + and spaces) ---
    const phone = document.getElementById("phone").value.trim();
    const digits = phone.replace(/[\s\-\+\(\)]/g, "");
    setFieldState("group-phone", /^\d{7,15}$/.test(digits));

    // --- Delivery Address ---
    const address = document.getElementById("address").value.trim();
    setFieldState("group-address", address.length >= 5);

    // --- Card Number — must be 16 digits ---
    const cardRaw = document.getElementById("card-number").value.replace(/\s/g, "");
    setFieldState("group-card", /^\d{16}$/.test(cardRaw));

    // --- Expiry — must be MM/YY format ---
    const expiry = document.getElementById("expiry").value.trim();
    setFieldState("group-expiry", /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry));

    // --- CVV — 3 or 4 digits ---
    const cvv = document.getElementById("cvv").value.trim();
    setFieldState("group-cvv", /^\d{3,4}$/.test(cvv));

  } catch (err) {
    // try...catch in case any getElementById returns null unexpectedly
    console.error("Validation error:", err.message);
    return false;
  }

  return valid;
}

/**
 * placeOrder — clears the cart and shows the success overlay.
 * Demonstrates: localStorage (remove), innerHTML, querySelector()
 */
function placeOrder() {
  // Clear the cart
  cart = [];
  saveCart(cart);
  updateCartCount();

  // Show the success overlay using document.getElementById()
  const overlay = document.getElementById("success-overlay");
  if (overlay) {
    overlay.style.display = "flex";
  }

  // "Continue Shopping" button
  const continueBtn = document.getElementById("continue-btn");
  if (continueBtn) {
    // addEventListener() on the continue button
    continueBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

/* ============================================================
   10. PAGE INITIALISATION
   Detects which page is loaded and runs the appropriate setup.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Always update the cart count in the navbar (all pages)
  updateCartCount();

  // Use document.querySelector() to detect the current page
  const isHomePage     = document.querySelector("#product-grid")  !== null;
  const isCartPage     = document.querySelector("#cart-items")    !== null && !document.querySelector("#checkout-form");
  const isCheckoutPage = document.querySelector("#checkout-form") !== null;

  if (isHomePage) {
    renderProducts();   // display all products dynamically
    initSearch();       // wire up the search bar
    initFilterTabs();   // wire up category filter buttons
  }

  if (isCartPage) {
    renderCart();       // display cart items
  }

  if (isCheckoutPage) {
    renderCheckoutSummary();   // show order summary
    initCheckoutForm();        // wire up form validation
  }
});
