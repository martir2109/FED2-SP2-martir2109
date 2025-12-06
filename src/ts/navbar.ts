/**
 * Generates the HTML for the navbar for logged in users.
 *
 * @returns {string} HTML content as a string.
 */
function createNavbarLoggedIn(): string {
  return `
          <nav class="topnav overflow-hidden bg-white fixed top-0 w-full z-1000 p-0 border-b border-light-grey items-center flex h-16">
          <a href="/index.html">
            <div class="shrink-0 absolute ml-2.5 left-0 py-2.5 px-0.5 top-0">
              <img src="/assets/logo/logo-with-text-without-background.png" alt="Auction House" class="h-10">
            </div>
            </a>
            
            <button class="icon" onclick="toggleMobileMenu()" aria-label="Open and close navigation menu">
              <div class="container">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
              </div>
            </button>
            
            <div class="nav-links flex cursor-pointer ml-auto">  
              <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
              <span class="nav-text">Home</span>
              </a>
            
              <a href="/profile/index.html"><i class="bi bi-person" title="Profile"></i>
              <span class="nav-text">Profile</span>
              </a>
           
              <a href="javascript:void(0);" id="logout-link" onclick="logout()">
              <i class="bi bi-box-arrow-right" title="Log out"></i>
              <span id="logout-text" class="nav-text">Log out</span>
              </a>
            </div>
          </nav>
        `;
}

/**
 * Generates the HTML for the navbar for logged out users.
 *
 * @returns {string} HTML content as a string.
 */
function createNavBarLoggedOut(): string {
  return `
          <nav class="topnav overflow-hidden bg-white fixed top-0 w-full z-1000 p-0 border-b border-light-grey items-center flex h-16">
          <a href="/index.html">
            <div class="shrink-0 absolute ml-2.5 left-0 py-2.5 px-0.5 top-0">
              <img src="/assets/logo/logo-with-text-without-background.png" alt="Auction House" class="h-10">
            </div>
            </a>
            
            <button class="icon" onclick="toggleMobileMenu()" aria-label="Open and close navigation menu">
              <div class="container">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
              </div>
            </button>
            
            <div class="nav-links flex cursor-pointer ml-auto">  
              <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
              <span class="nav-text">Home</span>
              </a>
              <a href="/auth/login/index.html"><i class="bi bi-person" title="Profile"></i> 
              <span class="nav-text">Log in or Register</span>
              </a>
            </div>
          </nav>
        `;
}

/**
 * Log out the current user by removing user credentials from localStorage.
 * Redirects to the home page after logout.
 */
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  window.location.href = "/index.html";
}

/**
 * Initializes the navbar once the DOm is fully loaded.
 * Checks if the user is logged in or not by looking for accessToken in localStorage.
 * Puts the correct HTML into the navbar-container element.
 * Sets active class on the link that matches the current page URL to indicate the active page.
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("navbar-container");

  if (container) {
    const isLoggedIn = localStorage.getItem("accessToken") !== null;

    container.innerHTML = isLoggedIn
      ? createNavbarLoggedIn()
      : createNavBarLoggedOut();

    const links: NodeListOf<HTMLAnchorElement> =
      container.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  }
});

/**
 * Toggle the mobile menu open/closed by switching CSS classes.
 */
function toggleMobileMenu() {
  const nav = document.querySelector(".topnav");
  const hamburger = document.querySelector(".container");

  if (nav && hamburger) {
    nav.classList.toggle("responsive");
    hamburger.classList.toggle("change");
  }
}

window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;
