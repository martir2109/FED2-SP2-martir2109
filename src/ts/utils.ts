import {
  getUserProfileElements,
  loadUserProfileData,
} from "./profile/profileUtils";

import { showErrorMessage } from "./message.ts";

/**
 * Show error message below an input field.
 * @param {string} inputId - The ID of the input field.
 * @param {string} message - The error message to display.
 */
export function showError(inputId: string, message: string) {
  const input = document.getElementById(inputId)!;
  const errorSpan = document.getElementById(`${inputId}-error`)!;
  const infoText = document.getElementById(`${inputId}-info`)!;

  if (input && errorSpan) {
    input.classList.add("input-error");
    errorSpan.textContent = message;
    input.classList.add("border-danger");
    input.classList.remove("border-gray-300");

    if (infoText) {
      infoText.style.display = "none";
    }
  }
}

/**
 * Clear the error message for a given input.
 * @param {string} inputId - The ID of the input field
 */
export function clearError(inputId: string) {
  const input = document.getElementById(inputId)!;
  const errorSpan = document.getElementById(`${inputId}-error`)!;

  if (input && errorSpan) {
    input.classList.remove("input-error");
    input.classList.remove("border-danger");
    input.classList.add("border-gray-300");
    errorSpan.textContent = "";
  }
}

/**
 * Toggle password visibility on the password input.
 */
export function togglePassword() {
  const passwordInput =
    (document.getElementById("password") as HTMLInputElement) || null;
  const checkbox =
    (document.getElementById("show-password") as HTMLInputElement) || null;

  if (checkbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

/**
 * Attach event listeners to input fields to clear error messages.
 * Clears the error when the field is focused or when the user types.
 *
 * @param {string[]} inputSelectors - Array of CSS selectors for input elements.
 */
export function attachInputListeners(inputSelectors: string[]) {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    inputSelectors.join(", "),
  );

  inputs.forEach((input) => {
    input.addEventListener("focus", () => clearError(input.id));

    input.addEventListener("input", () => {
      if (input.value.trim()) clearError(input.id);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachInputListeners(["#name", "#email", "#password"]);
});

/**
 * Retrive authentication credentials from localStorage
 * @returns {{accessToken: string|null, apiKey: string|null}}
 * An object containing the user's access token and API key, or null values if not found.
 */
export function getAuthenticationCredentials(): {
  accessToken: string | null;
  apiKey: string | null;
} {
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  return { accessToken, apiKey };
}

/**
 * Retrives the stored username from localStorage.
 * If no username is stored it defaults to "User".
 * @returns {object} An object containting the username.
 */
export function getUserName() {
  const userName = localStorage.getItem("userName") || "User";
  return { userName };
}

/**
 * Retrives the stored user data from localStorage.
 * @returns {object} An object containgt the raw user data string.
 */
export function getUser() {
  const userDataString = localStorage.getItem("user");
  return { userDataString };
}

export function formatDateTime(dateString?: string) {
  return dateString
    ? new Date(dateString).toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";
}

export async function retrieveUserCredits() {
  const { credits } = getUserProfileElements();
  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

  if (!accessToken || !userName) return;

  try {
    const userProfile = await loadUserProfileData(
      accessToken,
      apiKey,
      userName,
    );

    if (credits) {
      credits.textContent = userProfile.credits || "0";
    }
  } catch (error) {
    showErrorMessage(`Error loading user credits: ${error}`, 2000);
  }
}

export interface Listing {
  id: string;
  title?: string;
  description?: string;
  endsAt: string;
  created: string;
  media?: { url: string }[];
  seller?: { name?: string };
  bids?: { amount: number | string }[];
  _count?: { bids: number };
  userBidAmount?: number;
  tags?: Array<string>;
}

export function createListingCard(listing: Listing): string {
  const listingEndTime = new Date(listing.endsAt);
  const currentTime = new Date();

  return `
    
      <a href="/listing/view/index.html?id=${listing.id}"
      class="bg-white w-max-[200px] w-full min-h-[500px] h-fit rounded-xl border border-gray-300 flex flex-col gap-4 hover:shadow-xl/30 hover:-translate-y-2 transition transform duration-300 ease"
    >
      ${
        listing.media && listing.media.length > 0
          ? `<div class="w-full relative aspect-square rounded-t-[10px] bg-background flex items-center justify-center">
            <div class="w-full h-full absolute aspect-square rounded-t-[10px] flex items-center justify-center bg-background">
            <div class="w-full h-full rounded-t-[10px] animate-pulse bg-radial-[at_100%_100%] from-gray-400 via-gray-300 to-gray-400"> </div>
            </div>

              <img
                src="${listing.media[0].url}"
                alt="Listing media"
                class="w-full h-full aspect-square object-cover rounded-t-[10px]"
                onload="this.previousElementSibling.remove();"

              />
               <div class="absolute bottom-2 right-2 flex flex-col xs:flex-row gap-2 justify-end">
     ${listing.tags
       ?.slice(0, 2)
       .map(
         (tag) => `
        <p class="wrap-break-word text-p bg-gray-200 px-2 rounded-full w-fit h-fit border border-gray-500">
      ${tag}
       </p>
      `,
       )
       .join("")}
    </div>
            </div>`
          : `<div class="w-full relative aspect-square bg-gray-300 rounded-t-[10px] flex items-center justify-center">
           <div class="w-full h-full absolute aspect-square rounded-t-[10px] flex items-center justify-center bg-background">
            <div class="w-full h-full rounded-t-[10px] animate-pulse bg-radial-[at_100%_100%] from-gray-400 via-gray-300 to-gray-400"> </div>
            </div>
              <img
                src="/assets/images/default-image.jpg"
                class="w-full h-full aspect-square object-cover border border-grey rounded-t-[10px]"
                onload="this.previousElementSibling.remove();"
              <div class="absolute bottom-2 right-2 flex flex-col xs:flex-row gap-2 justify-end">
     ${listing.tags
       ?.slice(0, 2)
       .map(
         (tag) => `
        <p class="wrap-break-word text-p bg-gray-200 px-2 rounded-full w-fit h-fit border border-gray-500">
      ${tag}
       </p>
      `,
       )
       .join("")}
    </div>
          </div>`
      }
      <div class="p-2 xs:p-4 flex flex-col gap-4">
        <h3 class="text-h3 font-bold break-all">
          ${listing.title ? listing.title.substring(0, 15) + "..." : "No title"}
        </h3>
        <p class="text-p break-all">
          <strong>Seller: </strong> ${listing.seller?.name || "Unknown seller"}
        </p>
         <p class="text-gray-500 text-p">
        <strong>Created:</strong> ${formatDateTime(listing.created)}
      </p>
        <p class="wrap-break-word w-full h-fit sm:h-[60px] text-p bg-gray-200 p-2 rounded-md">
          ${listing.description ? listing.description.substring(0, 50) + "..." : ""}
        </p>
        <p><strong>Bids:</strong> ${listing._count?.bids ?? 0}</p>
        <p>
          <strong>Highest bid:</strong> ${
            listing.bids && listing.bids.length > 0
              ? Math.max(...listing.bids.map((bid: any) => Number(bid.amount)))
              : 0
          }
          credits
        </p>
      <div class="flex flex-col xs:flex-row justify-center items-center gap-2">
  ${
    currentTime >= listingEndTime
      ? `<p class="bg-red-200 text-red-950 py-2 rounded-full text-center font-bold w-full">Listing has ended!</p>`
      : `<p class="bg-gray-200 py-2 rounded-full text-center w-full"><strong>Ends at:</strong> ${formatDateTime(listing.endsAt)}</p>`
  }
</div>


        <div
          class="bg-primary text-white flex justify-center h-[53px] items-center rounded-full text-h3 xs:text-h2 hover:bg-white hover:text-primary border border-bg-primary text-center cursor-pointer"
        >
          View listing
        </div>
      </div>
    </a>
  `;
}

/**
 * Display listings inside the listings container
 * @param {HTMLElement} listingsContainer - The HTML element where listings will be displayed
 * @param {Array} listings - Array of listing objects
 */
export function displayListings(
  listingsContainer: HTMLElement | null,
  listings: Listing[],
) {
  if (!listingsContainer) return;

  listingsContainer.innerHTML = listings.length
    ? listings.map(createListingCard).join("")
    : `<div class="w-full h-fit flex justify-center items-center p-10">
         <p class='text-gray-700 text-p'>No listings found.</p>
       </div>`;
}
