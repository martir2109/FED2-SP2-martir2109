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
    const messageDiv = document.createElement("div") as HTMLDivElement;
    messageDiv.className =
      "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
    messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">No listing ID found in the URL.</p>
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  const { userName } = getUserName();
  const { accessToken, apiKey } = getAuthenticationCredentials();

  if (!accessToken || !userName) {
    const messageDiv = document.createElement("div") as HTMLDivElement;
    messageDiv.className =
      "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
    messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">You must be logged in!</p>
      `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.innerHTML = "";
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
    (document.getElementById("media") as HTMLInputElement).value =
      listing.media[0].url || "";
    (document.getElementById("alt") as HTMLInputElement).value =
      listing.media[0].alt || "";
  } catch (error) {
    const messageDiv = document.createElement("div") as HTMLDivElement;
    messageDiv.className =
      "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
    messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">Failed to load the listing for editing: ${error}</p>
      `;

    document.body.appendChild(messageDiv);

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

      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-green-200 text-green-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-check-circle-fill text-green-950"></i>
      <p class="m-0">Listing successfully updated!</p>
      `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    } catch (error) {
      const messageDiv = document.createElement("div");
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
      <p class="m-0">Failed to update the listing: ${error}</p>
      `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    }
  });

  deleteBtn.addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delete this listing?");

    if (!confirmed) {
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-green-200 text-green-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
      <i class="bi bi-check-circle-fill text-green-950"></i>
      <p class="m-0">Listing not deleted!</p>
      `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        messageDiv.innerHTML = "";
      }, 2000);
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
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-green-200 text-green-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
        <i class="bi bi-check-circle-fill text-green-950"></i>
        <p class="m-0">Listing successfully deleted!</p>
        `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    } catch (error) {
      const messageDiv = document.createElement("div") as HTMLDivElement;
      messageDiv.className =
        "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
      messageDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
        <p class="m-0">Failed to delete the listing: ${error}</p>
        `;

      document.body.appendChild(messageDiv);

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
      return;
    }
  });
});

/** Adds realtime input validation listeners to input fields */
attachInputListeners(["#title", "#description", "#tags", "#media", "#alt"]);
