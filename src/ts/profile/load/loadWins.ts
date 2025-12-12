import { profileConstants } from "../profile.ts";
import { displayListings } from "../../utils.ts";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../../apiConfig.ts";

/**
 * Loads and displays the listings the current user has won.
 *
 * If the user is viewing another user's profile, a message is shown.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function loadWins(): Promise<void> {
  const { accessToken, apiKey, profileUserName, isCurrentUserProfile } =
    profileConstants();

  const winsContainer = document.querySelector(
    ".wins-container",
  ) as HTMLDivElement | null;
  if (!winsContainer) return;

  if (!isCurrentUserProfile) {
    winsContainer.innerHTML =
      "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Cannot view wins of another user.</p>";
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${profileUserName}/wins?_listings=true&_seller=true&_bids=true`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
      },
    );

    if (!response.ok) throw new Error("Failed to fetch listings");

    const userWins = await response.json();
    displayListings(winsContainer, userWins.data);
  } catch (error) {
    winsContainer.innerHTML =
      "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Could not load won listings.</p>";
  }
}
