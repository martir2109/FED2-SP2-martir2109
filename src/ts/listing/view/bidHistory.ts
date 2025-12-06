import { formatDateTime } from "../../utils.ts";

/**
 * Renders the bid history for a listing inside the DOM.
 * Updates the listing-bid-history element with bid details including bidder name, date, amount, total bids and highest bid.
 * If there are no bids, it displays "No bids yet" message.
 *
 * @param {any[]} data - An array containing the listing object, each with a bids array.
 */
export function displayListingBidHistory(data: any[]): void {
  const listingBidHistory = document.getElementById("listing-bid-history");
  if (!listingBidHistory || !data.length) return;

  listingBidHistory.innerHTML = data
    .map((listing: any) => {
      const bids = listing.bids || [];

      return `
        <div class="flex flex-col gap-4 w-full h-fit">
          <h3 class="font-bold text-h3">Bid history</h3>

          ${
            bids.length > 0
              ? bids
                  .map(
                    (bid: any) => `
              <div class="w-full h-fit p-4 xs:p-2 rounded-[50px] bg-background flex flex-col sm:flex-row items-center justify-between">
                <p class="w-full max-w-[200px] h-fit break-all text-center sm:text-left justify-center sm:justify-start">${bid.bidder?.name || "Unknown"}</p>
                <p class="w-full max-w-[200px] h-fit flex justify-center">${formatDateTime(bid.created)}</p>
                <p class="w-full max-w-[200px] h-fit flex font-bold justify-center sm:justify-end">${bid.amount} credits</p>
              </div>
            `,
                  )
                  .join("")
              : "<p>No bids yet.</p>"
          }

          <div>
            <p><strong>Total bids:</strong> ${listing._count?.bids ?? 0}</p>
            <p><strong>Highest bid:</strong> ${
              bids.length > 0
                ? Math.max(...bids.map((bid: any) => Number(bid.amount)))
                : 0
            } credits</p>
          </div>
        </div>
      `;
    })
    .join("");
}
