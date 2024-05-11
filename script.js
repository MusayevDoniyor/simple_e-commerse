const container = document.querySelector(".container");

init();

async function init() {
  checkToken();

  const products = await fetchProducts(); // array
  render(products);
}

function checkToken() {
  const token = localStorage.getItem("token");

  // no token
  if (!token) {
    window.location.href = "http://127.0.0.1:5500/login.html";
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

async function fetchProducts() {
  showSpinner();

  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  hideSpinner();
  return products;
}

function render(products) {
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

    const stars = "<span>⭐️</span>".repeat(Math.round(product.rating.rate));
    li.insertAdjacentHTML("beforeend", stars);

    const ratingCount = document.createElement("div");
    ratingCount.textContent = `(${product.rating.count})`;
    li.append(ratingCount);

    container.append(li);
  });
}
