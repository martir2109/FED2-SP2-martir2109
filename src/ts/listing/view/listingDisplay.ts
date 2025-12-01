import { formatDateTime } from "../../utils.ts";
import { isUserLoggedIn } from "./view.ts";

const currentUserRaw = JSON.parse(localStorage.getItem("user") ?? "{}");
const currentUser = currentUserRaw.data || currentUserRaw;
const currentUserName =
  currentUser.name || currentUser.username || currentUser.email || "user";
const isLoggedIn = isUserLoggedIn();

/**
 * Renders the main listing content.
 * Updates the bid section visibility based on wheter the user is the seller.
 * Updates the edit button link and hides it if the current user is not the seller.
 *
 * @param {any[]} data - An array containing the listing object.
 * @returns {void} This function does not return a value. It updates the DOM directly.
 */
export function displayListing(data: any[]): void {
  const viewListing = document.getElementById("view-listing");
  const bidSection = document.getElementById("bid-on-listing");

  if (!viewListing || !data.length) return;
  const listing = data[0];

  if (bidSection) {
    if (!listing.seller || listing.seller.name === currentUserName) {
      bidSection.style.display = "none";
    } else {
      bidSection.style.display = "flex";
    }
  }

  viewListing.innerHTML = `
    <div class="w-full h-fit flex justify-center">
      ${
        listing.media && listing.media.length > 0
          ? `<img src="${listing.media[0].url}" alt="Listing media" class="w-full max-w-[550px] h-auto aspect-square object-cover rounded-[10px]" loading="lazy">`
          : `<img src="../../assets/images/default-image.jpg" class="w-full max-w-[550px] h-full aspect-square object-cover border border-grey rounded-[10px]" loading="lazy">`
      }
      </div>
      <div class="w-full max-w-[550px] p-2 md:p-10 flex flex-col gap-10 md:gap-2  justify-between mt-6">
        <h3 class="text-h2 font-bold">${listing.title || "No title"}</h3>
        <p class="text-p break-all"><strong>Seller: </strong>  ${
          listing.seller
            ? isLoggedIn
              ? `<a href="../../profile/index.html?id=${listing.seller.name}" class="text-blue-500 hover:underline">${listing.seller.name}</a>`
              : `${listing.seller.name}`
            : "Unknown seller"
        }</p>
        <div class="flex flex-col gap-2">
          <p class="wrap-break-word w-full h-fit text-p font-bold">Description: </p>
          <p class="bg-background p-2 rounded-md h-fit w-full">${listing.description || "No description."}</p>
        </div>
        <div class="flex flex-col gap-2">
          <p><strong>Ends at:</strong> ${formatDateTime(listing.endsAt)}</p>
          <p class="text-gray-500"><strong>Created:</strong> ${formatDateTime(listing.created)}</p>
          <p class="text-gray-500"><strong>Updated:</strong> ${formatDateTime(listing.updated)}</p>
        </div>
      </div>
    `;

  const editButton = document.getElementById(
    "edit-listing",
  ) as HTMLAnchorElement | null;
  if (editButton) {
    const listing = data[0];
    editButton.href = `../../listing/edit/index.html?id=${listing.id}`;

    if (!listing.seller || listing.seller.name !== currentUserName) {
      editButton.style.display = "none";
    }
  }
}
