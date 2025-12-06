import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

import { formatDateTime } from "../utils.ts";

/**
 * Represents a listing object
 */
interface Listing {
  id: string;
  title?: string;
  description?: string;
  endsAt: string;
  created: string;
  media?: { url: string }[];
  seller?: { name?: string };
  bids?: { amount: number | string }[];
  _count?: { bids: number };
}

/**
 * Display listings inside the postContainer
 * @param {HTMLElement} listingsContainer - The HTML element where listings will be displayed
 * @param {Array} listings - Array of post objects
 */
export function displayListings(
  listingsContainer: HTMLElement | null,
  listings: Listing[],
) {
  if (!listingsContainer) return;

  listingsContainer.innerHTML = listings.length
    ? listings
        .map(
          (listing) => `
      <a
      href="/listing/view/index.html?id=${listing.id}"
      class="bg-white w-max-[200px] w-full min-h-[500px] h-fit rounded-xl border border-gray-300 flex flex-col gap-4 hover:shadow-xl/30 hover:-translate-y-2 transition transform duration-300 ease"
    >
     
      ${
        listing.media && listing.media.length > 0
          ? `<div class="w-full aspect-square rounded-t-[10px] bg-background flex items-center justify-center animate-pulse">
        <img
          src="${listing.media[0].url}"
          alt="Listing media"
          class="w-full h-full aspect-square object-cover rounded-t-[10px]"
          onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-200')"
        />
      </div>`
          : `<div class="w-full aspect-square bg-gray-300 rounded-t-[10px] flex items-center justify-center animate-pulse">
        <img
          src="/assets/images/default-image.jpg"
          class="w-full h-full aspect-square object-cover border border-grey rounded-t-[10px]"
          onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-200')"/>
      </div>`
      }
      <div class="p-4 flex flex-col gap-4">
       <h3 class="text-h3 font-bold break-all">
        ${listing.title ? listing.title.substring(0, 20) + "..." : "No title"}
      </h3>
      <p class="text-p break-all">
        <strong>Seller: </strong> ${listing.seller?.name || "Unknown seller"}
      </p>
      <p class="wrap-break-word w-full h-[50px] text-p">
        ${
          listing.description
            ? listing.description.substring(0, 50) + "..."
            : ""
        }
      </p>
      <p><strong>Bids:</strong> ${listing._count?.bids ?? 0}</p>
      <p>
        <strong>Highest bid:</strong> ${
          listing.bids && listing.bids.length > 0
            ? Math.max(...listing.bids.map((bid: any) => Number(bid.amount)))
            : 0
        }
        credits
      </p>
      <p class="bg-gray-200 py-2 rounded-full text-center"><strong>Ends at:</strong> ${formatDateTime(listing.endsAt)}</p>
      <div
        class="bg-primary text-white px-6 py-2 rounded-full text-h2 hover:bg-white hover:text-primary border border-bg-primary inline-block text-center cursor-pointer"
      >
        View listing
      </div>
</div>

    </a>
    `,
        )
        .join("")
    : `<div class="w-full h-fit flex justify-center items-center p-10"> <p class='text-gray-700 text-p'>No listings found. </p> </div>`;
}

/**
 * Load user profile data
 * Fetch and return user profile data from the API
 * @param {string} accessToken - User's access token for API authentication
 * @param {string} apiKey - User's API key
 * @param {string} userName - User's name
 * @returns {Promise<Object>} The user profile data
 */
export async function loadUserProfileData(
  accessToken: any,
  apiKey: any,
  userName: any,
): Promise<any> {
  if (!accessToken || !userName)
    throw new Error("No authentication data found");

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${userName}`,
    {
      method: "GET",
      headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || `HTTP ${response.status}`,
    );
  }

  const result = await response.json();
  return result.data;
}

/**
 * Load user listings data
 * Fetch and return user listings from the API
 * @param {string} accessToken - User's access token for API authentication
 * @param {string} apiKey - User's API key
 * @param {string} userName - User's name
 * @returns {Promise<Array>} Array of post objects
 */
export async function loadUserListingsData(
  accessToken: any,
  apiKey: any,
  userName: any,
): Promise<any> {
  if (!accessToken || !userName)
    throw new Error("No authentication data found");

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${userName}/listings?_seller=true&_bids=true`,
    {
      method: "GET",
      headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || `HTTP ${response.status}`,
    );
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Returns the main elements for a user profile page.
 * For both the logged-in user's profile and other users' profiles.
 * @returns {object} An object containing:
 *   - listingsContainer: The container element for user listings.
 *   - emailContainer: The paragraph element displaying the user's email.
 *   - avatar: The element for the user's avatar.
 */
export function getUserProfileElements() {
  return {
    listingsContainer: document.querySelector(
      ".listings-container",
    ) as HTMLDivElement | null,
    emailContainer: document.querySelector(
      ".email-container p",
    ) as HTMLParagraphElement | null,
    nameContainer: document.querySelector(
      ".name-container p",
    ) as HTMLParagraphElement | null,
    avatar: document.getElementById("avatar") as HTMLImageElement | null,
    bioContainer: document.getElementById("bio") as
      | HTMLDivElement
      | HTMLParagraphElement
      | null,
    banner: document.getElementById("banner") as HTMLImageElement | null,
    credits: document.getElementById("credits") as HTMLParagraphElement | null,
  };
}

formatDateTime();
