import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

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
