/**
 * Generates the HTML content for viewing a listing for when the user is logged out.
 *
 * @returns {string} HTML content as a string
 */
export function createLoggedOutContent(): string {
  return `    
              <div id="listing-container" class="max-w-[1144px] w-full h-fit flex flex-col gap-8 items-center">
         
            <div id="view-listing" class="w-full h-fit flex p-8 justify-between bg-white rounded-md "></div>
             <div id="listing-bid-history" class="bg-white rounded-md p-8 flex w-[90%]  sm:w-full h-fit"></div>
            </div>
          `;
}

/**
 * Generates the HTML content for viewing a listing for when the user is logged in.
 * Includes section for displaying credits and placing a bid.
 *
 * @returns {string} HTML content as a string
 */
export function createLoggedInContent(): string {
  return `
    <div id="listing-container" class="max-w-[1144px] w-full h-fit flex flex-col gap-8 items-center">
     <div class="w-[90%] md:w-full h-fit flex justify-end">
            <div
              class="bg-black py-2 px-4 flex gap-2 justify-center items-center rounded-[50px] text-white h-fit"
            >
              <p id="credits">0</p>
              <p>Credits</p>
            </div>
          </div>
           <a href="#" id="edit-listing">
           <p class="h-[63px] sm:w-[302px] w-[90%] py-5.5 bg-blue text-white font-bold text-center text-btn rounded-[50px] hover:bg-white hover:text-black hover:border-black border border-blue cursor-pointer"
  >Edit listing</p>
            </a>
            <div id="view-listing" class="w-[90%] md:w-full h-fit flex flex-col md:flex-row p-8 justify-between bg-white rounded-md"></div>
             <div id="listing-bid-history" class="bg-white rounded-md p-8 flex w-[90%] md:w-full h-fit"></div>
            
          <section class="w-full h-fit flex flex-col items-center">
             <div id="bid-on-listing" class="rounded-md gap-4 flex flex-col bg-white p-8 w-full max-w-[434px] h-fit">
            <h3 class="font-bold text-h3">Place a bid</h3>
            <label>Bid amount</label>
            <div class="flex w-full h-fit justify-between items-center gap-2">
            <input id="place-bid-input" placeholder="0" class="h-[63px] w-full rounded-md border border-gray-300 bg-white p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <p class="font-bold text-p">Credits</p>
            </div>
            <button id="place-bid-btn" 
            class="mt-4 h-[63px] w-full py-5.5 bg-blue text-white font-bold text-center text-btn rounded-[50px] hover:bg-white hover:text-black hover:border-black border border-blue cursor-pointer">
            Place bid
            </button>
            </div>
            </section>
  
            </div>
          `;
}
