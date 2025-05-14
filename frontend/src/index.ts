import "./p-login";
import "./p-search";
import "./p-relation";
import "./p-upload";

document.addEventListener("hide.bs.modal", () => {
  if (document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }
});
