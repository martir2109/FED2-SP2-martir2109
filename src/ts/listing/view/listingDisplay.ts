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

  const mediaItems = listing.media || [];
  const mainImageUrl = mediaItems[0]?.url || "/assets/images/default-image.jpg";
  const mainImageAlt = mediaItems[0]?.alt || "Listing image";

  viewListing.innerHTML = `
  <div class="w-full flex flex-col justify-between p-2  rounded-[10px]">
    <div class="w-full max-w-[550px] h-auto aspect-square bg-gray-300 rounded-[10px] flex items-center justify-center animate-pulse">
      <img 
        id="main-image"
        src="${mainImageUrl}" 
        alt="${mainImageAlt}" 
        class="w-full h-full object-cover rounded-[10px] border-2 border-gray-300"
        onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-300')">
    </div>

    <div class="w-full max-w-[550px] flex gap-2 flex-wrap justify-start mt-2">
      ${mediaItems
        .map(
          (mediaItem: any, index: number) => `
        <div class="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border border-gray-400">
          <img 
            src="${mediaItem.url}" 
            alt="${mediaItem.alt}" 
            class="w-full h-full object-cover"
            data-index="${index}">
        </div>
      `,
        )
        .join("")}
      </div>
        </div>
      
  <div class="w-full max-w-[550px] p-2 flex flex-col gap-10 md:gap-2 justify-between ">
      <div class="w-full h-fit flex flex-col gap-4">  
      <h3 class="text-h2 font-bold">${listing.title || "No title"}</h3>
        <p class="text-p break-all"><strong>Seller: </strong>  ${
          listing.seller
            ? isLoggedIn
              ? `<a href="../../profile/index.html?id=${listing.seller.name}" class="text-blue-500 hover:underline">${listing.seller.name}</a>`
              : `${listing.seller.name}`
            : "Unknown seller"
        }</p>
        <div class="w-full h-fit gap-2 flex flex-wrap justify-start">
     ${listing.tags
       .map(
         (tag) => `
        <p class="wrap-break-word text-p bg-gray-200 px-2 rounded-full w-fit h-fit border border-gray-500">
      ${tag}
       </p>
      `,
       )
       .join("")}
    </div>
        </div>
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

  const mainImageElement = document.getElementById(
    "main-image",
  ) as HTMLImageElement;

  const thumbnailImageElements =
    viewListing.querySelectorAll<HTMLImageElement>(".flex-wrap img");

  thumbnailImageElements.forEach((thumbnailElement) => {
    thumbnailElement.addEventListener("click", () => {
      mainImageElement.src = thumbnailElement.src;
      mainImageElement.alt = thumbnailElement.alt;
    });
  });

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
