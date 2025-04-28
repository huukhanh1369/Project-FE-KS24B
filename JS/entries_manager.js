const data = {
    entries: [
        { id: 1, name: "Nhật ký học tập" },
        { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
        { id: 3, name: "Nhật ký trải nghiệm - học qua đời sống" }
    ]
};

function renderCategories() {
    const table = document.getElementById("categoryTable");
    table.innerHTML = "";

    data.entries.forEach((entry) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${entry.name}</td>
        <td>
          <button onclick="editCategory(${entry.id})">Edit</button>
          <button onclick="deleteCategory(${entry.id})">Delete</button>
        </td>
      `;

        table.appendChild(row);
    });
}

function addCategory() {
    const input = document.getElementById("categoryName");
    const name = input.value.trim();

    if (!name) {
        alert("Vui lòng nhập tên chuyên mục!");
        return;
    }

    const newId = data.entries.length + 1;
    data.entries.push({ id: newId, name });
    input.value = "";
    renderCategories();
}

function deleteCategory(id) {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (!confirmDelete) return;

    data.entries = data.entries.filter((entry) => entry.id !== id);
    renderCategories();
}

function editCategory(id) {
    const entry = data.entries.find((entry) => entry.id === id);
    const newName = prompt("Sửa tên chuyên mục:", entry.name);

    if (newName !== null && newName.trim() !== "") {
        entry.name = newName.trim();
        renderCategories();
    }
}

renderCategories();
