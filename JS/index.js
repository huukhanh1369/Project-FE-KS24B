// Global variables
let articles = [];
let filteredArticles = [];
let currentCategory = "All blog posts";

// DOM Elements
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("articleModal");
const categoryNav = document.querySelector(".categories");

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
  // Check login status
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "./Pages/login.html";
  }

  // Load and display articles
  loadArticlesFromStorage();
  
  // Initialize category navigation
  initCategoryNavigation();

  // Setup modal events
  setupModalEvents();
  
  // Setup user dropdown
  setupUserDropdown();
  
  // Add event listener for logout
  setupLogout();
  
  // Add event listener for new article form submission
  setupArticleForm();
  
  // Setup blog card click events
  addCardClickEvents();
  
  // Setup file upload handler
  setupFileUpload();
});

// Initialize category navigation
function initCategoryNavigation() {
  if (categoryNav) {
    // Get all unique categories from articles
    const categories = ["All blog posts", ...new Set(articles.map(article => 
      article.category || article.tag))];
    
    // Clear existing category elements
    categoryNav.innerHTML = '';
    
    // Create category elements
    categories.forEach(category => {
      const span = document.createElement("span");
      span.textContent = category;
      if (category === currentCategory) {
        span.classList.add("active");
      }
      span.addEventListener("click", () => {
        filterArticlesByCategory(category);
        
        // Update active class
        document.querySelectorAll(".categories span").forEach(el => {
          el.classList.remove("active");
        });
        span.classList.add("active");
      });
      categoryNav.appendChild(span);
    });
  }
}

// Setup file upload handler 
function setupFileUpload() {
  const fileUpload = document.getElementById("fileUpload");
  const imagePreview = document.getElementById("imagePreview");
  
  if (fileUpload) {
    fileUpload.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check if the file is an image
      if (!file.type.match('image.*')) {
        alert("Please select an image file");
        return;
      }
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = function(e) {
        // Display the image preview
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Selected image" class="preview-img">`;
        imagePreview.classList.remove("hidden");
      };
      
      // Read the image file as a data URL
      reader.readAsDataURL(file);
    });
  }
}

// Filter articles by category
function filterArticlesByCategory(category) {
  currentCategory = category;
  
  if (category === "All blog posts") {
    filteredArticles = [...articles];
  } else {
    filteredArticles = articles.filter(article => 
      (article.category === category || article.tag === category)
    );
  }
  
  displayArticles();
}

// Load articles from localStorage
function loadArticlesFromStorage() {
  const storedArticles = localStorage.getItem("articles");
  if (storedArticles) {
    // Filter only public articles
    articles = JSON.parse(storedArticles).filter(article => 
      article.status === "Public" || article.status === "public"
    );
  } else {
    // Default data if none exists
    articles = [
      {
        id: 1,
        date: "2025-02-25",
        title: "A Productive Day at Work",
        desc: "Today was a really productive day at work...",
        content: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
        tag: "Daily Journal",
        category: "Daily Journal",
        tagClass: "journal",
        img: "../assets/imgs/article1.png",
        status: "Public"
      },
      {
        id: 2,
        date: "2025-02-24",
        title: "My First Job Interview Experience",
        desc: "I had my first job interview today...",
        content: "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident.",
        tag: "Work & Career",
        category: "Work & Career",
        tagClass: "work",
        img: "../assets/imgs/article2.png",
        status: "Public"
      },
      {
        id: 3,
        date: "2025-02-23",
        title: "Overthinking Everything",
        desc: "Lately, I have been overthinking everything...",
        content: "Lately, I have been overthinking everything, from small decisions to bigger life choices. I know I should trust myself.",
        tag: "Personal Thoughts",
        category: "Personal Thoughts",
        tagClass: "thoughts",
        img: "../assets/imgs/article3.png",
        status: "Public"
      }
    ];
    
    // Save default articles to localStorage
    saveArticlesToStorage();
  }
  
  // Initialize filtered articles
  filteredArticles = [...articles];
  
  // Display articles
  displayArticles();
}

// Save articles to localStorage
function saveArticlesToStorage() {
  // Get all existing articles (including private ones)
  const existingData = localStorage.getItem("articles");
  let allArticles = [];
  
  if (existingData) {
    allArticles = JSON.parse(existingData);
    
    // Replace public articles with our current list
    const privateArticles = allArticles.filter(article => 
      article.status === "Private" || article.status === "private"
    );
    
    allArticles = [...privateArticles, ...articles];
  } else {
    allArticles = [...articles];
  }
  
  localStorage.setItem("articles", JSON.stringify(allArticles));
}

// Get CSS class for tag display
function getCategoryClass(category) {
  if (!category) return "journal";
  
  // Category to CSS class mapping
  const categoryMap = {
    "Daily Journal": "journal",
    "Work": "work",
    "Work & Career": "work",
    "Personal Thoughts": "thoughts",
    "Emotions & Feelings": "emotions",
    "Travel": "travel",
    "Nhật ký học tập": "journal",
    "Nhật ký mục tiêu và kế hoạch": "journal",
    "Nhật ký trải nghiệm - học qua đời sống": "journal"
  };
  
  return categoryMap[category] || "journal";
}

// Format date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Display articles on the grid
function displayArticles() {
  const container = document.querySelector(".blog-grid");
  if (!container) return;
  
  // Clear current articles
  container.innerHTML = "";
  
  // Sort articles by date (newest first)
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    return b.id - a.id;
  });
  
  // Show message if no articles in selected category
  if (sortedArticles.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-category";
    emptyMessage.innerHTML = `
      <p>No articles found in "${currentCategory}" category.</p>
    `;
    container.appendChild(emptyMessage);
    
    // Also update recent posts section
    updateRecentPosts(articles); // Show all articles in recent posts
    return;
  }
  
  // Add each article to the grid
  sortedArticles.forEach(article => {
    // Create DOM element for each article
    const articleElement = document.createElement("div");
    articleElement.className = "blog-card";
    articleElement.setAttribute("data-id", article.id);
    articleElement.setAttribute("data-title", article.title);
    articleElement.setAttribute("data-content", article.content || article.desc);
    articleElement.setAttribute("data-avatar", "../assets/imgs/Avatar.png");
    articleElement.setAttribute("data-likes", Math.floor(Math.random() * 20));
    articleElement.setAttribute("data-replies", Math.floor(Math.random() * 10));
    articleElement.setAttribute("data-comments", JSON.stringify([
      {"avatar":"../assets/imgs/Avatar1.png", "text":"Great post!", "likes": Math.floor(Math.random() * 10), "replies": Math.floor(Math.random() * 5)},
      {"avatar":"../assets/imgs/Avatar2.png", "text":"Thanks for sharing!", "likes": Math.floor(Math.random() * 8), "replies": Math.floor(Math.random() * 3)}
    ]));
    
    // Determine tag class
    const tagClass = getCategoryClass(article.category || article.tag);
    
    // Create HTML for the article card
    articleElement.innerHTML = `
      <img src="${article.img}" alt="Article Image" />
      <div class="card-content">
        <p class="date">Date: ${article.date || formatDate(new Date())}</p>
        <div class="card-header">
          <h3>${article.title}</h3>
          <span class="arrow">↗</span>
        </div>
        <p class="desc">${article.desc || article.content.substring(0, 100)}${article.content.length > 100 ? '...' : ''}</p>
        <span class="tag ${tagClass}">${article.category || article.tag}</span>
      </div>
    `;
    
    container.appendChild(articleElement);
  });
  
  // Update recent posts section with filtered articles if at least 3 articles
  if (sortedArticles.length >= 3) {
    updateRecentPosts(sortedArticles);
  } else {
    // If not enough articles in the category, use all articles for recent posts
    updateRecentPosts(articles);
  }
  
  // Reattach click events
  addCardClickEvents();
}

// Update recent posts section
function updateRecentPosts(articlesList) {
  const recentLayout = document.querySelector(".recent-layout");
  if (!recentLayout || articlesList.length === 0) return;
  
  // Sort articles by date (newest first)
  const sortedArticles = [...articlesList].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    return b.id - a.id;
  });
  
  // Get the featured article (newest)
  const featuredArticle = sortedArticles[0];
  // Get side articles (next two newest)
  const sideArticles = sortedArticles.slice(1, 3);
  
  // Create HTML for the recent layout
  let html = `
    <div class="featured-post">
      <img src="${featuredArticle.img}" alt="Main Article" />
      <div class="post-info">
        <p class="date">Date: ${featuredArticle.date || formatDate(new Date())}</p>
        <h3>${featuredArticle.title}</h3>
        <p class="desc">
          ${featuredArticle.content || featuredArticle.desc}
        </p>
        <span class="tag ${getCategoryClass(featuredArticle.category || featuredArticle.tag)}">${featuredArticle.category || featuredArticle.tag}</span>
      </div>
    </div>
    
    <div class="side-posts">
  `;
  
  // Add side articles
  sideArticles.forEach(article => {
    html += `
      <div class="small-post">
        <img src="${article.img}" alt="Article" />
        <div class="post-info">
          <p class="date">Date: ${article.date || formatDate(new Date())}</p>
          <h4>${article.title}</h4>
          <p class="desc">${article.desc || article.content.substring(0, 100)}${article.content.length > 100 ? '...' : ''}</p>
          <span class="tag ${getCategoryClass(article.category || article.tag)}">${article.category || article.tag}</span>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  
  recentLayout.innerHTML = html;
}

// Setup modal events
function setupModalEvents() {
  // Open modal button
  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      
      // Load categories into select dropdown
      loadCategoriesIntoModal();
    });
  }
  
  // Close modal button
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
    
    // Also handle post detail modal
    const postDetailModal = document.getElementById("postDetailModal");
    if (event.target === postDetailModal) {
      postDetailModal.classList.add("hidden");
    }
  });
  
  // Close post detail modal button
  const closeDetailModal = document.getElementById("closeDetailModal");
  if (closeDetailModal) {
    closeDetailModal.addEventListener("click", () => {
      document.getElementById("postDetailModal").classList.add("hidden");
    });
  }
}

// Load categories into modal dropdown
function loadCategoriesIntoModal() {
  const categorySelect = document.getElementById("category");
  if (!categorySelect) return;
  
  // Clear current options
  categorySelect.innerHTML = "";
  
  // Get categories from localStorage or use default
  let categories = [];
  const storedCategories = localStorage.getItem("entryCategories");
  
  if (storedCategories) {
    categories = JSON.parse(storedCategories).map(cat => cat.name);
  } else {
    // Default categories if none exist
    categories = [
      "Daily Journal", 
      "Work & Career", 
      "Personal Thoughts", 
      "Emotions & Feelings",
      "Travel"
    ];
  }
  
  // Add categories to select
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Setup user dropdown
function setupUserDropdown() {
  const avatar = document.querySelector(".avatar");
  if (avatar) {
    avatar.addEventListener("click", () => {
      document.getElementById("userDropdown").classList.toggle("hidden");
    });
  }
  
  // Close dropdown when clicking outside
  document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("userDropdown");
    const avatar = document.querySelector(".avatar");
    
    if (dropdown && avatar && !dropdown.contains(event.target) && !avatar.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

// Setup logout button
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      localStorage.removeItem("loggedIn");
      window.location.href = "./Pages/login.html";
    });
  }
}

// Setup article form submission
function setupArticleForm() {
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", addNewArticle);
  }
}

// Add new article from form
function addNewArticle() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value;
  const mood = document.getElementById("mood").value;
  
  // Validate required fields
  if (!title || !content) {
    alert("Please fill in both title and content!");
    return;
  }
  
  // Get status (public/private)
  const statusRadios = document.querySelectorAll('input[name="status"]');
  let status = "Public"; // Default is public
  for (const radio of statusRadios) {
    if (radio.checked) {
      status = radio.value;
      break;
    }
  }
  
  // Handle image upload
  let imgSrc = "../assets/imgs/article1.png"; // Default image
  const imagePreview = document.getElementById("imagePreview");
  
  // Check if a custom image was uploaded
  if (imagePreview && !imagePreview.classList.contains("hidden") && imagePreview.querySelector("img")) {
    imgSrc = imagePreview.querySelector("img").src;
  }
  
  // Create new article
  const newArticle = {
    id: Date.now(), // Use timestamp as ID
    title: title,
    category: category || "Daily Journal",
    content: content,
    desc: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
    date: formatDate(new Date()),
    img: imgSrc,
    status: status,
    mood: mood
  };
  
  // Get current articles from localStorage
  let allArticles = [];
  const storedArticles = localStorage.getItem("articles");
  if (storedArticles) {
    allArticles = JSON.parse(storedArticles);
  }
  
  // Add new article to list
  allArticles.push(newArticle);
  
  // Save to localStorage
  localStorage.setItem("articles", JSON.stringify(allArticles));
  
  // Close modal
  modal.classList.add("hidden");
  
  // If status is public, add to our displayed articles and refresh
  if (status === "Public" || status === "public") {
    articles.push(newArticle);
    
    // If the article matches current category filter, add it to filtered articles
    if (currentCategory === "All blog posts" || 
        currentCategory === newArticle.category) {
      filteredArticles.push(newArticle);
    }
    
    // Refresh display
    displayArticles();
  }
  
  // Reset form
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  if (document.getElementById("category")) {
    document.getElementById("category").selectedIndex = 0;
  }
  
  // Reset image preview
  if (imagePreview) {
    imagePreview.innerHTML = "";
    imagePreview.classList.add("hidden");
  }
  
  // Reset file input
  const fileInput = document.getElementById("fileUpload");
  if (fileInput) {
    fileInput.value = "";
  }
}

// Add click events to blog cards
function addCardClickEvents() {
  document.querySelectorAll(".blog-card").forEach(card => {
    card.addEventListener("click", () => {
      const modal = document.getElementById("postDetailModal");
      if (!modal) return;
      
      const title = card.getAttribute("data-title") || "Article";
      const content = card.getAttribute("data-content") || "No content available.";
      const avatar = card.getAttribute("data-avatar") || "../assets/imgs/Avatar.png";
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
}