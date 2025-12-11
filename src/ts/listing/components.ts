/**
 * Adds the ability to dynamically add new image url and alt input field to the form.
 * Set a max of 3 image urls.
 * Hides the "add-image-btn" if the maximum of 3 has been reached.
 * Updated the button visibility automatically when images are removed.
 *
 * @param {number} initialCount - The number of images url that already exist on the page.
 * @param {number} maxImages - The maximum number of images that are allowed.
 */
export function addImageContent(
  initialCount: number = 1,
  maxImages: number = 3,
) {
  const extraImagesContainer = document.getElementById(
    "extra-images",
  ) as HTMLDivElement;
  const addImageBtn = document.getElementById(
    "add-image-btn",
  ) as HTMLButtonElement;

  let imageCount = initialCount;

  function updateButtonVisibility() {
    if (imageCount >= maxImages) {
      addImageBtn.style.display = "none";
    } else {
      addImageBtn.style.display = "block";
    }
  }

  addImageBtn.addEventListener("click", () => {
    if (imageCount >= maxImages) return;

    imageCount++;

    updateButtonVisibility();

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <div class="flex flex-col gap-2">
          <p>Image: ${imageCount}</p>
          <input
            type="url"
            class="extra-media h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Additional image URL"
          />
          <input
            type="text"
            class="extra-alt h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="ALT text for this image"
          />
          <div class="w-full h-fit flex justify-end">
            <button type="button"
              class="remove-image-btn py-2 px-4 rounded-full cursor-pointer h-full flex justify-center items-center border border-danger bg-danger text-white hover:bg-white hover:text-black hover:border-black"
            >Remove image</button>
          </div>
        </div>
      `;

    const removeBtn = wrapper.querySelector(
      ".remove-image-btn",
    ) as HTMLButtonElement;
    removeBtn.addEventListener("click", () => {
      wrapper.remove();
      imageCount--;
      updateButtonVisibility();
    });

    extraImagesContainer.appendChild(wrapper);
    updateButtonVisibility();
  });
}

/**
 * Adds the exisitg image input fields to the form with pre-filled values.
 * - Includes URL and Alt input fields.
 * - Adds a remove button for the image.
 *
 * @param {{url: string, alt?: string}} mediaItem - An object for the image.
 * @param {number} index - The number displaying what number the image are.
 */
export function addExistingImage(
  mediaItem: { url: string; alt?: string },
  index: number,
) {
  const extraImagesContainer = document.getElementById(
    "extra-images",
  ) as HTMLDivElement;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
        <div class="flex flex-col gap-2">
          <p>Image: ${index}</p>
    
          <input
            type="url"
            class="extra-media h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value="${mediaItem.url}"
            placeholder="Additional image URL"
          />
    
          <input
            type="text"
            class="extra-alt h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value="${mediaItem.alt || ""}"
            placeholder="ALT text for this image"
          />
    
          <div class="w-full h-fit flex justify-end">
            <button type="button"
              class="remove-image-btn py-2 px-4 rounded-full cursor-pointer h-full flex justify-center items-center border border-danger bg-danger text-white hover:bg-white hover:text-black hover:border-black">
              Remove image
            </button>
          </div>
        </div>
      `;

  const removeBtn = wrapper.querySelector(
    ".remove-image-btn",
  ) as HTMLButtonElement;
  removeBtn.addEventListener("click", () => {
    wrapper.remove();
  });

  extraImagesContainer.appendChild(wrapper);
}
