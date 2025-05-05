// Kiểm tra trạng thái đăng nhập khi vào trang
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

let currentPage = 1;
const articlesPerPage = 5;
let currentEditId = null;
let deleteId = null;

// Mảng dữ liệu bài viết
let articles = [];
// Mảng dữ liệu danh mục từ entries_manager.js
let entryCategories = [];

// Dữ liệu mặc định khi không có dữ liệu trong localStorage
const defaultArticles = [
  { 
    id: 1,
    title: "A Productive Day at Work", 
    category: "Daily Journal", 
    content: "Today was a really productive day at work...", 
    status: "Public", 
    img: "../assets/imgs/article1.png" 
  },
  { 
    id: 2,
    title: "My First Job Interview Experience", 
    category: "Work & Career", 
    content: "I had my first job interview today...", 
    status: "Private", 
    img: "../assets/imgs/article2.png" 
  },
  { 
    id: 3,
    title: "Weekend Trip", 
    category: "Travel", 
    content: "Explored new places...", 
    status: "Public", 
    img: "../assets/imgs/article3.png" 
  },
];

// Dữ liệu mặc định cho categories từ entries_manager.js
const defaultEntryCategories = [
  { id: 1, name: "Nhật ký học tập" },
  { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
  { id: 3, name: "Nhật ký trải nghiệm - học qua đời sống" }
];

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const authButtons = document.querySelector(".auth-buttons");
  const userMenu = document.querySelector(".nav-right");

  if (isLoggedIn === "true") {
    if (authButtons) authButtons.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
  } else {
    if (authButtons) authButtons.style.display = "flex";
    if (userMenu) userMenu.style.display = "none";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }
  
  // Lấy dữ liệu từ localStorage nếu có
  loadArticlesFromStorage();
  loadCategoriesFromStorage();
  
  // Đổi từ blog-grid sang articleTable để hiển thị bài viết trong bảng
  renderArticleTable();
  
  // Thêm lắng nghe sự kiện cho nút add trong modal - FIX: sửa selector để đúng với nút "Add"
  const addButton = document.getElementById("addArticleBtn");
  if (addButton) {
    addButton.addEventListener("click", addArticle);
  }
  
  // Thiết lập select category trong modal thêm bài
  updateCategoryDropdown();
});

// Hàm load bài viết từ localStorage
function loadArticlesFromStorage() {
  const storedArticles = localStorage.getItem("articles");
  if (storedArticles) {
    articles = JSON.parse(storedArticles);
  } else {
    // Nếu không có dữ liệu, sử dụng dữ liệu mặc định
    articles = [...defaultArticles];
    saveArticlesToStorage();
  }
}

// Hàm lưu bài viết vào localStorage
function saveArticlesToStorage() {
  localStorage.setItem("articles", JSON.stringify(articles));
}

// Hàm load danh mục từ localStorage
function loadCategoriesFromStorage() {
  const storedCategories = localStorage.getItem("entryCategories");
  if (storedCategories) {
    entryCategories = JSON.parse(storedCategories);
  } else {
    // Nếu không có dữ liệu, sử dụng dữ liệu mặc định
    entryCategories = [...defaultEntryCategories];
    saveCategoriesStorage();
  }
}

// Hàm lưu danh mục vào localStorage
function saveCategoriesStorage() {
  localStorage.setItem("entryCategories", JSON.stringify(entryCategories));
}

// Hàm cập nhật dropdown danh mục trong modal
function updateCategoryDropdown() {
  const categorySelect = document.getElementById("category");
  if (categorySelect) {
    // Xóa tất cả options hiện tại
    categorySelect.innerHTML = "";
    
    // Thêm option mặc định
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Chọn chuyên mục --";
    categorySelect.appendChild(defaultOption);
    
    // Thêm options từ danh mục entries
    entryCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }
}

// Hàm hiển thị bài viết trong bảng
function renderArticleTable() {
  const tableBody = document.getElementById("articleTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const currentArticles = articles.slice(start, end);

  currentArticles.forEach(article => {
    // Tạo hàng mới cho mỗi bài viết
    const row = document.createElement("tr");
    
    // Tạo nội dung HTML cho hàng
    row.innerHTML = `
      <td><img src="${article.img}" class="article-image" alt="${article.title}"></td>
      <td>${article.title}</td>
      <td>${article.category}</td>
      <td>${article.content.substring(0, 30)}...</td>
      <td><span class="status-${article.status.toLowerCase()}">${article.status}</span></td>
      <td>
        <select class="status-select ${article.status.toLowerCase()}" onchange="updateStatus(${article.id}, this.value)">
          <option value="Public" ${article.status === "Public" ? "selected" : ""}>Public</option>
          <option value="Private" ${article.status === "Private" ? "selected" : ""}>Private</option>
        </select>
      </td>
      <td>
        <button class="action-btn edit" onclick="openEditModal(${article.id})">Sửa</button>
        <button class="action-btn delete" onclick="openDeleteModal(${article.id})">Xóa</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });

  renderPagination();
}

function renderPagination() {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  const pageCount = Math.ceil(articles.length / articlesPerPage);
  
  // Nút Previous với disabled nếu ở trang đầu tiên
  let html = `<button onclick="changePage('prev')" ${currentPage === 1 ? 'disabled' : ''}>← Previous</button>`;
  
  html += `<div class="pages">`;
  
  // Hiển thị số trang thông minh
  if (pageCount <= 5) {
    // Nếu tổng số trang ≤ 5, hiển thị tất cả
    for (let i = 1; i <= pageCount; i++) {
      html += `<span onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</span>`;
    }
  } else {
    // Nếu tổng số trang > 5, hiển thị thông minh
    // Luôn hiển thị trang đầu
    html += `<span onclick="goToPage(1)" ${1 === currentPage ? 'class="active"' : ''}>1</span>`;
    
    // Tính toán phạm vi trang cần hiển thị
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(pageCount - 1, currentPage + 1);
    
    // Nếu ở gần trang đầu
    if (currentPage < 4) {
      endPage = 4;
    }
    
    // Nếu ở gần trang cuối
    if (currentPage > pageCount - 3) {
      startPage = pageCount - 3;
    }
    
    // Hiển thị dấu ... nếu không bắt đầu từ trang 2
    if (startPage > 2) {
      html += `<span>...</span>`;
    }
    
    // Hiển thị các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      html += `<span onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</span>`;
    }
    
    // Hiển thị dấu ... nếu không kết thúc ở trang pageCount-1
    if (endPage < pageCount - 1) {
      html += `<span>...</span>`;
    }
    
    // Luôn hiển thị trang cuối
    html += `<span onclick="goToPage(${pageCount})" ${pageCount === currentPage ? 'class="active"' : ''}>${pageCount}</span>`;
  }
  
  html += `</div>`;

  // Nút Next với disabled nếu ở trang cuối cùng
  html += `<button onclick="changePage('next')" ${currentPage === pageCount ? 'disabled' : ''}>Next →</button>`;

  paginationContainer.innerHTML = html;
}

function changePage(direction) {
  const pageCount = Math.ceil(articles.length / articlesPerPage);

  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next" && currentPage < pageCount) {
    currentPage++;
  }

  renderArticleTable();
}

function goToPage(page) {
  currentPage = page;
  renderArticleTable();
}

// Hàm cập nhật trạng thái bài viết
function updateStatus(id, newStatus) {
  const articleIndex = articles.findIndex(article => article.id === id);
  if (articleIndex !== -1) {
    articles[articleIndex].status = newStatus;
    
    // Lưu thay đổi vào localStorage
    saveArticlesToStorage();
    
    // Cập nhật lại giao diện
    const row = event.target.closest('tr');
    if (row) {
      // Cập nhật trạng thái hiển thị
      const statusCell = row.querySelector('td:nth-child(5)');
      if (statusCell) {
        statusCell.innerHTML = `<span class="status-${newStatus.toLowerCase()}">${newStatus}</span>`;
      }
      
      // Cập nhật class cho select
      const selectElement = event.target;
      selectElement.className = `status-select ${newStatus.toLowerCase()}`;
    }
  }
}

// Hàm hiển thị modal thông báo lỗi
function showValidationModal(message) {
  // Tạo modal nếu chưa tồn tại
  let validationModal = document.getElementById("validationModal");
  
  if (!validationModal) {
    validationModal = document.createElement("div");
    validationModal.id = "validationModal";
    validationModal.className = "modal";
    
    validationModal.innerHTML = `
      <div class="modal-content">
        <h3>Thông báo</h3>
        <p id="validationMessage"></p>
        <div class="modal-actions">
          <button onclick="closeValidationModal()">Đóng</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(validationModal);
  }
  
  // Cập nhật nội dung thông báo
  document.getElementById("validationMessage").textContent = message;
  
  // Hiển thị modal
  validationModal.classList.remove("hidden");
}

// Hàm đóng modal thông báo lỗi
function closeValidationModal() {
  const validationModal = document.getElementById("validationModal");
  if (validationModal) {
    validationModal.classList.add("hidden");
  }
}

// Các hàm xử lý modal thêm bài viết
function openAddModal() {
  const modal = document.getElementById("articleModal");
  if (modal) {
    modal.classList.remove("hidden");
    // Cập nhật dropdown danh mục
    updateCategoryDropdown();
  }
}

function closeAddModal() {
  const modal = document.getElementById("articleModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  
  // Reset form
  document.getElementById("title").value = "";
  if (document.getElementById("category")) {
    document.getElementById("category").value = "";
  }
  document.getElementById("content").value = "";
  const uploadElem = document.getElementById("upload");
  if (uploadElem) {
    uploadElem.value = "";
  }
  
  // Reset preview if exists
  const preview = document.getElementById("preview");
  if (preview) {
    preview.style.display = "none";
    preview.src = "";
  }
}

// Hàm chuyển đổi file ảnh thành base64
function convertImageToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

function addArticle() {
  const title = document.getElementById("title").value;
  const categorySelect = document.getElementById("category");
  const category = categorySelect.value;
  const content = document.getElementById("content").value;
  const statusRadios = document.querySelectorAll('input[name="status"]');
  let status = "Public"; // Default status
  
  // Lấy giá trị status được chọn
  for (const radio of statusRadios) {
    if (radio.checked) {
      status = radio.value;
      break;
    }
  }
  
  // Kiểm tra dữ liệu đầu vào bằng modal thay vì alert
  if (!title || !category || !content) {
    showValidationModal("Vui lòng điền đầy đủ thông tin bài viết!");
    return;
  }
  
  // Tạo ID mới bằng cách lấy ID lớn nhất hiện tại + 1
  const newId = articles.length > 0 ? Math.max(...articles.map(article => article.id)) + 1 : 1;
  
  // Xử lý ảnh
  const imageInput = document.getElementById("upload");
  if (imageInput && imageInput.files && imageInput.files[0]) {
    convertImageToBase64(imageInput.files[0], function(base64Image) {
      // Thêm bài viết với ảnh base64
      addArticleWithImage(newId, title, category, content, status, base64Image);
    });
  } else {
    // Thêm bài viết với ảnh mặc định
    addArticleWithImage(newId, title, category, content, status, "../assets/imgs/default.png");
  }
}

function addArticleWithImage(id, title, category, content, status, img) {
  // Thêm bài viết mới vào mảng
  articles.push({
    id: id,
    title: title,
    category: category,
    content: content,
    status: status,
    img: img
  });
  
  // Lưu vào localStorage
  saveArticlesToStorage();
  
  // Đóng modal và hiển thị lại bảng
  closeAddModal();
  renderArticleTable();
  
  // Thông báo thêm thành công bằng modal
  showValidationModal("Thêm bài viết thành công!");
}

// Hàm xử lý modal sửa bài viết
function openEditModal(id) {
  const article = articles.find(article => article.id === id);
  if (!article) return;
  
  currentEditId = id;
  
  document.getElementById("editTitle").value = article.title;
  document.getElementById("editCategory").value = article.category;
  document.getElementById("editContent").value = article.content;
  
  const modal = document.getElementById("editModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  currentEditId = null;
}

function saveEdit() {
  if (currentEditId === null) return;
  
  const title = document.getElementById("editTitle").value;
  const category = document.getElementById("editCategory").value;
  const content = document.getElementById("editContent").value;
  
  if (!title || !category || !content) {
    showValidationModal("Vui lòng điền đầy đủ thông tin bài viết!");
    return;
  }
  
  const articleIndex = articles.findIndex(article => article.id === currentEditId);
  if (articleIndex !== -1) {
    articles[articleIndex].title = title;
    articles[articleIndex].category = category;
    articles[articleIndex].content = content;
    
    // Lưu thay đổi vào localStorage
    saveArticlesToStorage();
  }
  
  closeEditModal();
  renderArticleTable();
  
  // Thông báo cập nhật thành công
  showValidationModal("Cập nhật bài viết thành công!");
}

// Hàm xử lý modal xóa bài viết
function openDeleteModal(id) {
  deleteId = id;
  
  const modal = document.getElementById("deleteModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  deleteId = null;
}

function confirmDelete() {
  if (deleteId === null) return;
  
  const articleIndex = articles.findIndex(article => article.id === deleteId);
  if (articleIndex !== -1) {
    articles.splice(articleIndex, 1);
    
    // Lưu thay đổi vào localStorage
    saveArticlesToStorage();
  }
  
  closeDeleteModal();
  renderArticleTable();
  
  // Thông báo xóa thành công
  showValidationModal("Xóa bài viết thành công!");
}

// Thêm hàm để hiển thị ảnh preview khi upload
// document.addEventListener("DOMContentLoaded", function() {
//   const uploadInput = document.getElementById("upload");
  
//   if (uploadInput) {
//     uploadInput.addEventListener("change", function() {
//       const file = this.files[0];
//       if (file) {
//         const preview = document.getElementById("preview");
//         if (!preview) {
//           // Tạo phần tử preview nếu chưa có
//           const newPreview = document.createElement("img");
//           newPreview.id = "preview";
//           newPreview.style.maxWidth = "100%";
//           newPreview.style.height = "auto";
//           newPreview.style.marginTop = "10px";
          
//           // Thêm vào sau input file
//           this.parentNode.insertBefore(newPreview, this.nextSibling);
//         }
        
//         // Hiển thị ảnh preview
//         const reader = new FileReader();
//         reader.onload = function(e) {
//           const preview = document.getElementById("preview");
//           preview.src = e.target.result;
//           preview.style.display = "block";
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   }
// });