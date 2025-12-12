import {
  showError,
  clearError,
  attachInputListeners,
  getAuthenticationCredentials,
  getUserName,
} from "../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.ts";

import {
  showErrorMessage,
  showSuccessMessage,
  showConfirmMessage,
} from "../message.ts";
import { addImageContent, addExistingImage } from "./components.ts";

/**
 * Sets up the Edit listing page once the DOM is fully loaded.
 * - Validates URL parameters and user authentication
 * - Fetches and loads listing data into form fields
 * - Sets up update and delete handlers
 */
document.addEventListener("DOMContentLoaded", async () => {
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (!listingId) {
    showErrorMessage(`No listing ID found in the URL.`, 2000);
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  const { userName } = getUserName();
  const { accessToken, apiKey } = getAuthenticationCredentials();

  if (!accessToken || !userName) {
    showErrorMessage(`You must be logged in!`, 2000);
    setTimeout(() => {
      window.location.href = "/auth/login/index.html";
    }, 2000);
    return;
  }

  /**
   * @type {HTMLFormElement} The form used to edit listing
   */
  const editForm = document.getElementById(
    "edit-listing-form",
  ) as HTMLFormElement;

  const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement;

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const listing = data.data ?? data;

    (document.getElementById("title") as HTMLInputElement).value =
      listing.title;
    (document.getElementById("description") as HTMLTextAreaElement).value =
      listing.description;
    (document.getElementById("tags") as HTMLInputElement).value =
      listing.tags?.join(", ") || "";

    const mainMedia = listing.media?.[0];
    const extraMedia = listing.media?.slice(1) || [];

    (document.getElementById("media") as HTMLInputElement).value =
      mainMedia?.url || "";
    (document.getElementById("alt") as HTMLInputElement).value =
      mainMedia?.alt || "";

    extraMedia.forEach((mediaItem, index) => {
      addExistingImage(mediaItem, index + 2);
    });
    addImageContent(1, 3);
  } catch (error) {
    showErrorMessage(`Failed to load the listing for editing: ${error}`, 2000);
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  /**
   * Handles submission of the "edit-listing-form".
   * - Validates all input fields
   * - Sends a PUT request to edit the listing
   * - Redirects on success
   *
   * @param {SubmitEvent} event - The submit event
   */
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const tags = (document.getElementById("tags") as HTMLInputElement).value;
    const urls: string[] = [
      (document.getElementById("media") as HTMLInputElement).value.trim(),
    ];
    const alts: string[] = [
      (document.getElementById("alt") as HTMLInputElement).value.trim(),
    ];

    urls.push(
      ...Array.from(document.querySelectorAll(".extra-media")).map((input) =>
        (input as HTMLInputElement).value.trim(),
      ),
    );
    alts.push(
      ...Array.from(document.querySelectorAll(".extra-alt")).map((input) =>
        (input as HTMLInputElement).value.trim(),
      ),
    );

    /** Validate form fields and show errors */
    let hasError = false;

    if (!title.trim()) {
      showError("title", "Title cannot be empty.");
      hasError = true;
    } else {
      clearError("title");
    }

    if (!description.trim()) {
      showError("description", "Description cannot be empty.");
      hasError = true;
    } else if (description.length > 300) {
      showError("description", "Description cannot exceed 300 characters.");
      hasError = true;
    } else {
      clearError("description");
    }

    if (!tags || tags.length === 0) {
      showError("tags", "Tags cannot be empty.");
      hasError = true;
    } else {
      clearError("tags");
    }

    const validMediaUrls = urls.filter(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
    );

    if (validMediaUrls.length === 0) {
      showError("media", "Please enter at least one valid image URL.");
      hasError = true;
    } else if (validMediaUrls.length > 3) {
      showError("media", "You can only enter a maximum of 3 image URLs.");
      hasError = true;
    } else if (urls.some((url) => url && !url.startsWith("http"))) {
      showError("media", "All image URLs must start with http or https.");
      hasError = true;
    } else if (alts.some((alt, i) => urls[i] && alt.trim() === "")) {
      showError("alt", "Every image must have ALT text.");
      hasError = true;
    } else {
      clearError("media");
      clearError("alt");
    }

    if (hasError) return;

    const updateListing = {
      title: (document.getElementById("title") as HTMLInputElement).value,
      description: (
        document.getElementById("description") as HTMLTextAreaElement
      ).value,
      tags: (document.getElementById("tags") as HTMLInputElement).value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      media: urls
        .map((url, index) => ({
          url,
          alt: alts[index] || "",
        }))
        .filter((item) => item.url.length > 0)
        .slice(0, 3),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}`,
        {
          method: "PUT",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
          body: JSON.stringify(updateListing),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }
      showSuccessMessage(`Listing successfully updated!`, 1000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
      return;
    } catch (error) {
      showErrorMessage(`Failed to update the listing: ${error}`, 2000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    }
  });

  deleteBtn.addEventListener("click", async function () {
    const confirmed = await showConfirmMessage(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) {
      showSuccessMessage(`Listing not deleted!`, 2000);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}/${listingId}`,
        {
          method: "DELETE",
          headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      (document.getElementById("edit-listing-form") as HTMLFormElement).reset();

      showSuccessMessage(`Listing successfully deleted!`, 1000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
      return;
    } catch (error) {
      showErrorMessage(`Failed to delete the listing: ${error}`, 2000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    }
  });
});

/** Adds realtime input validation listeners to input fields */
attachInputListeners(["#title", "#description", "#tags", "#media", "#alt"]);
