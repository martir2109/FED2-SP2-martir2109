import {
  displayListings,
  displayBidOnListings,
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

document.addEventListener("DOMContentLoaded", async function () {
  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

  const urlParams = new URLSearchParams(window.location.search);
  const loggedInUserName = getUserName()?.userName;
  const profileUserName = urlParams.get("id") || loggedInUserName;

  if (!profileUserName) {
    const messageDiv = document.createElement("div") as HTMLDivElement;
    messageDiv.className =
      "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
    messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">No profile specified to load.</p>
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 3000);
    return;
  }

  const isCurrentUserProfile = profileUserName === loggedInUserName;

  const profileHTML = isCurrentUserProfile
    ? createProfileLoggedIn()
    : createProfileLoggedOut();

  const profileContainer = document.getElementById("profile-container");
  if (!profileContainer) return;
  profileContainer.innerHTML = profileHTML;

  const {
    listingsContainer,
    emailContainer,
    nameContainer,
    avatar,
    bioContainer,
    banner,
  } = getUserProfileElements();

  let allListings = [];
  let displayedListings = [];

  /**
   * Loads and displays the user profile data.
   *
   * Fetches user profile information from the API and updates the DOM elements:
   * - Banner img
   * - Avatar img
   * - Bio text
   * - Email
   *
   * @async
   * @returns {Promise<void>} Resolves when the profile is loaded and displayed.
   * @throws {Error} Show error message if loading the profile fails.
   */
  async function loadProfile(): Promise<void> {
    try {
      const userProfile = await loadUserProfileData(
        accessToken,
        apiKey,
        profileUserName,
      );

      if (nameContainer) nameContainer.textContent = userProfile.name || "";

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
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">Error loading profile: ${error}.</p>
    `;

      document.body.appendChild(messageDiv);
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

      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-green-200 text-green-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-check-circle-fill text-green-950"></i>
      <p class="m-0">Profile updated successfully!</p>
      `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        location.reload();
      }, 2000);
      return;
    } catch (error) {
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">Failed to update profile: ${error}</p>
      `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
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
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
        <p class="m-0">Listing container not found on this page</p>
        `;

      document.body.appendChild(messageDiv);

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
            listing &&
            self.findIndex((item) => item.id === listing.id) === index,
        );

      displayBidOnListings(bidOnContainer, userBidListings);
    } catch (error) {
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
      winsContainer.innerHTML =
        "<p class='text-gray-700 w-full h-fit flex justify-center items-center p-10'>Could not load won listings.</p>";
    }
  }

  await loadProfile();
  retrieveUserCredits();
  editProfileToggle();
  const editProfileBtn = document.getElementById("edit-profile-btn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", updateUserProfileHandler);
  }

  await loadListings();
  await loadBidOnListings();
  await loadWins();
});

attachInputListeners(["#banner-input", "#avatar-input", "#bio"]);
