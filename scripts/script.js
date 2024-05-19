const main = document.querySelector("main");

let deleting = false;
let editing = false;
let allProducts = [];

// IIFE
(async function () {
  const hasToken = checkToken();

  if (!hasToken) redirectToLogin();

  allProducts = await fetchProducts(); // array

  if (allProducts.length) {
    renderProducts(allProducts);
  }

  renderCategories();
})();

function checkToken() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

function redirectToLogin() {
  window.location.href = "http://127.0.0.1:5500/login.html";
}

async function fetchProducts() {
  showSpinner();

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    return products;
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  const div = document.createElement("div");
  div.className = "spinner";
  div.style.margin = "auto";
  document.body.prepend(div);
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  if (spinner) spinner.remove();
}

function renderProducts(products) {
  const container = document.createElement("ul");
  container.className = "container";

  products.forEach(function (product) {
    const li = document.createElement("li");
    li.id = `productId-${product.id}`;

    const a = document.createElement("a");
    a.href = `http://127.0.0.1:5500/product.html?id=${product.id}`;

    const img = document.createElement("img");
    img.src = product.image;
    li.append(img);

    const title = document.createElement("p");
    title.textContent = product.title;
    a.append(title);
    li.append(a);

    const price = document.createElement("strong");
    price.textContent = `$${product.price.toFixed(2)}`;
    li.append(price);

    const starsContainer = document.createElement("div");
    const stars = "<span>⭐️</span>".repeat(Math.round(product.rating.rate));
    starsContainer.insertAdjacentHTML("beforeend", stars);
    li.append(starsContainer);

    const ratingCount = document.createElement("div");
    ratingCount.textContent = `(${product.rating.count})`;
    li.append(ratingCount);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.id = `deleteBtn-${product.id}`;

    deleteBtn.onclick = function () {
      deleteProduct(product.id);
    };
    li.append(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.id = `editBtn-${product.id}`;
    editBtn.onclick = function () {
      editProduct(product.id);
    };
    li.append(editBtn);

    container.append(li);
  });

  main.append(container);
}

async function deleteProduct(id) {
  const deleteBtn = document.getElementById(`deleteBtn-${id}`);
  deleteBtn.disabled = true;

  const spinner = document.createElement("div");
  spinner.style.margin = "auto";
  spinner.className = "spinner";
  deleteBtn.textContent = "";
  deleteBtn.appendChild(spinner);

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    const product = document.getElementById(`productId-${id}`);
    product.remove();
  } catch (error) {
    console.error(error);
  } finally {
    deleteBtn.disabled = false;
    deleteBtn.textContent = "Delete";
    spinner.remove();
  }
}

async function fetchCategories() {
  const response = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await response.json();

  return categories;
}

async function renderCategories() {
  const select = document.createElement("select");
  select.name = "categories";
  select.style.marginBottom = "1rem";
  select.onchange = function (event) {
    handleSelect(event);
  };

  const categories = await fetchCategories();

  categories.forEach(function (category) {
    const option = document.createElement("option");
    option.text = category;
    option.value = category;

    select.append(option);
  });

  const option = document.createElement("option");
  option.text = "All";
  option.value = "all";
  option.selected = true;
  select.prepend(option);

  main.prepend(select);
}

async function handleSelect(event) {
  const categoryName = event.target.value;

  try {
    showSpinner();

    let productsByCategory;
    if (categoryName === "all") {
      productsByCategory = allProducts;
    } else {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${categoryName}`
      );
      productsByCategory = await response.json();
    }

    document.querySelector(".container").remove();

    renderProducts(productsByCategory);
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}

async function editProduct(productId) {
  try {
    editing = true;
    showSpinner();

    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    const product = await response.json();

    const newTitle = prompt("Edit product title:", product.title);
    const newPrice = prompt("Edit product price:", product.price);
    const newImage = prompt("Edit product image URL:", product.image);

    const updatedProduct = {
      ...product,
      title: newTitle || product.title,
      price: parseFloat(newPrice) || product.price,
      image: newImage || product.image,
    };

    // Productlar ko'rinishini o'zgartirish
    const productElement = document.getElementById(`productId-${productId}`);
    productElement.querySelector("p").textContent = updatedProduct.title;
    productElement.querySelector(
      "strong"
    ).textContent = `$${updatedProduct.price.toFixed(2)}`;
    productElement.querySelector("img").src = updatedProduct.image;

    // O'zgarishlarni saqlash
    await fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
  } catch (error) {
    console.error(error);
  } finally {
    editing = false;
    hideSpinner();
  }
}

// Create POST
// Read GET
// Update PUT / PATCH
// Delete DELETE
