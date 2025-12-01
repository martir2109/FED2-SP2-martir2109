import {
  displayListings,
  loadUserProfileData,
  loadUserListingsData,
  getUserProfileElements,
} from "./profileUtils.ts";

import {
  getAuthenticationCredentials,
  getUserName,
  showError,
  clearError,
  attachInputListeners,
  retrieveUserCredits,
} from "../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.ts";

import {
  createProfileLoggedIn,
  createProfileLoggedOut,
} from "./profileContent.ts";

import { editProfileToggle } from "./editProfileToggle.ts";

/**
 *
 */
document.addEventListener("DOMContentLoaded", async function () {
  const editProfileBtn = document.getElementById("edit-profile-btn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", updateUserProfileHandler);
  }

  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

  const urlParams = new URLSearchParams(window.location.search);
  const loggedInUserName = getUserName()?.userName;
  const profileUserName = urlParams.get("id") || loggedInUserName;

  if (!profileUserName) {
    alert("No profile specified to load.");
    return;
  }

  const isCurrentUserProfile = profileUserName === loggedInUserName;

  const profileHTML = isCurrentUserProfile
    ? createProfileLoggedIn()
    : createProfileLoggedOut();

  const profileContainer = document.getElementById("profile-container");
  if (!profileContainer) return;
  profileContainer.innerHTML = profileHTML;

  const { listingsContainer, emailContainer, avatar, bioContainer, banner } =
    getUserProfileElements();

  let allListings = [];
  let displayedListings = [];

  /**
   * Loads and displays the user profile data.
   *
   * Fetches user profile information from the API and updates the DOM elements (Banner img, avatar img, bio and email).
   *
   * @async
   * @returns {Promise<void>} Resolves when the profile is loaded and displayed.
   * @throws {Error} Alert user with error if loading the profile fails.
   */
  async function loadProfile(): Promise<void> {
    try {
      const userProfile = await loadUserProfileData(
        accessToken,
        apiKey,
        profileUserName,
      );

      if (banner && userProfile.banner) {
        banner.src = userProfile.banner.url;
        banner.alt = userProfile.banner.alt || "User banner";
      }

      if (avatar && userProfile.avatar) {
        avatar.src = userProfile.avatar.url;
        avatar.alt = userProfile.avatar.alt || "User avatar";
      }

      if (bioContainer) {
        bioContainer.textContent = userProfile.bio || "No bio yet.";
      }

      if (emailContainer) emailContainer.textContent = userProfile.email || "";

      if (isCurrentUserProfile) {
        const bannerInput = document.getElementById(
          "banner-input",
        ) as HTMLInputElement;
        const avatarInput = document.getElementById(
          "avatar-input",
        ) as HTMLInputElement;
        const bioInput = document.getElementById(
          "bio-input",
        ) as HTMLInputElement;

        if (bannerInput && userProfile.banner)
          bannerInput.value = userProfile.banner.url || "";
        if (avatarInput && userProfile.avatar)
          avatarInput.value = userProfile.avatar.url || "";
        if (bioInput) {
          bioInput.value = userProfile.bio || "";
          if (!userProfile.bio) bioInput.placeholder = "No bio yet";
        }
      }
    } catch (error) {
      alert("Error loading profile: " + error);
    }
  }

  /**
   * Handles updating the user's profile with new banner, avatar and bio.
   *
   * Retrieves input values from the DOM.
   * Validates the input fields.
   * Sends a PUT request to the API to update the user profile.
   * Updates localStroage and refreshed the displayed user profile data.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If the API request failes or the response is not OK.
   */
  async function updateUserProfileHandler(): Promise<void> {
    const bannerInput = document.getElementById(
      "banner-input",
    ) as HTMLInputElement;
    const avatarInput = document.getElementById(
      "avatar-input",
    ) as HTMLInputElement;
    const bioInput = document.getElementById("bio-input") as HTMLInputElement;

    const banner = bannerInput.value.trim();
    const avatar = avatarInput.value.trim();
    const bio = bioInput.value.trim();

    let hasError = false;

    if (!banner.trim() || !banner.startsWith("http")) {
      showError(
        "banner-input",
        "Please enter a valid banner url that starts with http or https.",
      );
      hasError = true;
    } else {
      clearError("banner-input");
    }

    if (!avatar.trim() || !avatar.startsWith("http")) {
      showError(
        "avatar-input",
        "Please enter a valid avatar url that starts with http or https.",
      );
      hasError = true;
    } else {
      clearError("avatar-input");
    }

    if (bio.length > 100) {
      showError("bio-input", "Bio can max be 100 characters or less.");
      hasError = true;
    } else {
      clearError("bio-input");
    }

    if (hasError) return;

    const updateData: any = {};
    if (banner) updateData.banner = { url: banner };
    if (avatar) updateData.avatar = { url: avatar };
    updateData.bio = bio;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${userName}`,
        {
          method: "PUT",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const updatedProfile = await refreshUserdata();
      localStorage.setItem("user", JSON.stringify({ data: updatedProfile }));
      if (updatedProfile) loadProfile();

      alert("Profile updated successfully!");
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  }

  /**
   * Fetches the latest profile data for the current user from the API.
   *
   * @async
   * @returns
   * @throws {Error} If the fetch request failes or the response is not OK.
   */
  async function refreshUserdata() {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${userName}`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data.data;
  }

  /**
   * Loads and displays all listigns for a user in the listing container.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function loadListings(): Promise<void> {
    if (!listingsContainer) {
      console.error("Listing container not found on this page.");
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
      console.error("Error loading Listings:", error);
      listingsContainer.innerHTML =
        "<p class='text-gray-700'>Error loading listings. Please try again later.</p>";
    }
  }

  /**
   * Loads and displays the listings the current user has placed bids on.
   *
   * If the user is viewing another user's profile, a message is shown.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function loadBidOnListings(): Promise<void> {
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
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.PROFILES}/${profileUserName}/bids?_listings=true&_seller=true`,
        {
          method: "GET",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch listings");

      const result = await response.json();
      const userBidListings = result.data
        .map((bid: any) => bid.listing)
        .filter(
          (listing: any, index: number, self: any[]) =>
            listing && self.findIndex((l) => l.id === listing.id) === index,
        );

      displayListings(bidOnContainer, userBidListings);
    } catch (error) {
      console.error("Error loading bid-on listings:", error);
      bidOnContainer.innerHTML =
        "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Could not load bid-on listings.</p>";
    }
  }

  /**
   * Loads and displays the listings the current user has won.
   *
   * If the user is viewing another user's profile, a message is shown.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function loadWins(): Promise<void> {
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
      console.error("Error loading wins listings:", error);
      winsContainer.innerHTML =
        "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Could not load won listings.</p>";
    }
  }

  await loadProfile();
  retrieveUserCredits();
  editProfileToggle();
  await loadListings();
  await loadBidOnListings();
  await loadWins();
});

attachInputListeners(["#banner-input", "#avatar-input", "#bio"]);
