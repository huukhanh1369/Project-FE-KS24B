// Global variables
let articles = [];
let filteredArticles = [];
let currentCategory = "All blog posts";
let currentUser = null;

// DOM Elements
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("articleModal");
const categoryNav = document.querySelector(".categories");

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Check login status
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "./Pages/login.html";
  }

  // Load user profile
  loadUserProfile();

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

// Load user profile from localStorage - UPDATED FUNCTION
function loadUserProfile() {
  const loggedInEmail = localStorage.getItem("currentUserEmail");
  if (!loggedInEmail) {
    currentUser = {
      firstname: "Rikkei",
      lastname: "",
      email: "rikkei@gmail.com",
      avatar: "../assets/imgs/Avatar.png",
      isBlocked: false,
      role: "user"
    };
  } else {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const user = users.find(u => u.email === loggedInEmail) || admins.find(a => a.email === loggedInEmail);

    if (user) {
      currentUser = {
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email,
        avatar: user.avatar,
        isBlocked: user.isBlocked || false,
        role: user.role || "user"
      };
    } else {
      currentUser = {
        firstname: "Rikkei",
        lastname: "",
        email: "rikkei@gmail.com",
        avatar: "../assets/imgs/Avatar.png",
        isBlocked: false,
        role: "user"
      };
    }
  }

  // Cập nhật localStorage với cấu trúc mới
  localStorage.setItem("userData", JSON.stringify({
    firstname: currentUser.firstname,
    lastname: currentUser.lastname,
    email: currentUser.email,
    avatar: currentUser.avatar,
    isBlocked: currentUser.isBlocked,
    role: currentUser.role
  }));

  // Update header avatar and dropdown content with user data
  updateUserMenuDisplay();
}

// Update user menu display with current user data
function updateUserMenuDisplay() {
  const headerAvatar = document.querySelector(".avatar");
  if (headerAvatar) {
    headerAvatar.src = currentUser.avatar;
  }

  const dropdownAvatar = document.querySelector(".dropdown-avatar");
  const dropdownName = document.querySelector(".profile-info strong");
  const dropdownEmail = document.querySelector(".profile-info p");

  if (dropdownAvatar) dropdownAvatar.src = currentUser.avatar;
  if (dropdownName) dropdownName.textContent = `${currentUser.firstname} ${currentUser.lastname}`.trim();
  if (dropdownEmail) dropdownEmail.textContent = currentUser.email;
}

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
    fileUpload.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;

      // Check if the file is an image
      if (!file.type.match('image.*')) {
        alert("Please select an image file");
        return;
      }

      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = function (e) {
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
        status: "Public",
        author: { firstname: "John", lastname: "Doe", avatar: "../assets/imgs/Avatar1.png" }
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
        status: "Public",
        author: { firstname: "Jane", lastname: "Smith", avatar: "../assets/imgs/Avatar2.png" }
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
        status: "Public",
        author: { firstname: "Alex", lastname: "Brown", avatar: "../assets/imgs/Avatar.png" }
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
    articleElement.setAttribute("data-avatar", article.author.avatar); // Use article author avatar
    articleElement.setAttribute("data-img", article.img); // Store article image
    articleElement.setAttribute("data-author", `${article.author.firstname} ${article.author.lastname}`.trim()); // Store author name
    articleElement.setAttribute("data-likes", Math.floor(Math.random() * 20));
    articleElement.setAttribute("data-replies", Math.floor(Math.random() * 10));
    articleElement.setAttribute("data-comments", JSON.stringify([
      { "avatar": "../assets/imgs/Avatar1.png", "text": "Great post!", "likes": Math.floor(Math.random() * 10), "replies": Math.floor(Math.random() * 5) },
      { "avatar": "../assets/imgs/Avatar2.png", "text": "Thanks for sharing!", "likes": Math.floor(Math.random() * 8), "replies": Math.floor(Math.random() * 3) }
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
      if (currentUser.isBlocked) {
        alert("You are blocked from posting articles.");
        return;
      }
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
  document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("userDropdown");
    const avatar = document.querySelector(".avatar");

    if (dropdown && avatar && !dropdown.contains(event.target) && !avatar.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // Add event listener for "View profile" option
  const viewProfileLink = document.querySelector("#userDropdown li:first-child a");
  if (viewProfileLink) {
    viewProfileLink.addEventListener("click", function (e) {
      e.preventDefault();
      openProfileModal();
    });
  }

  // Add event listener for "Update profile picture" option
  const updatePictureLink = document.querySelector("#userDropdown li:nth-child(2) a");
  if (updatePictureLink) {
    updatePictureLink.addEventListener("click", function (e) {
      e.preventDefault();
      openUpdatePictureModal();
    });
  }
}

// Open profile modal
function openProfileModal() {
  // Check if profile modal exists, if not create it
  let profileModal = document.getElementById("profileModal");

  if (!profileModal) {
    // Create the modal
    profileModal = document.createElement("div");
    profileModal.id = "profileModal";
    profileModal.className = "modal hidden";

    profileModal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" id="closeProfileModal">×</span>
        <h2>User Profile</h2>
        
        <div class="profile-view">
          <div class="profile-header">
            <img src="${currentUser.avatar}" alt="User Avatar" class="profile-avatar">
            <div class="profile-info-large">
              <h3>${currentUser.firstname} ${currentUser.lastname}</h3>
              <p>${currentUser.email}</p>
            </div>
          </div>
          
          <div class="profile-fields">
            <div class="profile-field">
              <label for="updateName">Name:</label>
              <input type="text" id="updateName" value="${currentUser.firstname} ${currentUser.lastname}">
            </div>
            
            <div class="profile-field">
              <label for="updateEmail">Email:</label>
              <input type="email" id="updateEmail" value="${currentUser.email}" readonly>
            </div>
            
            <button id="saveProfileBtn" class="submit-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(profileModal);

    // Add event listeners
    document.getElementById("closeProfileModal").addEventListener("click", () => {
      profileModal.classList.add("hidden");
    });

    document.getElementById("saveProfileBtn").addEventListener("click", () => {
      // Get updated values
      const updatedName = document.getElementById("updateName").value;

      if (!updatedName) {
        alert("Name cannot be empty");
        return;
      }

      // Update current user
      const nameParts = updatedName.split(" ");
      const lastName = nameParts.pop();
      const firstName = nameParts.join(" ");
      currentUser.firstname = firstName || updatedName;
      currentUser.lastname = lastName || "";

      // Save to userData in localStorage
      localStorage.setItem("userData", JSON.stringify(currentUser));

      // Also update in users array if the user exists there
      const loggedInEmail = currentUser.email;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(u => u.email === loggedInEmail);

      if (userIndex !== -1) {
        users[userIndex].firstname = firstName || updatedName;
        users[userIndex].lastname = lastName || "";
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Update display
      updateUserMenuDisplay();

      // Close modal
      profileModal.classList.add("hidden");

      // Show success message
      alert("Profile updated successfully!");
    });

    // Close when clicking outside
    profileModal.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        profileModal.classList.add("hidden");
      }
    });
  }

  // Show modal
  profileModal.classList.remove("hidden");
}

// Open update picture modal
function openUpdatePictureModal() {
  // Check if update picture modal exists, if not create it
  let pictureModal = document.getElementById("updatePictureModal");

  if (!pictureModal) {
    // Create the modal
    pictureModal = document.createElement("div");
    pictureModal.id = "updatePictureModal";
    pictureModal.className = "modal hidden";

    pictureModal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn" id="closePictureModal">×</span>
        <h2>Update Profile Picture</h2>
        
        <div class="profile-picture-options">
          <div class="current-picture">
            <h4>Current Picture</h4>
            <img src="${currentUser.avatar}" alt="Current Avatar" class="preview-current-avatar">
          </div>
          
          <div class="upload-section">
            <label for="profilePictureUpload" class="upload-label">
              <i class="fa-solid fa-upload"></i> Browse and choose an image
            </label>
            <input type="file" id="profilePictureUpload" accept="image/*" style="display: none;">
            <div id="profileImagePreview" class="image-preview hidden"></div>
          </div>
          
          <div class="default-avatars">
            <h4>Or select from defaults</h4>
            <div class="avatar-grid">
              <img src="../assets/imgs/Avatar.png" alt="Default Avatar 1" class="avatar-option">
              <img src="../assets/imgs/Avatar1.png" alt="Default Avatar 2" class="avatar-option">
              <img src="../assets/imgs/Avatar2.png" alt="Default Avatar 3" class="avatar-option">
            </div>
          </div>
          
          <button id="savePictureBtn" class="submit-btn" disabled>Save New Picture</button>
        </div>
      </div>
    `;

    document.body.appendChild(pictureModal);

    // Add event listeners
    document.getElementById("closePictureModal").addEventListener("click", () => {
      pictureModal.classList.add("hidden");
    });

    // File upload handling
    const profilePictureUpload = document.getElementById("profilePictureUpload");
    const profileImagePreview = document.getElementById("profileImagePreview");

    profilePictureUpload.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;

      // Check if the file is an image
      if (!file.type.match('image.*')) {
        alert("Please select an image file");
        return;
      }

      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = function (e) {
        // Display the image preview
        profileImagePreview.innerHTML = `<img src="${e.target.result}" alt="Selected image" class="preview-img">`;
        profileImagePreview.classList.remove("hidden");

        // Enable save button
        document.getElementById("savePictureBtn").disabled = false;

        // Store the data URL temporarily
        pictureModal.setAttribute("data-selected-image", e.target.result);

        // Remove selection from default avatars
        document.querySelectorAll(".avatar-option").forEach(avatar => {
          avatar.classList.remove("selected");
        });
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    });

    // Default avatar selection
    document.querySelectorAll(".avatar-option").forEach(avatar => {
      avatar.addEventListener("click", function () {
        // Remove selection from all avatars
        document.querySelectorAll(".avatar-option").forEach(av => {
          av.classList.remove("selected");
        });

        // Add selection to clicked avatar
        this.classList.add("selected");

        // Clear file upload preview
        profileImagePreview.innerHTML = "";
        profileImagePreview.classList.add("hidden");
        profilePictureUpload.value = "";

        // Store the selected avatar path
        pictureModal.setAttribute("data-selected-image", this.src);

        // Enable save button
        document.getElementById("savePictureBtn").disabled = false;
      });
    });

    // Save button handler
    document.getElementById("savePictureBtn").addEventListener("click", () => {
      const selectedImage = pictureModal.getAttribute("data-selected-image");

      if (selectedImage) {
        // Update current user avatar
        currentUser.avatar = selectedImage;

        // Save to userData in localStorage
        localStorage.setItem("userData", JSON.stringify(currentUser));

        // Also update in users array if the user exists there
        const loggedInEmail = currentUser.email;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === loggedInEmail);

        if (userIndex !== -1) {
          users[userIndex].avatar = selectedImage;
          localStorage.setItem("users", JSON.stringify(users));
        }

        // Also check admins array
        const admins = JSON.parse(localStorage.getItem("admins")) || [];
        const adminIndex = admins.findIndex(a => a.email === loggedInEmail);

        if (adminIndex !== -1) {
          admins[adminIndex].avatar = selectedImage;
          localStorage.setItem("admins", JSON.stringify(admins));
        }

        // Update display
        updateUserMenuDisplay();

        // Close modal
        pictureModal.classList.add("hidden");

        // Show success message
        alert("Profile picture updated successfully!");
      }
    });

    // Close when clicking outside
    pictureModal.addEventListener("click", (e) => {
      if (e.target === pictureModal) {
        pictureModal.classList.add("hidden");
      }
    });
  } else {
    // Update the current picture in the modal
    pictureModal.querySelector(".preview-current-avatar").src = currentUser.avatar;
  }

  // Show modal
  pictureModal.classList.remove("hidden");
}

// Setup logout button
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUserEmail");
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
  if (currentUser.isBlocked) {
    alert("You are blocked from posting articles.");
    return;
  }

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

  // Create new article with current user as author
  const newArticle = {
    id: Date.now(), // Use timestamp as ID
    title: title,
    category: category || "Daily Journal",
    content: content,
    desc: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
    date: formatDate(new Date()),
    img: imgSrc,
    status: status,
    mood: mood,
    author: {
      firstname: currentUser.firstname,
      lastname: currentUser.lastname,
      avatar: currentUser.avatar
    }
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
      const img = card.getAttribute("data-img") || "../assets/imgs/article1.png";
      const authorName = card.getAttribute("data-author") || "Unknown Author";
      const likes = card.getAttribute("data-likes") || "0";
      const replies = card.getAttribute("data-replies") || "0";
      const comments = JSON.parse(card.getAttribute("data-comments") || "[]");

      document.getElementById("postDetailModal").innerHTML = `
        <div class="modal-content post-modal">
          <span class="close-btn" id="closeDetailModal">×</span>
          <div class="post-detail">
            <div class="main-post">
              <img src="${avatar}" alt="Author Avatar" class="author-avatar" />
              <div class="post-content">
                <h2>${authorName}</h2>
                <h3 id="modalTitle">${title}</h3>
                <p id="modalContent">${content}</p>
                <img src="${img}" alt="Article Image" class="article-image" />
                <div class="post-actions">
                  <span id="modalLikes">${likes} Likes</span>
                  <span id="modalReplies">${replies} Replies</span>
                </div>
              </div>
            </div>
            <div id="modalComments">
              ${comments.map(c => `
                <div class="comment">
                  <img src="${c.avatar}" alt="user" class="comment-avatar" />
                  <div class="comment-box">
                    <p class="comment-text">${c.text}</p>
                    <div class="comment-actions">
                      <span>${c.likes || 0} Like</span>
                      <span>${c.replies || 0} Replies</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      modal.classList.remove("hidden");

      // Reattach close event
      document.getElementById("closeDetailModal").addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    });
  });
}