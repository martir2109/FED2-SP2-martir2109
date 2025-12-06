/**
 * Create the footer HTML.
 * @returns {string} The HTML for footer.
 */
function createFooter(): string {
  return `<div class="w-full h-fit bg-primary text-white overflow-hidden flex flex-col justify-center mt-10">
        <div class="w-full h-fit flex flex-col sm:place-items-start items-center sm:flex-row justify-center gap-10 sm:gap-[10%] leading-[50px]">
          <div class="mt-[50px] w-70 bg-primary h-[200px] sm:h-[300px]">
            <h2 class="font-bold text-h3">Customer service</h2>
            <div class="break-normal no-underline">
              <a href="/footer-links/about/index.html">
                <p class="text-p">About</p>
              </a>
              <a href="/footer-links/privacy-policy/index.html">
                <p class="text-p">Privacy Policy</p>
              </a>
               <a href="/footer-links/terms-of-service/index.html">
                <p class="text-p">Terms of service</p>
              </a>
            </div>
          </div>
          <div class="mt-2.5 sm:mt-[50px] w-70 bg-primary h-[200px] sm:h-[300px]">
            <h2 class="font-bold text-h3">Contact</h2>
            <div class="break-normal no-underline">
              <p class="text-p">Email: auctionhouse@gmail.com</p>
              <p class="text-p">phone: +47 12 34 56 78</p>
            </div>
          </div>
        </div>
  
        <div class="w-full flex flex-col gap-[50px] justify-center items-center p-5">
          <div class="w-full flex justify-center mt-5 sm:mt-2.5">
            <img
              src="/assets/logo/logo-with-text-without-background.png"
              alt="Auction House logo"
              class="w-[150px] xs:w-[200px] h-auto"
            />
          </div>
  
          <p class="text-p text-center">© 2025 Auction house | All rights reserved</p>
        </div>
      </div>`;
}

/**
 * Load the footer HTML into the existing #footer-container element on the page.
 */
function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);
