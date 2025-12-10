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
      <div class="min-h-screen w-[90%] flex flex-col justify-center">
        <h1 class="text-landing font-bold text-center">
          Welcome to House Auction!
        </h1>
        <div class="w-full h-fit py-10 px-2 sm:p-10">
          <p class="text-h3 text-center mb-10">
            To bid and create auction listings, please log in or register
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row w-full h-fit gap-4 justify-center items-center"
        >
          <a
            href="/auth/login/index.html"
            class="text-center w-full max-w-[300px] h-[63px] flex justify-center items-center bg-primary text-white rounded-full text-h2 hover:bg-white hover:text-primary border border-bg-primary"
            >Login</a
          >
          <a
            href="/auth/register/index.html"
            class="text-center w-full max-w-[300px] h-[63px] flex justify-center items-center bg-primary text-white rounded-full text-h2 hover:bg-white hover:text-primary border border-bg-primary"
            >Register</a
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
        class="h-[50px] w-[80%] xs:w-[302px] -mt-4 justify-center items-center flex bg-green text-white border-bg-green border hover:border-bg-green hover:bg-white hover:text-black font-bold text-center text-h3 rounded-full"
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
