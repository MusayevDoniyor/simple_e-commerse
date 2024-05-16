// IIFE
(async function () {
  const hasToken = checkToken();

  if (!hasToken) redirectToLogin();

  const products = await fetchProducts(); // array

  if (products.length) {
    renderProducts(products);
  }
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

    container.append(li);
    document.body.append(container);
  });
}
