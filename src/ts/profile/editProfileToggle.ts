/**
 * Toggles the visibility of the profile edit form.
 *
 * When the "Edit profile" button is clicked,
 * the edit form is shown and the toggle button is hidden.
 *
 * When the "Cancel" button is clicked,
 * the edit form is hidden and the toggle button is shown again.
 */
export function editProfileToggle() {
  const toggleBtn = document.getElementById("edit-profile-toggle-btn");
  const editContainer = document.getElementById("edit-profile-card");
  const cancelBtn = document.getElementById("cancel-btn");

  toggleBtn?.addEventListener("click", () => {
    if (!editContainer || !toggleBtn) return;

    editContainer.classList.remove("hidden");
    toggleBtn.classList.add("hidden");
  });

  cancelBtn?.addEventListener("click", () => {
    if (!editContainer || !toggleBtn) return;

    editContainer.classList.add("hidden");
    toggleBtn.classList.remove("hidden");
  });
}
