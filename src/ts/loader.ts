/* Loader: https://flowbite.com/docs/components/spinner/ */
/**
 * Generates the HTML content for the loader.

 * @returns {string} HTML content as a string
 */
function createLoader(): string {
  return `
  <div class="fixed inset-0 flex items-center justify-center bg-gray-100 z-9999 opacity-100 transition-opacity duration-500 ">
     <div
      class="inline-flex gap-4 items-center text-btn bg-white border border-gray-400 font-bold leading-5 rounded-full px-6 py-3 shadow-xl inset-shadow-sm"
    >
    <div
  class="w-9 h-9 border-5 border-t-blue-500 border-gray-300 rounded-full animate-spin"
></div>
       Loading...
    </div>
    </div>`;
}

const loaderContainer = document.getElementById(
  "loader-container",
) as HTMLDivElement;

if (loaderContainer) {
  loaderContainer.innerHTML = createLoader();
}

/**
 * Removes the loader once the window finished loading.
 */
window.addEventListener("load", () => {
  if (!loaderContainer) return;

  loaderContainer.classList.add("loaderHidden");

  loaderContainer.addEventListener("transitionend", () => {
    loaderContainer.remove();
  });
});
