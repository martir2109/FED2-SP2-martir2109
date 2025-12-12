import { loadUserListingsData } from "../profileUtils.ts";
import { getUserProfileElements } from "../profileUtils.ts";
import { showErrorMessage } from "../../message.ts";
import { profileConstants } from "../profile.ts";
import { displayListings } from "../../utils.ts";

/**
 * Loads and displays all listigns for a user in the listing container.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function loadListings(): Promise<void> {
  const { accessToken, apiKey, profileUserName } = profileConstants();
  const { listingsContainer } = getUserProfileElements();

  let allListings = [];
  let displayedListings = [];

  if (!listingsContainer) {
    showErrorMessage(`Listing container not found on this page.`, 2000);
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  try {
    allListings = await loadUserListingsData(
      accessToken,
      apiKey,
      profileUserName,
    );

    displayedListings = [...allListings];
    displayListings(listingsContainer, displayedListings);
  } catch (error) {
    listingsContainer.innerHTML =
      "<p class='text-gray-700'>Error loading listings. Please try again later.</p>";
  }
}
