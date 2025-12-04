import { togglePassword, showError, clearError } from "../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_content,
} from "../apiConfig.ts";

/**
 * Registers a new user with name, email, and password.
 * @param {{name: string, email: string, password: string}} credentials - The user's registration info.
 * @returns {Promise<Object>} Returns the registration response data.
 * @throws {Error} Throws an error if registration fails.
 */
async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
    {
      method: "POST",
      headers: API_Headers_content(),
      body: JSON.stringify({ name, email, password, venueManager: false }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.errors?.[0]?.message || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Handles register form submission.
 * Validates the name, email, and password inputs and calls the register function.
 * @param {SubmitEvent} event - The form submission event.
 */
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = (
      document.getElementById("name") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    let hasError = false;

    if (!name) {
      showError("name", "Name cannot be empty.");
      hasError = true;
    } else if (!/^[\w]+$/.test(name)) {
      showError(
        "name",
        "The name value must not contain punctuation symbols apart from underscore (_).",
      );
      hasError = true;
    } else {
      clearError("name");
    }

    if (!email) {
      showError("email", "Email cannot be empty.");
      hasError = true;
    } else if (!/^[\w.-]+@(stud\.)?noroff\.no$/.test(email)) {
      showError(
        "email",
        "Invalid email format. Email must be a stud.noroff.no address.",
      );
      hasError = true;
    } else {
      clearError("email");
    }

    if (!password) {
      showError("password", "Password cannot be empty.");
      hasError = true;
    } else if (password.length < 8) {
      showError("password", "Password must be at least 8 characters long.");
      hasError = true;
    } else {
      clearError("password");
    }

    if (hasError) return;

    try {
      await register({ name, email, password });

      const messageContainer = document.getElementById("message-container");
      if (messageContainer) {
        messageContainer.innerHTML = `
          <div class="flex gap-2 bg-green-300 text-green-950 w-full p-2 rounded items-center mt-2">
            <i class="bi bi-check-circle-fill text-green-950"></i>
            <p class="m-0 text-sm">User registered successfully!</p>
          </div>
        `;

        setTimeout(() => {
          messageContainer.innerHTML = "";
          window.location.href = "/auth/login/index.html";
        }, 3000);
        return;
      }
    } catch (error: any) {
      const messageContainer = document.getElementById("message-container");
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (messageContainer) {
        messageContainer.innerHTML = `
          <div class="flex gap-2 bg-red-200 text-red-950 w-full p-2 rounded items-center mt-2">
            <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
            <p class="m-0 text-sm">${errorMessage}</p>
          </div>
        `;
        setTimeout(() => {
          messageContainer.innerHTML = "";
        }, 3000);
        return;
      }
    }
  });
} else {
  const messageDiv = document.createElement("div");
  messageDiv.className =
    "fixed top-4 left-1/2 z-[9999] bg-red-200 text-red-950 px-6 py-4 rounded shadow-lg flex gap-2 items-center -translate-x-1/2 sm:w-full w-[90%] max-w-[400px] mt-20";
  messageDiv.innerHTML = `
  <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
  <p class="m-0">Error: Register form not found on this page.</p>
  `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

/**
 * Toggles password visibility when checkbox is changed.
 * @param {Event} event - The change event from the checkbox
 */
const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}
