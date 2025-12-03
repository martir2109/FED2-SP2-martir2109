/** Formats listing date and time. */
import { formatDateTime } from "../utils.ts";

/**
 * Represents a listing object
 */
interface Listing {
  id: string;
  title?: string;
  description?: string;
  endsAt: string;
  created: string;
  media?: { url: string }[];
  seller?: { name?: string };
  bids?: { amount: number | string }[];
  _count?: { bids: number };
}

export function displayRecentListings(data: Listing[]) {
  const listingsContainer = document.getElementById("listing-container");
  if (!listingsContainer) return;

  if (data.length === 0) {
    let message = "No listings found.";

    const searchInput = (
      document.getElementById("search-title") as HTMLInputElement
    )?.value.trim();
    const tagsInput = (
      document.getElementById("filter-tags") as HTMLInputElement
    )?.value.trim();

    if (searchInput && !tagsInput) {
      message = `No listings found matching your search: "${searchInput}".`;
    } else if (!searchInput && tagsInput) {
      message = `No listings found with the tags: "${tagsInput}".`;
    } else if (searchInput && tagsInput) {
      message = `No listings found matching your search "${searchInput}" and tags "${tagsInput}".`;
    }

    listingsContainer.innerHTML = `
      <div class="landingpage-message-container w-full text-center py-10">
        <p class="landingpage-listing-message text-gray-500 text-p italic">
          ${message}
        </p>
      </div>
    `;
    return;
  }

  listingsContainer.innerHTML = data
    .map(
      (listing) => `
    <a
      href="/listing/view/index.html?id=${listing.id}"
      class="bg-white w-max-[200px] w-full min-h-[500px] h-fit rounded-xl border border-gray-300 p-4 flex flex-col gap-4 hover:shadow-xl/30 hover:-translate-y-2 transition transform duration-300 ease"
    >
      <h3 class="text-h2 font-bold">
        ${listing.title ? listing.title.substring(0, 15) + "..." : "No title"}
      </h3>
      ${
        listing.media && listing.media.length > 0
          ? `<img
        src="${listing.media[0].url}"
        alt="Listing media"
        class="w-full h-full aspect-square object-cover rounded-[10px]"
        loading="lazy"
      />`
          : `<img
        src="/assets/images/default-image.jpg"
        class="w-full h-full aspect-square object-cover border border-grey rounded-[10px]"
        loading="lazy"
      />`
      }
      <p class="text-p break-all">
        <strong>Seller: </strong> ${listing.seller?.name || "Unknown seller"}
      </p>
      <p class="wrap-break-word w-full h-[50px] text-p">
        ${
          listing.description
            ? listing.description.substring(0, 50) + "..."
            : ""
        }
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

      <p><strong>Ends at:</strong> ${formatDateTime(listing.endsAt)}</p>

      <p class="text-gray-500">
        <strong>Created:</strong> ${formatDateTime(listing.created)}
      </p>
      <div
        class="bg-primary text-white px-6 py-2 rounded-[10px] text-h2 hover:bg-white hover:text-primary border border-bg-primary inline-block text-center cursor-pointer"
      >
        View listing
      </div>
    </a>
    `,
    )
    .join("");
}
