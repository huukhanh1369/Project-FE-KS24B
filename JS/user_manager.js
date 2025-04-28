const usersData = {
    "users": [
        {
            "id": 1,
            "firstname": "Lê",
            "lastname": "Minh Thu",
            "email": "minhthu@gmail.com",
            "status": "hoạt động"
        },
        {
            "id": 2,
            "firstname": "Vũ",
            "lastname": "Hồng Vân",
            "email": "hongvan@yahoo.com",
            "status": "hoạt động"
        }
    ]
};

let ascending = true;

function renderUsers(users) {
    const tableBody = document.querySelector(".user-table-body");
    tableBody.innerHTML = "";

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>
          <div class="user-info">
            <div class="avatar">${user.firstname[0]}</div>
            <div class="user-text">
              <strong>${user.firstname} ${user.lastname}</strong><br>
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
    renderUsers(usersData.users);

    const sortNameBtn = document.getElementById("sort-name");
    sortNameBtn.addEventListener("click", () => {
        ascending = !ascending;
        const sortedUsers = [...usersData.users].sort((a, b) => {
            const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
            const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });

        sortNameBtn.textContent = `Sort by name ${ascending ? "⬇️" : "⬆️"}`;
        renderUsers(sortedUsers);
    });
});
