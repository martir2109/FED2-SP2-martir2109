/**
 * Updates teh character count of the bio-input textarea in real time.
 *
 * If the `character-count` paragraph does not exist, the function does nothing.
 * Displays the count in the character-count p.
 */
export function characterCounter() {
  const bioInput = document.getElementById("bio-input") as HTMLTextAreaElement;
  const count = document.getElementById(
    "character-count",
  ) as HTMLParagraphElement;

  if (!count) return;

  const updateCount = (textArea: HTMLTextAreaElement) => {
    count.innerText = textArea.value.length.toString();
  };

  if (bioInput) updateCount(bioInput);
  if (bioInput) {
    bioInput.addEventListener("input", () => updateCount(bioInput));
  }
}
