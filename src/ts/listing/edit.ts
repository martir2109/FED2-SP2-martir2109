/** Utility functions for error handling and authentication */
import {
  showError,
  clearError,
  attachInputListeners,
  getAuthenticationCredentials,
  getUserName,
} from "../utils.ts";

/** API configuration (base URL, endpoints, and header builders) */
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.ts";

/**
 * Sets up the Edit listing page once the DOM is fully loaded.
 * - Validates URL parameters and user authentication
 * - Fetches and loads listing data into form fields
 * - Sets up update and delete handlers
 */
document.addEventListener("DOMContentLoaded", async () => {
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (!listingId) {
    alert("No listing ID found in the URL.");
    return;
  }
  const { userName } = getUserName();
  const { accessToken, apiKey } = getAuthenticationCredentials();

  if (!accessToken || !userName) {
    alert("You must be logged in.");
    window.location.href = "../../auth/login/index.html";
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
    (document.getElementById("media") as HTMLInputElement).value =
      listing.media[0].url || "";
    (document.getElementById("alt") as HTMLInputElement).value =
      listing.media[0].alt || "";
  } catch (error) {
    console.error("Error loading listing: ", error);
    alert("Failed to load the listing for editing.");
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

    const updateListing = {
      title: (document.getElementById("title") as HTMLInputElement).value,
      description: (
        document.getElementById("description") as HTMLTextAreaElement
      ).value,
      tags: (document.getElementById("tags") as HTMLInputElement).value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      media: [
        {
          url: (document.getElementById("media") as HTMLInputElement).value,
          alt: (document.getElementById("alt") as HTMLInputElement).value,
        },
      ],
    };

    const title = updateListing.title;
    const description = updateListing.description;
    const tags = updateListing.tags;
    const media = updateListing.media;
    const alt = updateListing.media[0].alt || "";

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
    } else {
      clearError("description");
    }

    if (!tags || tags.length === 0) {
      showError("tags", "Tags cannot be empty.");
      hasError = true;
    } else {
      clearError("tags");
    }

    if (!media[0].url.trim() || !media[0].url.trim().startsWith("http")) {
      showError(
        "media",
        "Please enter a valid image url that starts with http or https.",
      );
      hasError = true;
    } else {
      clearError("media");
    }

    if (!alt.trim()) {
      showError("alt", "Alt text cannot be empty.");
      hasError = true;
    } else {
      clearError("alt");
    }

    if (hasError) return;

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

      alert("Listing successfully updated!");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error updating listing: ", error);
      alert("Failed to update the listing.");
    }
  });

  deleteBtn.addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delete this listing?");

    if (!confirmed) {
      alert("Listing not deleted!");
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
      alert("Listing deleted!");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error deleting listing: ", error);
      alert("Failed to delete the listing.");
    }
  });
});

/** Adds realtime input validation listeners to input fields */
attachInputListeners(["#title", "#description", "#tags", "#media", "#alt"]);
