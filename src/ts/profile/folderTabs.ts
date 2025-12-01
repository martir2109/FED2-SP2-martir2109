/**
 * Handels tab switching by activating the selected tab button and displaying the matching tab content section.
 *
 * Removes the "active" class from all tab buttons and tab content elements,
 * then adds it back only to the clicked button and its matching content panel.
 *
 * @param {Event} event - The click event triggert by the tab button.
 * @param {string} tabName - The ID of the tab content element to activate.
 */

function openTab(event: Event, tabName: string) {
  const tabContents = document.querySelectorAll<HTMLElement>(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  const tabButtons = document.querySelectorAll<HTMLElement>(".tab-button");
  tabButtons.forEach((button) => button.classList.remove("active"));

  const targetContent = document.getElementById(tabName);
  if (targetContent) {
    targetContent.classList.add("active");
  }

  const currentTarget = event.currentTarget as HTMLElement | null;
  if (currentTarget) {
    currentTarget.classList.add("active");
  }
}

(window as any).openTab = openTab;
