document.addEventListener("DOMContentLoaded", function () {
    ensureAdminExists();
  
    const loginBtn = document.querySelector(".login-btn");
  
    loginBtn.addEventListener("click", function () {
      const email = document.querySelector("#email");
      const password = document.querySelector("#password");
  
      clearErrors();
  
      let isValid = true;
  
      if (email.value.trim() === "") {
        showError(email, "Please enter your email.");
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, "Invalid email format.");
        isValid = false;
      }
  
      if (password.value.trim() === "") {
        showError(password, "Please enter your password.");
        isValid = false;
      }
  
      if (!isValid) return;
  
      const admins = JSON.parse(localStorage.getItem("admins")) || [];
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      const foundAdmin = admins.find(admin => admin.email === email.value && admin.password === password.value);
      const foundUser = users.find(user => user.email === email.value && user.password === password.value);
  
      if (foundAdmin) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "user_manager.html";
      } else if (foundUser) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";
      } else {
        showError(password, "Email or Password is incorrect.");
      }
    });
  
    function showError(inputElement, message) {
      inputElement.classList.add("input-error");
      const errorDiv = inputElement.parentElement.querySelector(".error-message");
      errorDiv.innerText = message;
      errorDiv.style.display = "block";
    }
  
    function clearErrors() {
      const inputs = document.querySelectorAll("input");
      inputs.forEach(input => input.classList.remove("input-error"));
  
      const errorMessages = document.querySelectorAll(".error-message");
      errorMessages.forEach(div => {
        div.innerText = "";
        div.style.display = "none";
      });
    }
  
    function attachInputListeners() {
      const inputs = document.querySelectorAll("input");
      inputs.forEach(input => {
        input.addEventListener("input", clearErrors);
      });
    }
  
    attachInputListeners();
  });
  
  function ensureAdminExists() {
    let admins = JSON.parse(localStorage.getItem("admins")) || [];
    const adminExists = admins.some(admin => admin.email === "admin@admin.com");
  
    if (!adminExists) {
      admins.push({
        firstname: "Admin",
        lastname: "System",
        username: "admin",
        email: "admin@admin.com",
        password: "admin",
        status: "hoạt động",
        avatar: "https://i.pravatar.cc/150?u=admin",
        role: "admin"
      });
      localStorage.setItem("admins", JSON.stringify(admins));
    }
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  