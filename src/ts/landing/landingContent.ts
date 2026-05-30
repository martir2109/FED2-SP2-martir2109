import { createFilteringContent } from "./filteringContent";

/**
 * Generates the HTML content for the landing page when the user is logged out.
 *
 * @returns {string} HTML content as a string
 */
export function createLoggedOutContent(): string {
  return `
        <section
      class="mt-4 w-full min-h-screen flex flex-col items-center justify-center"
    >
      <div
      class="min-h-screen w-full flex flex-col justify-center items-center bg-background px-8 py-16 font-sans"
    >
      <p
        class="text-md tracking-widest uppercase text-secondary font-semibold mb-3"
      >
        Auction House
      </p>

      <h1 class="text-landing font-bold text-center text-primary leading-tight">
        Discover listings, <br />
        place your bid
      </h1>

      <div class="w-12 h-[3px] bg-secondary rounded-full my-5"></div>

      <p
        class="text-p text-center text-gray-800 max-w-sm leading-relaxed mb-10"
      >
        Bid on listings and create your own auctions. Log in or create a free
        account to get started.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <a
          href="/auth/register/index.html"
          class="text-center w-[180px] h-[52px] flex justify-center items-center bg-secondary text-primary border-2 border-secondary rounded-full text-h3 font-semibold hover:bg-background hover:border-[#c49040] transition-colors"
          >Register</a
        >

        <a
          href="/auth/login/index.html"
          class="text-center w-[180px] h-[52px] flex justify-center items-center bg-transparent text-primary border-2 border-primary rounded-full text-h3 font-semibold hover:bg-primary hover:text-white transition-colors"
          >Log in</a
        >
      </div>
    </div>

      <div
        class="w-[90%] sm:w-[80%] flex flex-col justify-center items-center gap-6"
      >
       
        <div class="w-full flex flex-col justify-center items-center gap-6">
          ${createFilteringContent()}
        </div>

        <div class="w-full bg-white h-fit rounded-[20px] mt-2">
          <div class="listings-container w-full h-fit">
            <div
              id="listing-container"
              class="w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 p-3 sm:p-5"
            ></div>
          </div>
          <div id="pagination" class="flex justify-center gap-4 my-6"></div>
        </div>
      </div>
    </section>
      `;
}

/**
 * Generates the HTML content for the landing page when the user is logged in.
 *
 * @returns {string} HTML content as a string
 */
export function createLoggedInContent(): string {
  return `
            <section
      class="mt-24 w-full h-fit flex flex-col items-center justify-center mb-20 bg-background gap-6"
    >
      <div class="w-[90%] sm:w-[80%] h-fit flex justify-end">
        <div
          class="bg-black py-2 px-4 flex gap-2 justify-center items-center rounded-[50px] text-white h-fit"
        >
          <p id="credits">0</p>
          <p>Credits</p>
        </div>
      </div>
      <a
        href="/listing/create/index.html"
        class="h-[50px] w-[80%] xs:w-[302px] sm:-mt-4 justify-center items-center flex bg-green text-white border-bg-green border hover:border-bg-green hover:bg-white hover:text-black font-bold text-center text-h3 rounded-full"
      >
        <h1>+ Create listing</h1>
      </a>
      
      <div
        class="w-[90%] sm:w-[80%] flex flex-col justify-center items-center gap-6"
      >
        ${createFilteringContent()}
      </div>

      <div
        class="w-[90%] sm:w-[80%] h-fit flex flex-col justify-center items-center gap-2 -mt-2"
      >
        
        <div class="w-full bg-white h-fit rounded-[20px]">
          <div class="listings-container w-full h-fit">
            <div
              id="listing-container"
              class="w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 p-3 sm:p-5"
            ></div>
          </div>
          <div id="pagination" class="flex justify-center gap-4 my-6"></div>
        </div>
      </div>
    </section>
      `;
}
