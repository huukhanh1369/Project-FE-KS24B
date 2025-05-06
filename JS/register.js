document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.querySelector(".register-btn");

  registerBtn.addEventListener("click", function () {
    const firstName = document.querySelector("#first-name");
    const lastName = document.querySelector("#last-name");
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirmPassword");

    clearErrors();

    let isValid = true;

    if (firstName.value.trim() === "") {
      showError(firstName, "First name cannot be empty.");
      isValid = false;
    }
    if (lastName.value.trim() === "") {
      showError(lastName, "Last name cannot be empty.");
      isValid = false;
    }
    if (username.value.trim() === "") {
      showError(username, "Username cannot be empty.");
      isValid = false;
    }
    if (email.value.trim() === "") {
      showError(email, "Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Invalid email format.");
      isValid = false;
    }
    if (password.value.trim() === "") {
      showError(password, "Password cannot be empty.");
      isValid = false;
    }
    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters.");
      isValid = false;
    }
    if (confirmPassword.value.trim() === "") {
      showError(confirmPassword, "Confirm password cannot be empty.");
      isValid = false;
    }
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    // Save user
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate email
    const emailExists = users.some(user => user.email === email.value.trim());
    if (emailExists) {
      showError(email, "This email is already registered.");
      return;
    }

    // Check duplicate username
    const usernameExists = users.some(user => user.username === username.value.trim());
    if (usernameExists) {
      showError(username, "This username is already taken.");
      return;
    }

    users.push({
      firstname: firstName.value.trim(),
      lastname: lastName.value.trim(),
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      status: "hoạt động",
      avatar: "https://i.pravatar.cc/150?u=" + username.value.trim(),
      role: "user",
      isBlocked: false // Thêm thuộc tính isBlocked
    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("registerSuccess", "true");
    window.location.href = "login.html";
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

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}