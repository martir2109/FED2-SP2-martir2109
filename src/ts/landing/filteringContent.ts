/**
 *  Generates the HTML content for the filtering input fields and active listing toggle.
 *  Toggle component: https://uiverse.io/Javierrocadev/old-swan-52
 *
 * @returns {string} HTML content as a string
 */
export function createFilteringContent(): string {
  return `
    <div class="w-full h-fit justify-start flex">
      <h2 class="text-h2 font-bold text-left">Browse listings</h2>
    </div>
    <div class="w-full h-fit bg-white flex flex-col gap-4 p-4 rounded-md -mt-2">
      <div class="w-full flex justify-between sm:flex-row flex-col gap-4">
        <div class="flex flex-col gap-2 w-full h-fit">
          <label class="text-label">Search by title</label>
          <input
            id="search-title"
            placeholder="Search by title"
            aria-label="Search"
            class="h-[50px] w-full p-2 border border-grey rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-2 w-full h-fit">
          <label class="text-label">Filter listings by tags or categories</label>
          <input
            id="filter-tags"
            placeholder="Enter tags or categories (comma separated)"
            aria-label="Search"
            class="h-[50px] w-full p-2 border border-grey rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div
        class="flex w-full xm:justify-between xm:flex-row flex-col justify-start xm:gap-0 gap-4"
      >
        <div
          class="w-full h-fit flex xxs:items-center gap-2 flex-col xxs:flex-row"
        >
          <div>
            <label
              class="relative inline-flex items-center cursor-pointer gap-2"
            >
              <input type="checkbox" class="sr-only peer" id="active-toggle" checked/>
              <div
                class="group peer ring-0 bg-gray-400 rounded-full outline-none duration-300 after:duration-300
                 w-22 h-10 shadow-md peer-checked:bg-green peer-focus:outline-none after:content-['✖️'] 
                 after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-8 after:w-8 
                 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center 
                 peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0"
              ></div>
            </label>
          </div>
          <div>
            <p class="break-all">Show active listings only</p>
          </div>
        </div>
        <div class="z-10 relative w-[90%] max-w-[200px]">
          <details>
            <summary
              class="flex items-center justify-between cursor-pointer bg-gray-200 border border-gray-300 h-[50px] px-2 rounded-lg select-none relative z-10"
            >
              <span id="sort-label">Newest to oldest</span>

              <i
                class="bi bi-arrow-down-short text-xl transition-transform duration-200"
              ></i>
              <i
                class="bi bi-arrow-up-short text-xl transition-transform duration-200"
              ></i>
            </summary>

            <div
              class="mt-1 bg-white border border-gray-300 rounded-lg p-2 flex flex-col gap-2 absolute right-0 max-w-[200px] w-full text-left top-full shadow-2xl"
            >
              <button
                id="newest-first"
                onclick="sortListings('newest')"
                class="hover:bg-gray-300 cursor-pointer p-2 rounded text-left"
              >
                Newest to oldest
              </button>
              <button
                id="oldest-first"
                onclick="sortListings('oldest')"
                class="hover:bg-gray-300 p-2 cursor-pointer rounded text-left"
              >
                Oldest to newest
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
    `;
}
