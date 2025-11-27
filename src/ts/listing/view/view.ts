import {
  getAuthenticationCredentials,
  formatDateTime,
  retrieveUserCredits,
} from "../../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
} from "../../apiConfig.ts";

import {
  createLoggedOutContent,
  createLoggedInContent,
} from "./viewContent.ts";

import { displayListingBidHistory } from "./bidHistory.ts";
import { displayListing } from "./listingDisplay.ts";

/**
 * Checks if user is logged in by verifying that there is an accessToken from localStorage
 *
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
function isUserLoggedIn(): boolean {
  const { accessToken } = getAuthenticationCredentials();
  return accessToken !== null;
}

const { accessToken, apiKey } = getAuthenticationCredentials();
const currentUserRaw = JSON.parse(localStorage.getItem("user") ?? "{}");
const currentUser = currentUserRaw.data || currentUserRaw;
const currentUserName =
  currentUser.name || currentUser.username || currentUser.email || "user";

/**
 * Loads a single listing based on the id in the URL.
 * Fetches the listing data including the seller and bid information from the API.
 * Renders the bid history for the listing.
 * Handles errors by displaying an error message.
 *
 * @async
 * @returns {Promise<void>} Resolves after the listing has been loaded.
 */
async function loadListing(): Promise<void> {
  const ListingContainer = document.getElementById("listing-container");
  if (!ListingContainer) return;

  try {
    const listingId = new URLSearchParams(window.location.search).get("id");
    if (!listingId) {
      alert("No listing ID found in the URL.");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}?_seller=true&_bids=true`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      },
    );

    const listing = await response.json();

    if (!response.ok) {
      const errorMessage =
        listing.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    displayListing([listing.data ?? listing]);
    displayListingBidHistory([listing.data ?? listing]);
  } catch (error) {
    const viewListing = document.getElementById("view-listing");
    if (viewListing)
      viewListing.innerHTML =
        '<p class="landingpage-listing-error">Unable to load listing</p>';
    console.error("Error loading listing:", error);
  }
}

/**
 * Sets up the "Place Bid" button.
 * Checks if the bid is valid, sends it to the API, and updates the listing and user credits.
 * Shows alerts if there are errors or the bid is too low.
 *
 * @async
 * @returns {Promise<void>} Resolves after the event listiner is attached.
 */
async function bidOnListing(): Promise<void> {
  const bidButton = document.getElementById(
    "place-bid-btn",
  ) as HTMLButtonElement | null;
  const bidInput = document.getElementById(
    "place-bid-input",
  ) as HTMLInputElement | null;

  if (!bidButton || !bidInput) return;

  bidButton.addEventListener("click", async () => {
    const listingId = new URLSearchParams(window.location.search).get("id");
    if (!listingId) {
      alert("No listing ID found.");
      return;
    }

    const amount = Number(bidInput.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    const { accessToken, apiKey } = getAuthenticationCredentials();
    if (!accessToken) {
      alert("You must be logged in to place a bid.");
      return;
    }

    try {
      const listingResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}?_bids=true`,
        {
          method: "GET",
          headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
        },
      );

      const listingData = await listingResponse.json();
      const listing = listingData.data ?? listingData;
      const currentHighestBid =
        listing.bids && listing.bids.length > 0
          ? Math.max(...listing.bids.map((bid: any) => Number(bid.amount)))
          : 0;

      if (amount <= currentHighestBid) {
        alert(
          `Your bid must be higher than the current highest bid of ${currentHighestBid} credits.`,
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}/bids`,
        {
          method: "POST",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
          body: JSON.stringify({ amount }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      alert(`Bid of ${amount} credits successfully placed!`);
      bidInput.value = "";

      await loadListing();
      retrieveUserCredits();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  });
}

/**
 * Initializes the listing page when the DOM is loaded.
 * Sets up the listing content, bid section, and updates user credits.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const viewListingSection = document.getElementById("view-listing-section");
  if (!viewListingSection) return;

  viewListingSection.innerHTML = isUserLoggedIn()
    ? createLoggedInContent()
    : createLoggedOutContent();

  if (isUserLoggedIn()) {
    bidOnListing();
  }

  await loadListing();
  retrieveUserCredits();
});
formatDateTime();
