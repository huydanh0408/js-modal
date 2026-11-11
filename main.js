const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Popzy(options = {}) {
  const {
    templateId,
    closeMethods = ["button", "backdrop", "escape"],
    cssClass = [],
    destroyOnClose = true,
    footer = false,
    onOpen,
    onClose,
  } = options;
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

    if (!this._backdrop) this._build();

    setTimeout(() => {
      this._backdrop.classList.add("popzy--show");
      this._onTransitionEnd(onOpen);
    }, 0);

    // Disable scrolling
    document.body.classList.add("popzy--no-scroll");
    document.body.style.paddingRight =
      this._targetPadRight + _getScrollbarWidth() + "px";

    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", this._handleEscapeKey);
    }
    return this._backdrop;
  };

  this.close = (destroy = destroyOnClose) => {
    if (this._allowEscapeClose) {
      document.removeEventListener("keydown", this._handleEscapeKey);
    }

    this._backdrop.classList.remove("popzy--show");
    this._onTransitionEnd(() => {
      if (destroy) {
        this._backdrop.remove();
        this._backdrop = null;
        this._modalFooter = null;
      }

      // Enable scrolling
      document.body.classList.remove("popzy--no-scroll");
      document.body.style.paddingRight = this._targetPadRight + "px";

      if (typeof onClose === "function") onClose();
    });
  };

  this.destroy = () => {
    this.close(true);
  };

  this.setFooterContent = (content) => {
    this._footerContent = content;
    if (this._modalFooter) {
      this._modalFooter.innerHTML = this._footerContent;
    }
  };

  this._build = () => {
    // Create modal elements
    this._backdrop = document.createElement("div");
    this._backdrop.className = "popzy";

    const container = document.createElement("div");
    container.className = "popzy__container";

    cssClass.forEach((className) => {
      if (typeof className === "string") container.classList.add(className);
    });

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

    if (footer) {
      this._modalFooter = document.createElement("div");
      this._modalFooter.className = "popzy__footer";
      if (this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
      }
      container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.appendChild(this._backdrop);
  };

  this._handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  this._onTransitionEnd = (callback) => {
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "opacity") return;

      e.currentTarget.ontransitionend = null;

      if (typeof callback === "function") callback();
    };
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
  cssClass: ["class-1", "class-2", "class-3"],
  destroyOnClose: false,
  footer: true,
  onOpen: () => {
    console.log("Modal1 - onOpen ran!!!");
  },
  onClose: () => {
    console.log("Modal1 - onClose ran!!!");
  },
});

$("#open-modal-1").onclick = () => modal1.open();

// Modal 2
const modal2 = new Popzy({
  templateId: "modal-2",
  closeMethods: ["backdrop"],
  onOpen: () => {
    console.log("Modal2 - onOpen ran!!!");
  },
  onClose: () => {
    console.log("Modal2 - onClose ran!!!");
  },
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
