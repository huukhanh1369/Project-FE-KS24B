const data = {
  entries: []
};

// Biến tạm lưu ID đang edit hoặc delete
let currentEditId = null;
let currentDeleteId = null;

// Hàm lưu dữ liệu vào localStorage
function saveEntriesToStorage() {
localStorage.setItem("entryCategories", JSON.stringify(data.entries));
}

// Hàm tải dữ liệu từ localStorage
function loadEntriesFromStorage() {
const storedEntries = localStorage.getItem("entryCategories");
if (storedEntries) {
  data.entries = JSON.parse(storedEntries);
} else {
  // Nếu chưa có dữ liệu, gán dữ liệu mẫu ban đầu
  data.entries = [
    { id: 1, name: "Nhật ký học tập" },
    { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
    { id: 3, name: "Nhật ký trải nghiệm - học qua đời sống" }
  ];
  // Lưu dữ liệu mẫu vào localStorage
  saveEntriesToStorage();
}
}

// Render bảng
function renderCategories() {
const table = document.getElementById("entry-list");
table.innerHTML = "";

data.entries.forEach((entry) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${entry.name}</td>
    <td>
      <button class="action-btn edit-btn" onclick="openEditModal(${entry.id})">Edit</button>
      <button class="action-btn delete-btn" onclick="openDeleteModal(${entry.id})">Delete</button>
    </td>
  `;
  table.appendChild(row);
});
}

// Thêm chuyên mục
function addEntry() {
const input = document.getElementById("entry-input");
const name = input.value.trim();
if (!name) return 

const newId = data.entries.length ? Math.max(...data.entries.map(e => e.id)) + 1 : 1;
data.entries.push({ id: newId, name });
input.value = "";

// Lưu vào localStorage sau khi thêm
saveEntriesToStorage();

renderCategories();
}

// Modal: Xóa
function openDeleteModal(id) {
currentDeleteId = id;
document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
currentDeleteId = null;
document.getElementById("deleteModal").classList.add("hidden");
}

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
data.entries = data.entries.filter(e => e.id !== currentDeleteId);

// Lưu vào localStorage sau khi xóa
saveEntriesToStorage();

closeDeleteModal();
renderCategories();
});

// Modal: Sửa
function openEditModal(id) {
currentEditId = id;
const entry = data.entries.find(e => e.id === id);
document.getElementById("editInput").value = entry.name;
document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
currentEditId = null;
document.getElementById("editModal").classList.add("hidden");
}

document.getElementById("confirmEditBtn").addEventListener("click", function () {
const newName = document.getElementById("editInput").value.trim();
if (!newName) {
  alert("Category name cannot be empty!");
  return;
}
const entry = data.entries.find(e => e.id === currentEditId);
if (entry) {
  entry.name = newName;
  
  // Lưu vào localStorage sau khi sửa
  saveEntriesToStorage();
  
  closeEditModal();
  renderCategories();
}
});

// Đóng modal khi click ra ngoài
window.addEventListener("click", function (event) {
const deleteModal = document.getElementById("deleteModal");
const editModal = document.getElementById("editModal");

if (event.target === deleteModal) {
  closeDeleteModal();
}
if (event.target === editModal) {
  closeEditModal();
}
});

// Đóng modal bằng ESC
window.addEventListener("keydown", function (event) {
if (event.key === "Escape") {
  closeDeleteModal();
  closeEditModal();
}
});

// Tải dữ liệu từ localStorage khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
// Tải dữ liệu danh mục từ localStorage
loadEntriesFromStorage();

// Render lần đầu
renderCategories();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
  });
}
});