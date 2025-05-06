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
    img: "../assets/imgs/article1.png",
    date: "2025-02-25"
  },
  { 
    id: 2,
    title: "My First Job Interview Experience", 
    category: "Work & Career", 
    content: "I had my first job interview today...", 
    status: "Private", 
    img: "../assets/imgs/article2.png",
    date: "2025-02-24" 
  },
  { 
    id: 3,
    title: "Weekend Trip", 
    category: "Travel", 
    content: "Explored new places...", 
    status: "Public", 
    img: "../assets/imgs/article3.png",
    date: "2025-02-23" 
  },
];

// Dữ liệu mặc định cho categories từ entries_manager.js
const defaultEntryCategories = [
  { id: 1, name: "Nhật ký học tập" },
  { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
  { id: 3, name: "Nhật ký trải nghiệm - học qua đời sống" }
];

// Hàm kiểm tra xem người dùng hiện tại có phải là admin không
function isCurrentUserAdmin() {
  const loggedInEmail = localStorage.getItem("currentUserEmail");
  const admins = JSON.parse(localStorage.getItem("admins")) || [];
  return admins.some(admin => admin.email === loggedInEmail);
}

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
  
  // Hiển thị bài viết trong bảng
  renderArticleTable();
  
  // Thêm lắng nghe sự kiện cho nút add trong modal
  const addButton = document.getElementById("addArticleBtn");
  if (addButton) {
    addButton.addEventListener("click", addArticle);
  }
  
  // Thiết lập select category trong modal thêm bài
  updateCategoryDropdown();
  
  // Xử lý sự kiện click ngoài modal để đóng
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("articleModal");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    
    if (event.target === modal) {
      closeAddModal();
    }
    
    if (event.target === editModal) {
      closeEditModal();
    }
    
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
  
  // Xử lý sự kiện upload ảnh
  const uploadInput = document.getElementById("upload");
  if (uploadInput) {
    uploadInput.addEventListener("change", handleImageUpload);
  }

  // Xử lý sự kiện upload ảnh trong modal chỉnh sửa
  const editUploadInput = document.getElementById("editUpload");
  if (editUploadInput) {
    editUploadInput.addEventListener("change", handleEditImageUpload);
  }
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Kiểm tra xem có phải là file ảnh không
  if (!file.type.match('image.*')) {
    showValidationModal("Vui lòng chọn file ảnh!");
    return;
  }
  
  // Chỉ đọc file và lưu vào biến global để sử dụng sau
  const reader = new FileReader();
  reader.onload = function(e) {
    // Lưu đường dẫn ảnh vào biến global để sử dụng trong addArticle
    window.uploadedImageData = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Hàm xử lý upload ảnh trong modal chỉnh sửa
function handleEditImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Kiểm tra xem có phải là file ảnh không
  if (!file.type.match('image.*')) {
    showValidationModal("Vui lòng chọn file ảnh!");
    return;
  }
  
  // Chỉ đọc file và lưu vào biến global để sử dụng sau
  const reader = new FileReader();
  reader.onload = function(e) {
    // Lưu đường dẫn ảnh vào biến global để sử dụng trong saveEdit
    window.editUploadedImageData = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Hàm load bài viết từ localStorage
function loadArticlesFromStorage() {
  const storedArticles = localStorage.getItem("articles");
  if (storedArticles) {
    articles = JSON.parse(storedArticles);
    
    // Kiểm tra và thêm trường date nếu chưa có
    articles = articles.map(article => {
      if (!article.date) {
        article.date = formatDate(new Date());
      }
      return article;
    });
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

// Hàm cập nhật dropdown danhsome code danh mục trong modal
function updateCategoryDropdown(modalType = 'add', selectedCategory = '') {
  const categorySelect = modalType === 'add' ? document.getElementById("category") : document.getElementById("editCategory");
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

    // Nếu có selectedCategory, đặt giá trị cho dropdown
    if (selectedCategory) {
      categorySelect.value = selectedCategory;
    }
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

// Hàm render phân trang
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

// Hàm chuyển trang
function changePage(direction) {
  const pageCount = Math.ceil(articles.length / articlesPerPage);

  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next" && currentPage < pageCount) {
    currentPage++;
  }

  renderArticleTable();
}

// Hàm đi đến trang cụ thể
function goToPage(page) {
  currentPage = page;
  renderArticleTable();
}

// Định dạng ngày tháng
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    
    // Thông báo cập nhật thành công với thông tin bổ thiện
  }
}

// Hàm mở modal chỉnh sửa bài viết
function openEditModal(id) {
  const article = articles.find(a => a.id === id);
  if (!article) return;
  
  currentEditId = id;
  
  const modal = document.getElementById("editModal");
  const titleInput = document.getElementById("editTitle");
  const contentInput = document.getElementById("editContent");
  const editImagePreview = document.getElementById("editImagePreview");
  
  // Điền dữ liệu vào form
  titleInput.value = article.title;
  contentInput.value = article.content;
  if (editImagePreview) {
    editImagePreview.innerHTML = `<img src="${article.img}" alt="Current Image" class="preview-img">`;
  }
  
  // Cập nhật dropdown và đặt giá trị đã chọn
  updateCategoryDropdown('edit', article.category);
  
  modal.classList.remove("hidden");
}

// Hàm đóng modal chỉnh sửa
function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
  currentEditId = null;
  const editImagePreview = document.getElementById("editImagePreview");
  if (editImagePreview) {
    editImagePreview.innerHTML = "";
  }
  window.editUploadedImageData = null;
}

// Hàm lưu bài viết sau khi chỉnh sửa
function saveEdit() {
  if (!currentEditId) return;
  
  const titleInput = document.getElementById("editTitle");
  const categoryInput = document.getElementById("editCategory");
  const contentInput = document.getElementById("editContent");
  
  // Kiểm tra dữ liệu nhập
  if (!titleInput.value || !contentInput.value) {
    showValidationModal("Vui lòng điền đầy đủ tiêu đề và nội dung!");
    return;
  }
  
  const articleIndex = articles.findIndex(a => a.id === currentEditId);
  if (articleIndex === -1) return;
  
  // Cập nhật thông tin bài viết
  articles[articleIndex].title = titleInput.value;
  articles[articleIndex].category = categoryInput.value;
  articles[articleIndex].content = contentInput.value;
  // Cập nhật desc (trích đoạn ngắn của content)
  articles[articleIndex].desc = contentInput.value.substring(0, 100) + "...";
  
  // Cập nhật ảnh nếu có ảnh mới
  if (window.editUploadedImageData) {
    articles[articleIndex].img = window.editUploadedImageData;
  }
  
  // Lưu vào localStorage
  saveArticlesToStorage();
  
  // Cập nhật lại giao diện
  renderArticleTable();
  
  // Đóng modal
  closeEditModal();
  
  // Thông báo thành công
  showValidationModal("Cập nhật bài viết thành công!");
}

// Hàm mở modal xác nhận xóa
function openDeleteModal(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

// Hàm đóng modal xác nhận xóa
function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("hidden");
  deleteId = null;
}

// Hàm xác nhận xóa bài viết
function confirmDelete() {
  if (!deleteId) return;
  
  // Tìm và xóa bài viết theo ID
  const articleIndex = articles.findIndex(a => a.id === deleteId);
  if (articleIndex !== -1) {
    articles.splice(articleIndex, 1);
    
    // Lưu thay đổi vào localStorage
    saveArticlesToStorage();
    
    // Cập nhật lại giao diện
    renderArticleTable();
    
    // Đóng modal
    closeDeleteModal();
    
    // Thông báo thành công
    showValidationModal("Xóa bài viết thành công!");
  }
}

// Hàm thêm bài viết mới từ form trong modal
function addArticle() {
  // Kiểm tra trạng thái chặn của người dùng nếu không phải admin
  if (!isCurrentUserAdmin()) {
    const loggedInEmail = localStorage.getItem("currentUserEmail");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.email === loggedInEmail);
    if (currentUser && currentUser.isBlocked) {
      showValidationModal("Bạn bị chặn đăng bài viết.");
      return;
    }
  }

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value;
  const mood = document.getElementById("mood").value;
  
  // Kiểm tra các trường bắt buộc
  if (!title || !content) {
    showValidationModal("Vui lòng điền đầy đủ tiêu đề và nội dung!");
    return;
  }
  
  // Kiểm tra xem ảnh đã được tải lên chưa
  if (!window.uploadedImageData) {
    showValidationModal("Vui lòng tải lên một ảnh cho bài viết!");
    return;
  }
  
  // Lấy trạng thái (public/private)
  const statusRadios = document.querySelectorAll('input[name="status"]');
  let status = "Public"; // Mặc định là public
  for (const radio of statusRadios) {
    if (radio.checked) {
      status = radio.value;
      break;
    }
  }
  
  // Sử dụng ảnh đã tải lên
  let imgSrc = window.uploadedImageData;
  
  // Tạo bài viết mới
  const newArticle = {
    id: Date.now(), // Sử dụng timestamp làm ID
    title: title,
    category: category || "Daily Journal",
    content: content,
    desc: content.substring(0, 100) + "...",
    date: formatDate(new Date()),
    img: imgSrc,
    status: status,
    mood: mood
  };
  
  // Thêm vào mảng bài viết
  articles.push(newArticle);
  
  // Lưu vào localStorage
  saveArticlesToStorage();
  
  // Cập nhật lại giao diện
  renderArticleTable();
  
  // Đóng modal
  closeAddModal();
  
  // Thông báo thành công
  showValidationModal(`Thêm bài viết thành công! ${status === "Public" ? "Bài viết sẽ hiển thị trên trang chủ." : "Bài viết sẽ không hiển thị trên trang chủ."}`);
}

// Hàm hiển thị modal thông báo
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

// Hàm đóng modal thông báo
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
    updateCategoryDropdown('add');
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
  
  // Xóa dữ liệu ảnh đã tải
  window.uploadedImageData = null;
}