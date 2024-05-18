const main = document.querySelector("main");

let deleting = false;

// IIFE
(async function () {
  const hasToken = checkToken();

  if (!hasToken) redirectToLogin();

  const products = await fetchProducts(); // array

  if (products.length) {
    renderProducts(products);
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
  document.body.prepend(div);
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.remove();
}

function renderProducts(products) {
  const container = document.createElement("ul");
  container.className = "container";

  products.forEach(function (product) {
    // object
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
    price.textContent = product.price;
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
    deleteBtn.id = "deleteBtn";

    
    deleteBtn.onclick = function () {
      deleteProduct(product.id);
    };
    li.append(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.id = "editBtn";
    editBtn.onclick = function() {
      editProduct(product.id);
    } 
    li.append(editBtn);

    container.append(li);
    main.append(container);
  });
}

async function deleteProduct(id) {
  const deleteBtn = document.getElementById("deleteBtn");
  try {
    deleteBtn.innerHTML =
      "<div style='margin: auto' class='spinner' disabled='true'></div>";

    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    const product = document.getElementById(`productId-${id}`);
    product.remove();
  } catch (error) {
    console.error(error);
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

  const categories = await fetchCategories(); // []

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
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${categoryName}`
    );
    const productsByCategory = await response.json();

    document.querySelector('.container').remove()

    renderProducts(productsByCategory);
  } catch (error) {
    console.error(error)
  } finally {
    hideSpinner();
  }

  async function editProduct(productId) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
      const result = await response.json();
    } catch (error) {
      
    }
  }

  // Create POST
  // Read GET
  // Update PUT / PATCH
  // Delete DELETE
}


