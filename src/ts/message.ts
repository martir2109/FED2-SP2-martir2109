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
