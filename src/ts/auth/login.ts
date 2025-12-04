import { togglePassword, showError, clearError } from "../utils.ts";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_content,
} from "../apiConfig.ts";

/**
 * Log in a user with their email and password.
 * @param {{email: string, password: string}} credentials - The user's login info.
 * @returns {Promise<{token: string, user: any, userName: string}>} Login result with token and user info.
 * @throws {Error} If login fails.
 */

async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  token: any;
  user: any;
  userName: any;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: API_Headers_content(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const token = data.accessToken || data.data?.accessToken;
    const user = data.data || data;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    const userName = user.name || user.username || user.email;
    localStorage.setItem("userName", userName);

    return { token, user, userName };
  } catch (error) {
    throw error;
  }
}

/**
 * Handles login form submission.
 * @param {SubmitEvent} event - The form submission event.
 */

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    let hasError = false;

    if (!email.trim()) {
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
    } else {
      clearError("password");
    }

    if (hasError) return;

    try {
      const { token } = await login({ email, password });
      const apiKeyResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.CREATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (apiKeyResponse.ok) {
        const apiKeyData = await apiKeyResponse.json();
        localStorage.setItem("apiKey", apiKeyData.data.key);
      } else {
        const errorData = await apiKeyResponse.json();
        const messageContainer = document.getElementById(
          "message-container",
        ) as HTMLDivElement;
        messageContainer.innerHTML = `
          <div class="flex gap-2 bg-green-300 text-green-950 w-full p-2 rounded items-center mt-2">
            <i class="bi bi-check-circle-fill text-green-950"></i>
            <p class="m-0 text-sm">Failed to create API key: ${errorData}</p>
          </div>
        `;
        setTimeout(() => {
          messageContainer.innerHTML = "";
        }, 5000);
        return;
      }

      const messageContainer = document.getElementById(
        "message-container",
      ) as HTMLDivElement;
      if (messageContainer) {
        messageContainer.innerHTML = `
          <div class="flex gap-2 bg-green-300 text-green-950 w-full p-2 rounded items-center mt-2">
            <i class="bi bi-check-circle-fill text-green-950"></i>
            <p class="m-0 text-sm">Log in successfull!</p>
          </div>
        `;

        setTimeout(() => {
          messageContainer.innerHTML = "";
          window.location.href = "/index.html";
        }, 1000);
        return;
      }
    } catch (error: any) {
      const messageContainer = document.getElementById("message-container");

      if (messageContainer) {
        messageContainer.innerHTML = `
          <div class="flex gap-2 bg-red-200 text-red-950 w-full p-2 rounded items-center mt-2">
            <i class="bi bi-exclamation-triangle-fill text-red-950"></i>
            <p class="m-0 text-sm">Log in failed: ${error.message}</p>
          </div>
        `;
        setTimeout(() => {
          messageContainer.innerHTML = "";
        }, 5000);
        return;
      }
    }
  });
} else {
  alert("Error: Login form not found on this page.");
}
/**
 * Toggles password visibility when checkbox is changed.
 * @param {Event} event - The change event from the checkbox
 */

const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}
