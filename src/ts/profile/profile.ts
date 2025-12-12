import { loadUserProfileData, getUserProfileElements } from "./profileUtils.ts";

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
import { showErrorMessage, showSuccessMessage } from "../message.ts";
import { characterCounter } from "../countCharacters.ts";
import { loadWins } from "./load/loadWins.ts";
import { loadBidOnListings } from "./load/loadBidsOnListings.ts";
import { loadListings } from "./load/loadListings.ts";

export function profileConstants() {
  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();
  const urlParams = new URLSearchParams(window.location.search);
  const loggedInUserName = getUserName()?.userName;
  const profileUserName = urlParams.get("id") || loggedInUserName;
  const isCurrentUserProfile = profileUserName === loggedInUserName;

  return {
    accessToken,
    apiKey,
    userName,
    profileUserName,
    isCurrentUserProfile,
  };
}

document.addEventListener("DOMContentLoaded", async function () {
  const {
    accessToken,
    apiKey,
    userName,
    profileUserName,
    isCurrentUserProfile,
  } = profileConstants();

  if (!profileUserName) {
    showErrorMessage(`No profile specified to load.`, 3000);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 3000);
    return;
  }

  const profileHTML = isCurrentUserProfile
    ? createProfileLoggedIn()
    : createProfileLoggedOut();

  const profileContainer = document.getElementById("profile-container");
  if (!profileContainer) return;
  profileContainer.innerHTML = profileHTML;

  const { emailContainer, nameContainer, avatar, bioContainer, banner } =
    getUserProfileElements();

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
        const bannerAltInput = document.getElementById(
          "banner-alt-input",
        ) as HTMLInputElement;
        const avatarInput = document.getElementById(
          "avatar-input",
        ) as HTMLInputElement;
        const avatarAltInput = document.getElementById(
          "avatar-alt-input",
        ) as HTMLInputElement;
        const bioInput = document.getElementById(
          "bio-input",
        ) as HTMLTextAreaElement;

        if (bannerInput && userProfile.banner)
          bannerInput.value = userProfile.banner.url || "";

        if (bannerAltInput && userProfile.banner.alt)
          bannerAltInput.value = userProfile.banner.alt || "";

        if (avatarInput && userProfile.avatar)
          avatarInput.value = userProfile.avatar.url || "";

        if (avatarAltInput && userProfile.avatar.alt)
          avatarAltInput.value = userProfile.avatar.alt || "";

        if (bioInput) {
          bioInput.value = userProfile.bio || "";
          if (!userProfile.bio) bioInput.placeholder = "No bio yet";
        }
      }
    } catch (error) {
      showErrorMessage(`Error loading profile: ${error}`, 3000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 3000);
      return;
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
    const bannerAltInput = document.getElementById(
      "banner-alt-input",
    ) as HTMLInputElement;
    const avatarInput = document.getElementById(
      "avatar-input",
    ) as HTMLInputElement;
    const avatarAltInput = document.getElementById(
      "avatar-alt-input",
    ) as HTMLInputElement;
    const bioInput = document.getElementById("bio-input") as HTMLInputElement;

    const banner = bannerInput.value.trim();
    const bannerAlt = bannerAltInput.value.trim();
    const avatar = avatarInput.value.trim();
    const avatarAlt = avatarAltInput.value.trim();
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

    if (!bannerAlt.trim()) {
      showError("banner-alt-input", "Banner alt cannot be empty.");
      hasError = true;
    } else {
      clearError("banner-alt-input");
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

    if (!avatarAlt.trim()) {
      showError("avatar-alt-input", "Avatar alt cannot be empty.");
      hasError = true;
    } else {
      clearError("avatar-alt-input");
    }

    if (bio.length > 160) {
      showError("bio-input", "Bio can max be 100 characters or less.");
      hasError = true;
    } else {
      clearError("bio-input");
    }

    if (hasError) return;

    const updateData: any = {};
    if (banner)
      updateData.banner = { url: banner, alt: bannerAlt || "User banner" };
    if (avatar)
      updateData.avatar = { url: avatar, alt: avatarAlt || "User avatar" };
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
      showSuccessMessage(`Profile successfully updated!`, 2000);
      setTimeout(() => {
        location.reload();
      }, 2000);
      return;
    } catch (error) {
      showErrorMessage(`Failed to update profile: ${error}`, 2000);
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

  await loadProfile();
  characterCounter();
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
