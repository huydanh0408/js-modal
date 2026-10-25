const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal() {
  function getScrollbarWidth() {
    if (getScrollbarWidth.value) {
      return getScrollbarWidth.value;
    }

    const div = document.createElement("div");

    Object.assign(div.style, {
      position: "absolute",
      top: "30px",
      overflow: "scroll",
    });

    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    getScrollbarWidth.value = scrollbarWidth;

    return scrollbarWidth;
  }

  this.openModal = (options = {}) => {
    const { templateId, allowBackdropClose = true } = options;
    const template = $(`#${templateId}`);
    if (!template) {
      console.error(`#${templateId} does not exist!`);
      return;
    }

    const content = template.content.cloneNode(true);

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    const close = document.createElement("button");
    close.className = "modal-close";
    close.innerHTML = "&times;";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append childs and insert content
    modalContent.append(content);
    container.append(close, modalContent);
    backdrop.append(container);
    document.body.append(backdrop);

    setTimeout(() => backdrop.classList.add("show"), 0);

    // Disable scrolling
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = getScrollbarWidth() + "px";

    // Attach event listeners
    close.onclick = () => {
      this.closeModal(backdrop);
    };

    if (allowBackdropClose) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          this.closeModal(backdrop);
        }
      };
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });

    return backdrop;
  };
  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    modalElement.ontransitionend = () => {
      modalElement.remove();
    };
    // Enable scrolling
    document.body.classList.remove("no-scroll");

    document.body.style.paddingRight = "";
  };
}

const modal = new Modal();

$("#open-modal-1").onclick = (e) => {
  modal.openModal({
    templateId: "modal-1",
  });
};

$("#open-modal-2").onclick = (e) => {
  const modalElement = modal.openModal({
    templateId: "modal-2",
    allowBackdropClose: false,
  });
  const form = modalElement.querySelector("#form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {
      email: $("#input-email").value.trim(),
      password: $("#input-password").value.trim(),
    };

    console.log(data);
  };
};
