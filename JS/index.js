document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("loggedIn");
  
    const authButtons = document.querySelector(".auth-buttons");
    const userMenu = document.querySelector(".nav-right");
  
    if (isLoggedIn === "true") {
      authButtons.style.display = "none";
      userMenu.style.display = "flex";
    } else {
      authButtons.style.display = "flex";
      userMenu.style.display = "none";
    }
  
    // Ẩn dropdown khi click ra ngoài
    document.addEventListener("click", function (event) {
      const dropdown = document.getElementById("dropdown");
      const avatar = document.querySelector(".avatar-wrapper");
  
      if (!dropdown.contains(event.target) && !avatar.contains(event.target)) {
        dropdown.classList.add("hidden");
      }
    });
  });
  
  // Toggle dropdown
  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("hidden");
  }
  
  // Logout
  function logout() {
    localStorage.setItem("loggedIn", "false");
    location.reload();
  }
  


  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("articleModal");

  openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Ấn ngoài để đóng modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });


  const articles = [
    {
      date: "2025-02-25",
      title: "A Productive Day at Work",
      desc: "Today was a really productive day at work...",
      tag: "Daily Journal",
      tagClass: "journal",
      img: "../assets/imgs/article1.png"
    },
    {
      date: "2025-02-24",
      title: "My First Job Interview Experience",
      desc: "I had my first job interview today...",
      tag: "Work & Career",
      tagClass: "work",
      img: "../assets/imgs/article2.png"
    },
    {
        date: "2025-02-25",
        title: "A Productive Day at Work",
        desc: "Today was a really productive day at work...",
        tag: "Daily Journal",
        tagClass: "journal",
        img: "../assets/imgs/article1.png"
      },
  ];
  
  const container = document.querySelector(".blog-grid");
  articles.forEach(article => {
    container.innerHTML += `
      <div class="blog-card">
        <img src="${article.img}" />
        <div class="card-content">
          <p class="date">Date: ${article.date}</p>
          <div class="card-header">
            <h3>${article.title}</h3>
            <span class="arrow">↗</span>
          </div>
          <p class="desc">${article.desc}</p>
          <span class="tag ${article.tagClass}">${article.tag}</span>
        </div>
      </div>
    `;
  });
  
  document.querySelectorAll(".blog-card").forEach(card => {
    card.addEventListener("click", () => {
      const modal = document.getElementById("postDetailModal");
      const title = card.getAttribute("data-title") || "Bài viết";
      const content = card.getAttribute("data-content") || "Không có nội dung.";
      const avatar = card.getAttribute("data-avatar") || "user-avatar.jpg";
      const likes = card.getAttribute("data-likes") || "0";
      const replies = card.getAttribute("data-replies") || "0";
      const comments = JSON.parse(card.getAttribute("data-comments") || "[]");

      document.getElementById("modalTitle").textContent = title;
      document.getElementById("modalContent").textContent = content;
      document.getElementById("modalAvatar").src = avatar;
      document.getElementById("modalLikes").textContent = `${likes} Likes`;
      document.getElementById("modalReplies").textContent = `${replies} Replies`;

      const commentContainer = document.getElementById("modalComments");
      commentContainer.innerHTML = "";
      comments.forEach(c => {
        commentContainer.innerHTML += `
          <div class="comment">
            <img src="${c.avatar}" alt="user" class="comment-avatar" />
            <div class="comment-box">
              <p class="comment-text">${c.text}</p>
              <div class="comment-actions">
                <span>${c.likes || 0} Like</span>
                <span>${c.replies || 0} Replies</span>
              </div>
            </div>
          </div>`;
      });

      modal.classList.remove("hidden");
    });
  });

  document.getElementById("closeDetailModal").addEventListener("click", () => {
    document.getElementById("postDetailModal").classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("postDetailModal");
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });


  function toggleUserDropdown() {
    document.getElementById("userDropdown").classList.toggle("hidden");
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    let current = 0;
  
    function showItem(index) {
      items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
    }
  
    function startCarousel() {
      setInterval(() => {
        current = (current + 1) % items.length;
        showItem(current);
      }, 3000);
    }
  
    if (items.length > 0) {
      showItem(current);
      startCarousel();
    }
  });
  