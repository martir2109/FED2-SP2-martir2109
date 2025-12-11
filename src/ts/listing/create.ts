import {
  showError,
  clearError,
  attachInputListeners,
  getAuthenticationCredentials,
} from "../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

import { showSuccessMessage, showErrorMessage } from "../message.ts";
import { addImageContent } from "./components.ts";

/**
 * @type {HTMLFormElement} The form used to create a new listing
 */

document.addEventListener("DOMContentLoaded", () => {
  const existingImageCount =
    document.querySelectorAll(".extra-media").length + 1;
  addImageContent(existingImageCount, 3);

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
      showSuccessMessage(`You must be logged in to create a listing.`, 2000);
      setTimeout(() => {
        window.location.href = "/auth/login/index.html";
      }, 2000);
      return;
    }

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const tags = (document.getElementById("tags") as HTMLInputElement).value;
    const mainImageUrl = (
      document.getElementById("media") as HTMLInputElement
    ).value.trim();
    const mainAltText = (
      document.getElementById("alt") as HTMLInputElement
    ).value.trim();

    const urls: string[] = [mainImageUrl];
    const alts: string[] = [mainAltText];

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

    const listing = {
      title,
      description: description,
      tags: tags
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
      showSuccessMessage(`Listing successfully created!`, 1000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    } catch (error) {
      const errorMessage = error.message || "An undexpected error occured.";
      showErrorMessage(
        `Something went wrong while creating the post: ${errorMessage}`,
        5000,
      );
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
});
