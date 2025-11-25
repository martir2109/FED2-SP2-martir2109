import {
  getUserProfileElements,
  loadUserProfileData,
} from "../ts/profile/profileUtils";

/**
 * Show error message below an input field.
 * @param {string} inputId - The ID of the input field.
 * @param {string} message - The error message to display.
 */
export function showError(inputId: string, message: string) {
  const input = document.getElementById(inputId)!;
  const errorSpan = document.getElementById(`${inputId}-error`)!;
  const infoText = document.getElementById("info-text")!;

  if (input && errorSpan) {
    input.classList.add("input-error");
    errorSpan.textContent = message;
    input.classList.add("border-danger");
    input.classList.remove("border-gray-300");
    if (infoText) infoText.remove();
  }
}

/**
 * Clear the error message for a given input.
 * @param {string} inputId - The ID of the input field
 */
export function clearError(inputId: string) {
  const input = document.getElementById(inputId)!;
  const errorSpan = document.getElementById(`${inputId}-error`)!;

  if (input && errorSpan) {
    input.classList.remove("input-error");
    input.classList.remove("border-danger");
    input.classList.add("border-gray-300");
    errorSpan.textContent = "";
  }
}

/**
 * Toggle password visibility on the password input.
 */
export function togglePassword() {
  const passwordInput =
    (document.getElementById("password") as HTMLInputElement) || null;
  const checkbox =
    (document.getElementById("show-password") as HTMLInputElement) || null;

  if (checkbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

/**
 * Attach event listeners to input fields to clear error messages.
 * Clears the error when the field is focused or when the user types.
 *
 * @param {string[]} inputSelectors - Array of CSS selectors for input elements.
 */
export function attachInputListeners(inputSelectors: string[]) {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    inputSelectors.join(", "),
  );

  inputs.forEach((input) => {
    input.addEventListener("focus", () => clearError(input.id));

    input.addEventListener("input", () => {
      if (input.value.trim()) clearError(input.id);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachInputListeners(["#name", "#email", "#password"]);
});

/**
 * Retrive authentication credentials from localStorage
 * @returns {{accessToken: string|null, apiKey: string|null}}
 * An object containing the user's access token and API key, or null values if not found.
 */
export function getAuthenticationCredentials() {
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  return { accessToken, apiKey };
}

/**
 * Retrives the stored username from localStorage.
 * If no username is stored it defaults to "User".
 * @returns {object} An object containting the username.
 */
export function getUserName() {
  const userName = localStorage.getItem("userName") || "User";
  return { userName };
}

/**
 * Retrives the stored user data from localStorage.
 * @returns {object} An object containgt the raw user data string.
 */
export function getUser() {
  const userDataString = localStorage.getItem("user");
  return { userDataString };
}

export function formatDateTime(dateString?: string) {
  return dateString
    ? new Date(dateString).toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";
}

export async function retriveUserCredits() {
  const { credits } = getUserProfileElements();
  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

  try {
    const userProfile = await loadUserProfileData(
      accessToken,
      apiKey,
      userName,
    );

    if (credits) {
      credits.textContent = userProfile.credits || "0";
    }
  } catch (error) {
    console.error("Error loading user credits:", error);
  }
}
