document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector(".login-btn");

    loginBtn.addEventListener("click", function () {
        const username = document.querySelector('input[placeholder="username"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        const storedUsername = localStorage.getItem("username");
        if (username !== storedUsername) {
            alert("Username not found.");
            return;
        }
        if (username.trim() === "" || password.trim() === "") {
            alert("Please enter both username and password.");
            return;
        }
        


        // Lưu trạng thái đăng nhập
        localStorage.setItem("loggedIn", "true");

        // Chuyển về trang chính
        window.location.href = "./index.html";
    });
});
