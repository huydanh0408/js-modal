const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Popzy(options = {}) {
  const { templateId } = options;
  const template = $(`#${templateId}`);

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

    const closetBtn = document.createElement("button");
    closetBtn.className = "popzy__close";
    closetBtn.innerHTML = "&times;";

    const content = document.createElement("div");
    content.className = "popzy__content";
    content.append(template.content.cloneNode(true));

    // Append content and element
    container.append(closetBtn, content);
    this.backdrop.append(container);
    document.body.appendChild(this.backdrop);

    setTimeout(() => this.backdrop.classList.add("popzy--show"), 0);

    // Disable scrolling
    document.body.classList.add("popzy--no-scroll");
    document.body.style.paddingRight =
      this._targetPadRight + _getScrollbarWidth() + "px";

    closetBtn.onclick = () => this.close();

    this.backdrop.onclick = (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    };

    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    };
    return this.backdrop;
  };

  this.close = () => {
    this.backdrop.classList.remove("popzy--show");
    this.backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "opacity") return;
      document.body.removeChild(this.backdrop);
    };

    // Enable scrolling
    document.body.classList.remove("popzy--no-scroll");
    document.body.style.paddingRight = this._targetPadRight + "px";
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
const modal1 = new Popzy({ templateId: "modal-1" });

$("#open-modal-1").onclick = () => modal1.open();

// Modal 2
const modal2 = new Popzy({ templateId: "modal-2" });

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
