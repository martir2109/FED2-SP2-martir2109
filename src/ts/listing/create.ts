/** Utility functions for error handling and authentication */
import {
  showError,
  clearError,
  attachInputListeners,
  getAuthenticationCredentials,
} from "../utils.ts";

/** API configuration (base URL, endpoints, and header builders) */
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

/**
 * @type {HTMLFormElement} The form used to create a new listing
 */
const createListingForm = document.getElementById(
  "create-listing-form",
) as HTMLFormElement;

/**
 * Handles submission of the "create-listing-form".
 * - Validates all input fields
 * - Sends a POST request to create the listing
 * - Redirects on success
 *
 * @param {SubmitEvent} event - The submit event
 */
createListingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const { accessToken, apiKey } = getAuthenticationCredentials();

  if (!accessToken) {
    alert("You must be logged in to create a listing.");
    window.location.href = "../../auth/login/index.html";
    return;
  }

  const title = (document.getElementById("title") as HTMLInputElement).value;
  const description = (
    document.getElementById("description") as HTMLTextAreaElement
  ).value;
  const tags = (document.getElementById("tags") as HTMLInputElement).value;
  const media = {
    url: (document.getElementById("media") as HTMLInputElement).value,
    alt: (document.getElementById("alt") as HTMLInputElement).value,
  };
  const endAtInput = (document.getElementById("endsAt") as HTMLInputElement)
    .value;
  const endsAt = new Date(endAtInput);

  /** Validate form fields and show errors */
  let hasError = false;

  if (!title.trim()) {
    showError("title", "Title cannot be empty.");
    hasError = true;
  } else {
    clearError("title");
  }

  if (!description.trim()) {
    showError("description", "Title cannot be empty.");
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

  if (!media.url.trim() || !media.url.trim().startsWith("http")) {
    showError(
      "media",
      "Please enter a valid image url that starts with http or https.",
    );
    hasError = true;
  } else {
    clearError("media");
  }

  if (!media.alt.trim()) {
    showError("alt", "Alt text cannot be empty.");
    hasError = true;
  } else {
    clearError("alt");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!endsAt) {
    showError("endsAt", "End date cannot be empty.");
    hasError = true;
  } else if (isNaN(endsAt.getTime()) || endsAt < today) {
    showError("endsAt", "The date is invalid.");
    hasError = true;
  } else {
    clearError("endsAt");
  }

  if (hasError) return;

  const tagsArray = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const listing = {
    title,
    description: description,
    tags: tagsArray,
    media: [media],
    endsAt: endsAt.toISOString(),
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUCTION.LISTINGS}`,
      {
        method: "POST",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
        body: JSON.stringify(listing),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    alert("Listing successfully created!");
    createListingForm.reset();
    window.location.href = "/index.html";
  } catch (error) {
    const errorMessage = error.message || "An undexpected error occured.";
    alert("Something went wrong while creating the post: " + errorMessage);
  }
});

/** Adds realtime input validation listeners to input fields */
attachInputListeners([
  "#title",
  "#description",
  "#tags",
  "#media",
  "#alt",
  "#endsAt",
]);
