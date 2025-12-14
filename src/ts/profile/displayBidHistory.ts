import { formatDateTime, Listing } from "../utils.ts";

export function displayBidOnListings(
  bidOnContainer: HTMLElement | null,
  listing: Listing[],
) {
  if (!bidOnContainer) return;

  const currentTime = new Date();

  bidOnContainer.innerHTML = listing.length
    ? listing
        .map((listing) => {
          const listingEndTime = new Date(listing.endsAt);

          return `
        <a
        href="/listing/view/index.html?id=${listing.id}"
        class="bg-white w-max-[200px] w-full min-h-[500px] h-fit rounded-xl border border-gray-300 flex flex-col gap-4 hover:shadow-xl/30 hover:-translate-y-2 transition transform duration-300 ease"
      >
       
        ${
          listing.media && listing.media.length > 0
            ? `<div class="w-full aspect-square rounded-t-[10px] bg-background flex items-center justify-center animate-pulse">
          <img
            src="${listing.media[0].url}"
            alt="Listing media"
            class="w-full h-full aspect-square object-cover rounded-t-[10px]"
            onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-200')"
          />
        </div>`
            : `<div class="w-full aspect-square bg-gray-300 rounded-t-[10px] flex items-center justify-center animate-pulse">
          <img
            src="/assets/images/default-image.jpg"
            class="w-full h-full aspect-square object-cover border border-grey rounded-t-[10px]"
            onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-200')"/>
        </div>`
        }
        <div class="p-4 flex flex-col gap-4">
         <h3 class="text-h3 font-bold break-all">
          ${listing.title ? listing.title.substring(0, 20) + "..." : "No title"}
        </h3>
        
        <p class="wrap-break-word w-full h-[50px] text-p">
          ${
            listing.description
              ? listing.description.substring(0, 50) + "..."
              : ""
          }
        </p>
        <p>
       <strong>Your highest bid:</strong> ${listing.userBidAmount ?? 0} credits
        </p>
  
         <div class="flex flex-col xs:flex-row justify-center items-center gap-2">
           ${
             currentTime >= listingEndTime
               ? `<p class="bg-red-200 border border-red-400 text-red-950 py-2 rounded-full text-center font-bold w-full">
                  Listing has ended!
                </p>`
               : `<p class="bg-gray-100 border border-gray-300 py-2 rounded-full text-center w-full">
                  <strong>Ends at:</strong> ${formatDateTime(listing.endsAt)}
                </p>`
           }
        </div>
        
        <div
          class="bg-primary text-white px-6 py-2 rounded-full text-h3 xs:text-h2 hover:bg-white hover:text-primary border border-bg-primary inline-block text-center cursor-pointer"
        >
          View listing
        </div>
  </div>
  
      </a>
      `;
        })
        .join("")
    : `<div class="w-full h-fit flex justify-center items-center p-10"> <p class='text-gray-700 text-p'>No listings found. </p> </div>`;
}
