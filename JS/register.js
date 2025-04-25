document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.querySelector(".register-btn");
  
    registerBtn.addEventListener("click", function () {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const confirmPassword = document.querySelector("#confirmPassword").value;
  
      if (username.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
        alert("Please fill in all fields.");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      // Lưu thông tin vào localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
  
      // Chuyển sang trang login
      window.location.href = "login.html";
    });
  });
  