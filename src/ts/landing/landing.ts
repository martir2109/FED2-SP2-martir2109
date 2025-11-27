/** Utility functions for error handling, authentication and retrive user credits */
import {
  getAuthenticationCredentials,
  formatDateTime,
  retrieveUserCredits,
} from "../utils.ts";

/** API configuration (base URL, endpoints, and header builders) */
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_content,
} from "../apiConfig.ts";

/** Functions that generate landing page content for logged-in and logged-out users. */
import {
  createLoggedOutContent,
  createLoggedInContent,
} from "../landing/landingContent.ts";

/** Renders recent listings on the landing page. */
import { displayRecentListings } from "../landing/listing.ts";

/**
 * Checks if the user is logged in by verifying the presence of an accessToken
 *
 * @returns {boolean} Returns true if the user is logged in (meaning accessToeken exists), otherwise false.
 */
function isUserLoggedIn(): boolean {
  const { accessToken } = getAuthenticationCredentials();
  return accessToken !== null;
}

let currentPage = 1;
const itemsPerPage = 12;
let allListings: any[] = [];
let currentFilteredListings: any[] = [];

document.addEventListener("DOMContentLoaded", async () => {
  const landingSection = document.querySelector(".landing-page-section");
  if (!landingSection) return;

  landingSection.innerHTML = isUserLoggedIn()
    ? createLoggedInContent()
    : createLoggedOutContent();

  retrieveUserCredits();
  await loadRecentListings();

  const searchInput = document.getElementById(
    "search-title",
  ) as HTMLInputElement;
  const tagsInput = document.getElementById("filter-tags") as HTMLInputElement;

  function applyFilters() {
    let filtered = [...allListings];

    if (searchInput?.value.trim()) {
      const query = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter((listing) =>
        listing.title?.toLowerCase().includes(query),
      );
    }

    if (tagsInput?.value.trim()) {
      const inputTags = tagsInput.value
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t);

      filtered = filtered.filter((listing) =>
        listing.tags?.some((tag: string) =>
          inputTags.some((inputTag) => tag.toLowerCase().includes(inputTag)),
        ),
      );
    }

    currentFilteredListings = filtered;
    currentPage = 1;
    renderPage();
  }

  searchInput?.addEventListener("input", applyFilters);
  tagsInput?.addEventListener("input", applyFilters);

  /**
   * Loads recent listings from API and renders them.
   * Sorts listings and applies pagination.
   * Shows message if no listings are found or if an error occurs.
   *
   * @returns {promise<void>}
   */
  async function loadRecentListings(): Promise<void> {
    const listingsContainer = document.getElementById("listing-container");
    if (!listingsContainer) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}?_seller=true&_bids=true&_active=true`,
        {
          method: "GET",
          headers: API_Headers_content(),
        },
      );

      if (response.ok) {
        const listingData = await response.json();
        allListings = [...listingData.data];
      }

      if (allListings.length > 0) {
        allListings.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );

        currentFilteredListings = [...allListings];

        currentPage = 1;
        renderPage();
      } else {
        listingsContainer.innerHTML = `
          <div class="landingpage-message-container">
            <p class="landingpage-listing-message">No listings found.</p>
          </div>`;
      }
    } catch (error) {
      listingsContainer.innerHTML =
        '<p class="landingpage-listing-error">Unable to load listings</p>';
      console.error("Error loading listings:", error);
    }
  }

  /**
   * Renders the current page of listings.
   *
   * Calculates the slice of listings to show based on the current page and items per page.
   * Calls displayRecentListings.
   * Updates the pagination buttons by calling renderPagination.
   */
  function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageItems = currentFilteredListings.slice(start, end);
    displayRecentListings(pageItems);
    renderPagination(currentFilteredListings);
  }

  /**
   * Renders the pagination buttons for the listings section.
   *
   * Calculates the total number of pages based on the allListings array and itemsPerPage.
   * Generates HTML buttons for previous, next and individual page numbers.
   *
   * @returns {void} Updates the pagination buttons in the DOM, no return value.
   */
  function renderPagination(listings: any[] = allListings): void {
    const totalPages = Math.ceil(listings.length / itemsPerPage);
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    let buttons = "";

    buttons += `
      <button 
        class="px-2 py-1 md:px-4 md:py-2 rounded bg-primary text-white disabled:opacity-40 cursor-pointer"
        ${currentPage === 1 ? "disabled" : ""}
        onclick="changePage(${currentPage - 1})"
      >Previous</button>
    `;

    const maxVisible = 3;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    if (startPage > 1) {
      buttons += `<span class="px-2 py-1">…</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons += `
        <button 
          class="px-2 py-1 md:px-4 md:py-2 rounded ${
            i === currentPage
              ? "bg-primary text-white"
              : "bg-gray-200 text-black"
          }"
          onclick="changePage(${i})"
        >${i}</button>
      `;
    }

    if (endPage < totalPages) {
      buttons += `<span class="px-2 py-1">…</span>`;
    }

    buttons += `
      <button 
        class="px-2 py-1 md:px-4 md:py-2 rounded bg-primary text-white disabled:opacity-40 cursor-pointer"
        ${currentPage === totalPages ? "disabled" : ""}
        onclick="changePage(${currentPage + 1})"
      >Next</button>
    `;

    paginationContainer.className =
      "flex flex-wrap justify-center gap-2 md:gap-4 my-6";

    paginationContainer.innerHTML = buttons;
  }

  (window as any).changePage = function (page: number) {
    currentPage = page;
    renderPage();
  };
});

formatDateTime();
