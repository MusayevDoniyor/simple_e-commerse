const container = document.querySelector(".container");

function showSpinner() {
  const div = document.createElement("div");
  div.className = "spinner";
  document.body.prepend(div)
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


async function init() {
  const products = await fetchProducts(); // array
  render(products);
}

function render(products) {
  products.forEach(function(product) { // object
    const li = document.createElement("li");
   
    const img = document.createElement("img");
    img.src = product.image;
    li.append(img);
    
    const title = document.createElement("p");
    title.textContent = product.title;
    li.append(title);
    
    const price = document.createElement("strong");
    price.textContent = product.price;
    li.append(price);
    
    const stars = "<span>⭐️</span>".repeat(Math.round(product.rating.rate));
    li.insertAdjacentHTML("beforeend", stars);
    
    const ratingCount = document.createElement("div");
    ratingCount.textContent = `(${product.rating.count})`;
    li.append(ratingCount);
    
    container.append(li);
  })
}

init();