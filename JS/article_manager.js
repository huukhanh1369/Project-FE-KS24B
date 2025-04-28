const articles = [
    {
      id: 1,
      image: "../assets/imgs/article1.png",
      title: "A Productive Day",
      category: "Daily Journal",
      content: "Finished a report ahead of schedule.",
      status: "Public"
    },
    {
      id: 2,
      image: "../assets/imgs/article2.png",
      title: "Job Interview",
      category: "Work & Career",
      content: "Gained confidence during my interview.",
      status: "Private"
    }
  ];
  
  let editArticleId = null;
  
  function renderArticles() {
    const table = document.getElementById("articleTable");
    table.innerHTML = articles.map(article => `
      <tr>
        <td><img src="${article.image}" alt="Image" class="article-image" /></td>
        <td>${article.title}</td>
        <td>${article.category}</td>
        <td>${article.content}</td>
        <td>${article.status}</td>
        <td>
          <select onchange="changeStatus(${article.id}, this.value)">
            <option value="Public" ${article.status === "Public" ? "selected" : ""}>Public</option>
            <option value="Private" ${article.status === "Private" ? "selected" : ""}>Private</option>
          </select>
        </td>
        <td>
          <button class="action-btn edit" onclick="openEditModal(${article.id})">Sửa</button>
          <button class="action-btn delete" onclick="openDeleteModal(${article.id})">Xóa</button>
        </td>
      </tr>
    `).join("");
  }
  
  function openEditModal(id) {
    const article = articles.find(a => a.id === id);
    document.getElementById("editTitle").value = article.title;
    document.getElementById("editCategory").value = article.category;
    document.getElementById("editContent").value = article.content;
    editArticleId = id;
    document.getElementById("editModal").classList.remove("hidden");
  }
  
  function saveEdit() {
    const title = document.getElementById("editTitle").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const content = document.getElementById("editContent").value.trim();
    const article = articles.find(a => a.id === editArticleId);
  
    if (article) {
      article.title = title;
      article.category = category;
      article.content = content;
      renderArticles();
      closeEditModal();
    }
  }
  
  function closeEditModal() {
    document.getElementById("editModal").classList.add("hidden");
  }
  
  let deleteArticleId = null;
  
  function openDeleteModal(id) {
    deleteArticleId = id;
    document.getElementById("deleteModal").classList.remove("hidden");
  }
  
  function confirmDelete() {
    const index = articles.findIndex(a => a.id === deleteArticleId);
    if (index !== -1) {
      articles.splice(index, 1);
      renderArticles();
    }
    closeDeleteModal();
  }
  
  function closeDeleteModal() {
    document.getElementById("deleteModal").classList.add("hidden");
  }
  
  function changeStatus(id, newStatus) {
    const article = articles.find(a => a.id === id);
    if (article) {
      article.status = newStatus;
      renderArticles();
    }
  }
  
  function openAddModal() {
    alert("Chức năng thêm mới chưa được phát triển.");
  }
  
  // Initialize
  renderArticles();
  