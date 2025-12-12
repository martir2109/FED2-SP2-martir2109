/**
 * Shows a success message.
 * @param {string} text - The message to display
 * @param {number} duration - How long to show it in milliseconds (default 5000)
 */
export function showSuccessMessage(text: string, duration: number) {
  const messageDiv = document.createElement("div") as HTMLDivElement;

  messageDiv.className = `
      fixed top-4 left-1/2 z-9999 bg-green-200 text-green-950 
      px-6 py-4 rounded shadow-lg flex gap-2 items-center 
      -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20
    `;

  messageDiv.innerHTML = `
      <i class="bi bi-check-circle-fill"></i>
      <p class="m-0">${text}</p>
    `;

  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), duration);
}

/**
 * Shows an error/failure message.
 * @param {string} text - The message to display
 * @param {number} duration - How long to show it in milliseconds (default 5000)
 */
export function showErrorMessage(text: string, duration: number) {
  const messageDiv = document.createElement("div") as HTMLDivElement;

  messageDiv.className = `
      fixed top-4 left-1/2 z-9999 bg-red-200 text-red-950 
      px-6 py-4 rounded shadow-lg flex gap-2 items-center 
      -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20
    `;

  messageDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill"></i>
      <p class="m-0">${text}</p>
    `;

  document.body.appendChild(messageDiv);

  setTimeout(() => messageDiv.remove(), duration);
}

/**
 * Shows an box where the user can click "cancel" or "yes" for deleteing lisitng.
 * @param {string} text - The message to display.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the user clicks "Yes", or `false` if the user clicks "Cancel".
 */
export function showConfirmMessage(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const messageDiv = document.createElement("div") as HTMLDivElement;

    messageDiv.className = `
        fixed top-4 left-1/2 z-[9999] bg-white text-black border border-gray-500
        px-6 py-4 rounded shadow-xl flex flex-col gap-4 items-center 
        -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20
      `;

    messageDiv.innerHTML = `
              <i class="bi bi-exclamation-triangle-fill text-danger text-h1"></i>

        <div class="flex gap-2 items-center text-danger w-full">
          <p class="m-0 font-semibold">${text}</p>
        </div>
  
        <div class="flex gap-4 justify-center w-full mt-4">
          <button id="confirm-no" 
            class="bg-gray-300 text-black cursor-pointer px-4 py-2 w-full max-w-[200px] rounded-full border border-gray-300 hover:border-gray-400 hover:bg-white">
            Cancel
          </button>

             <button id="confirm-yes" 
            class="bg-danger text-white px-4 py-2 cursor-pointer w-full max-w-[200px] rounded-full hover:bg-white hover:text-black border border-danger">
            Yes
          </button>
        </div>
      `;

    document.body.appendChild(messageDiv);

    messageDiv.querySelector("#confirm-yes")!.addEventListener("click", () => {
      messageDiv.remove();
      resolve(true);
    });

    messageDiv.querySelector("#confirm-no")!.addEventListener("click", () => {
      messageDiv.remove();
      resolve(false);
    });
  });
}
