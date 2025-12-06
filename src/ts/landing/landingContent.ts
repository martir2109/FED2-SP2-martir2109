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
      <div class="min-h-screen flex flex-col justify-center">
        <h1 class="text-landing font-bold text-center">
          Welcome to House Auction!
        </h1>
        <div class="w-full h-fit p-10">
          <p class="text-h3 text-center mb-10">
            To bid and create auction listings, please log in or register
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row w-full px-10 gap-5 justify-center"
        >
          <a
            href="/auth/login/index.html"
            class="text-center bg-primary text-white px-20 py-2 rounded-full text-h2 hover:bg-white hover:text-primary border border-bg-primary"
            >Login</a
          >
          <a
            href="/auth/register/index.html"
            class="text-center bg-primary text-white px-20 py-2 rounded-full text-h2 hover:bg-white hover:text-primary border border-bg-primary"
            >Register</a
          >
        </div>
      </div>
        <div class="w-[90%] sm:w-[80%] h-fit mt-2">
        <h2 class="text-h2 font-bold text-left">Browse listings</h2>
      </div>
    <div
        class="w-[90%] sm:w-[80%] flex justify-between gap-2 md:flex-row flex-col mt-6 mb-6"
      >
     
        <div class="flex flex-col gap-2 md:w-full md:max-w-[48%] h-[100px]">
          <label class="text-label">Search by title</label>
          <input
            id="search-title"
            placeholder="Search by title"
            aria-label="Search"
            class="sm:h-[63px] h-[50px] bg-white w-full p-2 border border-grey rounded-md"
          />
        </div>

        <div class="flex flex-col gap-2 md:w-full md:max-w-[48%] h-[100px]">
          <label class="text-label">Filter by tags</label>
          <input
            id="filter-tags"
            placeholder="Enter tags (comma seperated)"
            aria-label="Search"
            class="sm:h-[63px] h-[50px] bg-white w-full p-2 border border-grey rounded-md"
          />
        </div>
      </div>

      <div class="w-[90%] sm:w-[80%] bg-white h-fit rounded-[20px]">
        <div class="listings-container w-full h-fit">
          <div
            id="listing-container"
            class="w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 p-5"
          ></div>
        </div>
        <div id="pagination" class="flex justify-center gap-4 my-6"></div>
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
      class="mt-24 w-full h-fit flex flex-col items-center justify-center mb-20 bg-background gap-8"
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
        class="sm:h-[63px] h-[50px] w-[90%] xs:w-[302px] justify-center items-center flex bg-green text-white border-bg-green border hover:border-bg-green hover:bg-white hover:text-black font-bold text-center text-h3 rounded-full mt-4"
      >
        <h1>+ Create listing</h1>
      </a>
      <div
        class="w-[90%] sm:w-[80%] flex justify-between gap-2 md:flex-row flex-col mt-4"
      >
        <div class="flex flex-col gap-2 md:w-full md:max-w-[48%] h-[100px]">
          <label class="text-label">Search by title</label>
          <input
            id="search-title"
            placeholder="Search by title"
            aria-label="Search"
            class="sm:h-[63px] h-[50px] bg-white w-full p-2 border border-grey rounded-md"
          />
        </div>

        <div class="flex flex-col gap-2 md:w-full md:max-w-[48%] h-[100px]">
          <label class="text-label">Filter by tags</label>
          <input
            id="filter-tags"
            placeholder="Enter tags (comma seperated)"
            aria-label="Search"
            class="sm:h-[63px] h-[50px] bg-white w-full p-2 border border-grey rounded-md"
          />
        </div>
      </div>

      <div class="w-[90%] sm:w-[80%] h-fit">
        <h2 class="text-h2 font-bold text-left">Active listings</h2>
      </div>
      <div class="w-[90%] sm:w-[80%] bg-white h-fit rounded-[20px]">
        <div class="listings-container w-full h-fit">
          <div
            id="listing-container"
            class="w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-5 p-5"
          ></div>
        </div>
        <div id="pagination" class="flex justify-center gap-4 my-6"></div>
      </div>
    </section>
      `;
}
