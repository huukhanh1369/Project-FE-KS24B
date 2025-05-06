if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

let ascending = true;

// Dữ liệu người dùng mặc định
const defaultUsers = [
  {
    firstname: "John",
    lastname: "Doe",
    username: "johndoe",
    email: "john@example.com",
    role: "user",
    avatar: "../assets/imgs/Avatar.png",
    isBlocked: false
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    username: "janesmith",
    email: "jane@example.com",
    role: "user",
    avatar: "../assets/imgs/Avatar1.png",
    isBlocked: false
  }
];

function renderUsers(users) {
  const tableBody = document.querySelector(".user-table-body");
  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }
  tableBody.innerHTML = "";

  if (users.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No users found.</td></tr>`;
    return;
  }

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="user-info">
          <img src="${user.avatar}" class="avatar-img" />
          <div class="user-text">
            <strong>${user.firstname} ${user.lastname}</strong><br>
            <span class="username">@${user.username}</span>
          </div>
        </div>
      </td>
      <td>${user.isBlocked ? "Blocked" : "Unblocked"}</td>
      <td>${user.email}</td>
      <td>
        <button class="btn block" data-username="${user.username}">${user.isBlocked ? "Blocked" : "Block"}</button>
        <button class="btn unblock" data-username="${user.username}">${user.isBlocked ? "Unblock" : "Unblocked"}</button>
      </td>
      <td></td>
    `;
    tableBody.appendChild(tr);
  });

  // Thêm sự kiện cho nút block
  document.querySelectorAll(".btn.block").forEach(button => {
    button.addEventListener("click", () => {
      const username = button.getAttribute("data-username");
      updateUserBlockStatus(username, true);
    });
  });

  // Thêm sự kiện cho nút unblock
  document.querySelectorAll(".btn.unblock").forEach(button => {
    button.addEventListener("click", () => {
      const username = button.getAttribute("data-username");
      updateUserBlockStatus(username, false);
    });
  });
}

// Hàm cập nhật trạng thái block/unblock
function updateUserBlockStatus(username, isBlocked) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(user => {
    if (user.username === username) {
      return { ...user, isBlocked };
    }
    return user;
  });
  localStorage.setItem("users", JSON.stringify(users));
  const filteredUsers = users.filter(user => user.role === "user");
  renderUsers(filteredUsers);
}

document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo dữ liệu mặc định nếu localStorage trống
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.length === 0) {
    users = [...defaultUsers];
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Lọc người dùng với role là "user"
  const filteredUsers = users.filter(user => user.role === "user");
  renderUsers(filteredUsers);

  const sortNameBtn = document.getElementById("sort-name");
  if (sortNameBtn) {
    sortNameBtn.addEventListener("click", () => {
      ascending = !ascending;
      const sortedUsers = [...filteredUsers].sort((a, b) => {
        const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
        const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
        return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });

      sortNameBtn.textContent = `Sort by name ${ascending ? "⬇️" : "⬆️"}`;
      renderUsers(sortedUsers);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }
});