
let ascending = true;

function renderUsers(users) {
  const tableBody = document.querySelector(".user-table-body");
  tableBody.innerHTML = "";

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
      <td>${user.status}</td>
      <td>${user.email}</td>
      <td>
        <button class="btn block">block</button>
        <button class="btn unblock">unblock</button>
      </td>
      <td></td>
    `;
    tableBody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let users = (JSON.parse(localStorage.getItem("users")) || []).filter(user => user.role === "user");

  renderUsers(users);

  const sortNameBtn = document.getElementById("sort-name");
  sortNameBtn.addEventListener("click", () => {
    ascending = !ascending;
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
      const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    sortNameBtn.textContent = `Sort by name ${ascending ? "⬇️" : "⬆️"}`;
    renderUsers(sortedUsers);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }

});
