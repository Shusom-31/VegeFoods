// ------------------------------
// Products Data
// ------------------------------
const products = [
  { id: 1, name: "Fresh Apples", desc: "Crisp and sweet.", price: 300, unit: "1kg", img: "apple.jpg" },
  { id: 2, name: "Pineapple", desc: "Healthy and crunchy.", price: 60, unit: "1pc", img: "pinaple.jpg" },
  { id: 3, name: "Bananas", desc: "Rich in potassium.", price: 40, unit: "4pcs", img: "bana.jpg" },
  { id: 4, name: "Grapes", desc: "Juicy and fresh.", price: 450, unit: "1kg", img: "angur.jpg" },
  { id: 5, name: "Oranges", desc: "Packed with vitamins.", price: 400, unit: "1kg", img: "orange.jpeg" },
  { id: 6, name: "Potatoes", desc: "Fresh and organic.", price: 35, unit: "1kg", img: "potatu.jpg" },
  { id: 7, name: "Strawberries", desc: "Sweet and juicy.", price: 700, unit: "1kg", img: "stro.jpg" },
  { id: 8, name: "Tomatoes", desc: "Rich in antioxidants.", price: 25, unit: "1kg", img: "tomato.jpg" }
];

// ------------------------------
// Cart Operations
// ------------------------------
let cart = [];
let promoApplied = null;  // e.g., "ostad10" or "ostad50"
let discountPercent = 0;

// ------------------------------
// Render Products
// ------------------------------
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(p => `
    <div class="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
      <img src="${p.img}" alt="${p.name}" class="w-full h-40 object-cover mb-3 rounded">
      <h3 class="font-bold text-lg">${p.name}</h3>
      <p class="text-sm text-gray-600">${p.desc}</p>
      <p class="text-sm text-gray-500">${p.unit}</p>
      <p class="font-semibold mt-2">৳${p.price}</p>
      <button onclick="addToCart(${p.id})" class="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>
    </div>
  `).join("");
}

// ------------------------------
// Cart Functions
// ------------------------------
function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateQty(id, qty) {
  const item = cart.find(p => p.id === id);
  if (item && qty > 0) {
    item.qty = qty;
  } else if (qty <= 0) {
    removeFromCart(id);
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  updateCartUI();
}

function clearCart() {
  cart = [];
  promoApplied = null;
  discountPercent = 0;
  document.getElementById("promo-message").textContent = "";
  document.getElementById("discounted-total").classList.add("hidden");
  updateCartUI();
}

// ------------------------------
// UI Update
// ------------------------------
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const discountedTotal = document.getElementById("discounted-total");

  cartItems.innerHTML = cart.map(item => `
    <li class="flex justify-between items-center">
      <div>
        <p class="font-semibold">${item.name}</p>
        <p>৳${item.price} x ${item.qty}</p>
        <div class="flex items-center space-x-2 mt-1">
          <button class="bg-gray-200 px-2 py-1 rounded" onclick="updateQty(${item.id}, ${item.qty - 1})">-</button>
          <span>${item.qty}</span>
          <button class="bg-gray-200 px-2 py-1 rounded" onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-red-500">🗑</button>
    </li>
  `).join("");

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  // ✅ Apply discount to total
  if (promoApplied && discountPercent > 0) {
    let discounted = total - (total * discountPercent / 100);
    cartTotal.textContent = `৳${discounted.toFixed(2)}`;
    discountedTotal.textContent = `Original Total: ৳${total.toFixed(2)}`;
    discountedTotal.classList.remove("hidden");
  } else {
    cartTotal.textContent = `৳${total.toFixed(2)}`;
    discountedTotal.classList.add("hidden");
  }
}

// ------------------------------
// Promo Code Logic
// ------------------------------
document.getElementById("apply-promo").addEventListener("click", () => {
  const code = document.getElementById("promo-code").value.trim().toLowerCase();
  const promoMessage = document.getElementById("promo-message");

  if (promoApplied) {
    promoMessage.textContent = "Promo code already applied!";
    promoMessage.classList.add("text-red-500");
    return;
  }

  if (code === "ostad10") {
    discountPercent = 10;
    promoApplied = "ostad10";
    promoMessage.textContent = "Promo Applied: 10% Discount 🎉";
    promoMessage.classList.remove("text-red-500");
    promoMessage.classList.add("text-green-600");
  } else if (code === "ostad50") {
    discountPercent = 50;
    promoApplied = "ostad50";
    promoMessage.textContent = "Promo Applied: 50% Discount 🎉";
    promoMessage.classList.remove("text-red-500");
    promoMessage.classList.add("text-green-600");
  } else {
    promoMessage.textContent = "Invalid Promo Code!";
    promoMessage.classList.remove("text-green-600");
    promoMessage.classList.add("text-red-500");
    return;
  }

  updateCartUI(); // 🔹 Recalculate total after promo applied
});

// ------------------------------
// Event Listeners
// ------------------------------
document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cart-sidebar").classList.toggle("translate-x-full");
});

document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-sidebar").classList.add("translate-x-full");
});

document.getElementById("clear-cart").addEventListener("click", clearCart);

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Order placed successfully!");
    clearCart();
  }
});

// ------------------------------
// Init
// ------------------------------
renderProducts();
updateCartUI();
