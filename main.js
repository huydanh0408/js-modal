const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let currentModal = null;

$$(".btn").forEach((btn) => {
  const modal = $(btn.dataset.modal);
  btn.onclick = () => {
    if (modal) {
      modal.classList.add("show");
      currentModal = modal;
      return;
    }
    console.error(`${btn.dataset.modal} does not exist!`);
  };
});

$$(".modal-close").forEach((closeBtn) => {
  closeBtn.onclick = (e) => {
    const modal = e.target.closest(".modal-backdrop");
    if (modal) {
      modal.classList.remove("show");
      currentModal = null;
    }
  };
});

$$(".modal-backdrop").forEach((modal) => {
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      currentModal = null;
    }
  };
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && currentModal) {
    currentModal.classList.remove("show");
    currentModal = null;
  }
});
