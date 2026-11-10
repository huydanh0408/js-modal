const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Popzy(options = {}) {
  const { templateId, closeMethods = ["button", "backdrop", "escape"] } =
    options;
  const template = $(`#${templateId}`);

  this._allowButtonClose = closeMethods.includes("button");
  this._allowBackdropClose = closeMethods.includes("backdrop");
  this._allowEscapeClose = closeMethods.includes("escape");

  this.open = () => {
    if (!template) return console.error(`#${templateId} doesn't exist!`);

    this._targetPadRight =
      Number.parseInt(
        window.getComputedStyle(document.body)["padding-right"],
      ) || 0;

    // Create modal elements
    this.backdrop = document.createElement("div");
    this.backdrop.className = "popzy";

    const container = document.createElement("div");
    container.className = "popzy__container";

    if (this._allowButtonClose) {
      const closetBtn = document.createElement("button");
      closetBtn.className = "popzy__close";
      closetBtn.innerHTML = "&times;";
      container.append(closetBtn);

      closetBtn.onclick = () => this.close();
    }

    const content = document.createElement("div");
    content.className = "popzy__content";
    content.append(template.content.cloneNode(true));

    // Append content and element
    container.append(content);
    this.backdrop.append(container);
    document.body.appendChild(this.backdrop);

    setTimeout(() => this.backdrop.classList.add("popzy--show"), 0);

    // Disable scrolling
    document.body.classList.add("popzy--no-scroll");
    document.body.style.paddingRight =
      this._targetPadRight + _getScrollbarWidth() + "px";

    if (this._allowBackdropClose) {
      this.backdrop.onclick = (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      };
    }

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", this._handleEscapeKey);
    }
    return this.backdrop;
  };

  this.close = () => {
    if (this._allowEscapeClose) {
      document.removeEventListener("keydown", this._handleEscapeKey);
    }

    this.backdrop.classList.remove("popzy--show");
    this.backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "opacity") return;
      document.body.removeChild(this.backdrop);
    };

    // Enable scrolling
    document.body.classList.remove("popzy--no-scroll");
    document.body.style.paddingRight = this._targetPadRight + "px";
  };

  this._handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      this.close();
    }
  };
}

function _getScrollbarWidth() {
  if (_getScrollbarWidth.value !== undefined) return _getScrollbarWidth.value;

  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "absolute",
    top: "-30px",
    overflow: "scroll",
  });
  document.body.appendChild(div);
  _getScrollbarWidth.value = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return _getScrollbarWidth.value;
}

// Modal 1
const modal1 = new Popzy({
  templateId: "modal-1",
  closeMethods: ["button", "escape"],
});

$("#open-modal-1").onclick = () => modal1.open();

// Modal 2
const modal2 = new Popzy({
  templateId: "modal-2",
  closeMethods: ["backdrop"],
});

$("#open-modal-2").onclick = () => {
  const modalReturned = modal2.open();
  const form = modalReturned.querySelector(".form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        mail: form.querySelector("#email-modal-2").value.trim(),
        password: form.querySelector("#password-modal-2").value.trim(),
      };
      console.log(formData);
    });
  }
};
