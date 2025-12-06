/** Formats listing date and time. */
import { createListingCard, Listing } from "../utils.ts";

export function displayRecentListings(data: Listing[]) {
  const listingsContainer = document.getElementById("listing-container");
  if (!listingsContainer) return;

  if (data.length === 0) {
    let message = "No listings found.";

    const searchInput = (
      document.getElementById("search-title") as HTMLInputElement
    )?.value.trim();
    const tagsInput = (
      document.getElementById("filter-tags") as HTMLInputElement
    )?.value.trim();

    if (searchInput && !tagsInput) {
      message = `No listings found matching your search: "${searchInput}".`;
    } else if (!searchInput && tagsInput) {
      message = `No listings found with the tags: "${tagsInput}".`;
    } else if (searchInput && tagsInput) {
      message = `No listings found matching your search "${searchInput}" and tags "${tagsInput}".`;
    }

    listingsContainer.innerHTML = `
      <div class="landingpage-message-container w-full text-center py-10">
        <p class="landingpage-listing-message text-gray-500 text-p italic">
          ${message}
        </p>
      </div>
    `;
    return;
  }
  listingsContainer.innerHTML = data.map(createListingCard).join("");
}
