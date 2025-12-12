import { profileConstants } from "./profile.ts";
import { displayBidOnListings } from "./displayBidHistory.ts";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.ts";

/**
 * Loads and displays the listings the current user has placed bids on.
 *
 * If the user is viewing another user's profile, a message is shown.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function loadBidOnListings(): Promise<void> {
  const { accessToken, apiKey, profileUserName, isCurrentUserProfile } =
    profileConstants();

  const bidOnContainer = document.querySelector(
    ".bid-on-container",
  ) as HTMLDivElement | null;
  if (!bidOnContainer) return;

  if (!isCurrentUserProfile) {
    bidOnContainer.innerHTML =
      "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Cannot view bids of another user.</p>";
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${profileUserName}/bids?_listings=true&_seller=true&_bids=true`,

      {
        method: "GET",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
      },
    );

    if (!response.ok) throw new Error("Failed to fetch listings");

    const result = await response.json();
    const userBidListings = result.data
      .map((bid: any) => {
        if (!bid.listing) return null;
        return {
          ...bid.listing,
          userBidAmount: bid.amount,
        };
      })
      .filter(
        (listing: any, index: number, self: any[]) =>
          listing && self.findIndex((item) => item.id === listing.id) === index,
      );

    displayBidOnListings(bidOnContainer, userBidListings);
  } catch (error) {
    bidOnContainer.innerHTML =
      "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Could not load bid-on listings.</p>";
  }
}
