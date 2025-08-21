// ------------------------------
// Products Data
// ------------------------------
const products = [
  { id: 1, name: "Fresh Apples", desc: "Crisp and sweet.", price: 300, unit: "1kg", img: "apple.jpg" },
  { id: 2, name: "pineapple", desc: "Healthy and crunchy.", price: 60, unit: "1pc", img: "pinaple.jpg" },
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

// Example product structure


const productList = document.getElementById("product-list");


products.forEach(p => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <h3 class="font-semibold text-lg">${p.name}</h3>
    <p class="text-gray-600 mb-2">$${p.price}</p>
    <p class="text-gray-600 mb-2">${p.unit}</p>
    <div class="flex justify-center items-center space-x-2">
      <button class="qty-btn" data-id="${p.id}" data-action="minus">-</button>
      <span id="qty-${p.id}">0</span>
      <button class="qty-btn" data-id="${p.id}" data-action="plus">+</button>
    </div>
    <button class="add-to-cart mt-2 w-full" data-id="${p.id}">Add to Cart</button>
  `;

  productList.appendChild(card);
});

// Quantity buttons logic
productList.addEventListener("click", e => {
  if(e.target.classList.contains("qty-btn")) {
    const id = parseInt(e.target.dataset.id);
    const action = e.target.dataset.action;
    let item = cart.find(i => i.id === id);
    if(!item) {
      const prod = products.find(p => p.id === id);
      item = { ...prod, qty: 0 };
      cart.push(item);
    }
    if(action === "plus") item.qty++;
    if(action === "minus") item.qty = Math.max(0, item.qty - 1);
    document.getElementById(`qty-${id}`).textContent = item.qty;
  }
});


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
    alert("Quantity cannot be negative or zero!");
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  updateCartUI();
}

function clearCart() {
  cart = [];
  updateCartUI();
}

// ------------------------------
// UI Updates
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

function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutSummary = document.getElementById("checkout-summary");

  cartItems.innerHTML = cart.map(item => `
    <li class="flex justify-between items-center">
      <div>
        <p class="font-semibold">${item.name}</p>
        <p>$${item.price} x 

        </p>
          <div class="flex items-center space-x-2 mt-1">
          <button class="qty-btn bg-gray-200 px-2 py-1 rounded" onclick="updateQty(${item.id}, ${item.qty - 1})">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn bg-gray-200 px-2 py-1 rounded" onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-red-500">🗑</button>
    </li>
  `).join("");

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartTotal.textContent = total.toFixed(2);

  // Checkout summary
  if (cart.length === 0) {
    checkoutSummary.innerHTML = `<p class="text-gray-600">No items in cart.</p>`;
  } else {
    checkoutSummary.innerHTML = `
      <ul class="space-y-2">
        ${cart.map(item => `<li>${item.name} (${item.qty}) - ৳${(item.price * item.qty).toFixed(2)}</li>`).join("")}
      </ul>
      <p class="font-bold mt-2">Total: ৳${total.toFixed(2)}</p>
    `;
  }
}

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

// Initialize
renderProducts();
updateCartUI();