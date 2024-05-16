const usernameInput = document.getElementsByName("username")[0];
const passwordInput = document.getElementsByName("password")[0];
const form = document.querySelector("form");
const loginButton = document.querySelector("button[type='submit']");
const resetButton = document.querySelector("button[type='reset']");

let username, password;
init();

function init() {
  loginButton.disabled = true;
  resetButton.onclick = resetInputValues;

  // toggleButton();
  redirect();

  usernameInput.oninput = function (event) {
    username = event.target.value.trim();
    toggleButton();
  };

  passwordInput.oninput = function (event) {
    password = event.target.value.trim();
    toggleButton();
  };

  form.onsubmit = async function (event) {
    event.preventDefault();
    console.log(username.length);

    const result = await login();
    saveToken(result.token);
    redirect();
  };
}

function toggleButton() {
  if (username && password) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

async function login() {
  const response = await fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  return result;
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function redirect() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "http://127.0.0.1:5500/index.html";
  }
}

function resetInputValues() {
  username = "";
  password = "";
}
