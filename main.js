const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
  const {
    templateId,
    closeMethods = ["button", "backdrop", "escape"],
    destroyOnClose = true,
    cssClass = [],
    footer = false,
    onOpen,
    onClose,
  } = options;

  const template = $(`#${templateId}`);

  if (!template) {
    console.error(`#${templateId} does not exist!`);
    return;
  }

  this._allowButtonClose = closeMethods.includes("button");
  this._allowBackdropClose = closeMethods.includes("backdrop");
  this._allowEscapeClose = closeMethods.includes("escape");

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

  this._build = () => {
    const content = template.content.cloneNode(true);

    this._backdrop = document.createElement("div");
    this._backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    cssClass.forEach((className) => {
      if (typeof className === "string") {
        container.classList.add(className);
      }
    });

    if (this._allowButtonClose) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "modal-close";
      closeBtn.innerHTML = "&times;";

      container.append(closeBtn);
      closeBtn.onclick = () => {
        this.close();
      };
    }

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append childs and insert content
    modalContent.append(content);
    container.append(modalContent);

    if (footer) {
      this._modalFooter = document.createElement("div");
      this._modalFooter.className = "modal-footer";

      if (this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
      }

      container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
  };

  this.setFooterContent = (html) => {
    this._footerContent = html;
    if (this._modalFooter) {
      this._modalFooter.innerHTML = html;
    }
  };

  this._onTransitionEnd = (callback) => {
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "opacity") return;
      if (typeof callback === "function") callback();
    };
  };

  this.open = () => {
    if (!this._backdrop) {
      this._build();
    }

    setTimeout(() => this._backdrop.classList.add("show"), 0);

    // Disable scrolling
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = getScrollbarWidth() + "px";

    // Attach event listeners
    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }
    this._onTransitionEnd(() => {
      if (typeof onOpen === "function") onOpen();
    });

    return this._backdrop;
  };

  this.close = (destroy = destroyOnClose) => {
    this._backdrop.classList.remove("show");
    this._onTransitionEnd(() => {
      if (destroy && this._backdrop) {
        this._backdrop.remove();
        this._backdrop = null;
        this._modalFooter = null;
      }

      // Enable scrolling
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";

      if (typeof onClose === "function") onClose();
    });
  };

  this.destroy = () => {
    this.close(true);
  };
}

// Modal 1
const modal1 = new Modal({
  templateId: "modal-1",
  closeMethods: ["button", "escape"],
  destroyOnClose: false,
  cssClass: ["class-1", "class-2", "class-3"],
  onOpen: () => {
    console.log("onOpen Modal 1 ran");
  },
  onClose: () => {
    console.log("onClose Modal 1 ran");
  },
});

$("#open-modal-1").onclick = (e) => {
  modal1.open();
};

// Modal 2
const modal2 = new Modal({
  templateId: "modal-2",
  onOpen: () => {
    console.log("onOpen Modal 2 ran");
  },
  onClose: () => {
    console.log("onClose Modal 2 ran");
  },
});

$("#open-modal-2").onclick = (e) => {
  const modalElement = modal2.open();
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

// Modal 3
const modal3 = new Modal({
  templateId: "modal-3",
  onOpen: () => {
    console.log("onOpen Modal 3 ran");
  },
  onClose: () => {
    console.log("onClose Modal 3 ran");
  },
  footer: true,
});

modal3.setFooterContent("Footer");

modal3.open();
