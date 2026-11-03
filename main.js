const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Popzy.elements = [];

function Popzy(options = {}) {
  this.opt = Object.assign(
    {
      closeMethods: ["button", "backdrop", "escape"],
      destroyOnClose: true,
      cssClass: [],
      footer: false,
    },
    options,
  );

  this.template = $(`#${this.opt.templateId}`);

  if (!this.template) {
    console.error(`#${this.opt.templateId} does not exist!`);
    return;
  }

  const { closeMethods } = this.opt;
  this._allowButtonClose = closeMethods.includes("button");
  this._allowBackdropClose = closeMethods.includes("backdrop");
  this._allowEscapeClose = closeMethods.includes("escape");

  this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Popzy.prototype._getScrollbarWidth = function () {
  if (this._scrollbarWidth) return this._scrollbarWidth;

  const div = document.createElement("div");

  Object.assign(div.style, {
    position: "absolute",
    top: "30px",
    overflow: "scroll",
  });

  document.body.appendChild(div);
  this._scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return this._scrollbarWidth;
};

Popzy.prototype._footerButtons = [];

Popzy.prototype._build = function () {
  const content = this.template.content.cloneNode(true);

  this._backdrop = document.createElement("div");
  this._backdrop.className = "popzy__backdrop";

  const container = document.createElement("div");
  container.className = "popzy__container";

  this.opt.cssClass.forEach((className) => {
    if (typeof className === "string") {
      container.classList.add(className);
    }
  });

  if (this._allowButtonClose) {
    const closeBtn = this._createButton("&times;", "popzy__close", () =>
      this.close(),
    );
    container.append(closeBtn);
  }

  const modalContent = document.createElement("div");
  modalContent.className = "popzy__content";

  // Append childs and insert content
  modalContent.append(content);
  container.append(modalContent);

  if (this.opt.footer) {
    this._modalFooter = document.createElement("div");
    this._modalFooter.className = "popzy__footer";

    this._renderFooterContent();
    this._renderFooterButtons();

    container.append(this._modalFooter);
  }

  this._backdrop.append(container);
  document.body.append(this._backdrop);
};

Popzy.prototype.setFooterContent = function (html) {
  this._footerContent = html;
  this._renderFooterContent();
};

Popzy.prototype.addFooterButton = function (title, cssClass, callback) {
  const button = this._createButton(title, cssClass, callback);
  this._footerButtons.push(button);
  this._renderFooterButtons();
};

Popzy.prototype._renderFooterContent = function () {
  if (this._footerContent && this._modalFooter) {
    this._modalFooter.innerHTML = this._footerContent;
  }
};

Popzy.prototype._renderFooterButtons = function () {
  if (this._modalFooter) {
    this._footerButtons.forEach((button) => {
      this._modalFooter.append(button);
    });
  }
};

Popzy.prototype._createButton = function (title, cssClass, callback) {
  const button = document.createElement("button");
  button.classList = cssClass;
  button.innerHTML = title;
  button.onclick = callback;

  return button;
};

Popzy.prototype._onTransitionEnd = function (callback) {
  this._backdrop.ontransitionend = (e) => {
    if (e.propertyName !== "opacity") return;
    if (typeof callback === "function") callback();
  };
};

Popzy.prototype.open = function () {
  Popzy.elements.push(this);

  if (!this._backdrop) {
    this._build();
  }

  setTimeout(() => this._backdrop.classList.add("popzy--show"), 0);

  // Disable scrolling
  document.body.classList.add("popzy--no-scroll");
  document.body.style.paddingRight = this._getScrollbarWidth() + "px";

  // Attach event listeners
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

  this._onTransitionEnd(this.opt.onOpen);

  return this._backdrop;
};

Popzy.prototype._handleEscapeKey = function (e) {
  const lastModal = Popzy.elements[Popzy.elements.length - 1];
  if (e.key === "Escape" && lastModal === this) {
    this.close();
  }
};

Popzy.prototype.close = function (destroy = this.opt.destroyOnClose) {
  Popzy.elements.pop(this);

  this._backdrop.classList.remove("popzy--show");

  if (this._allowEscapeClose) {
    document.removeEventListener("keydown", this._handleEscapeKey);
  }

  this._onTransitionEnd(() => {
    if (destroy && this._backdrop) {
      this._backdrop.remove();
      this._backdrop = null;
      this._modalFooter = null;
    }

    // Enable scrolling
    if (!Popzy.elements.length) {
      document.body.classList.remove("popzy--no-scroll");
      document.body.style.paddingRight = "";
    }

    if (typeof this.opt.onClose === "function") this.opt.onClose();
  });
};

Popzy.prototype.destroy = function () {
  this.close(true);
};

// Modal 1
const modal1 = new Popzy({
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
const modal2 = new Popzy({
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
const modal3 = new Popzy({
  templateId: "modal-3",
  onOpen: () => {
    console.log("onOpen Modal 3 ran");
  },
  onClose: () => {
    console.log("onClose Modal 3 ran");
  },
  footer: true,
  closeMethods: [],
});

modal3.setFooterContent("Footer");

modal3.addFooterButton(
  "Danger",
  "popzy__btn popzy__btn--danger popzy__btn--pull-left",
  (e) => {
    console.log("Danger Clicked");
    modal3.close();
  },
);

modal3.addFooterButton("Cancel", "popzy__btn", (e) => {
  modal3.close();
});

modal3.addFooterButton(
  "<span>Agree</span>",
  "popzy__btn popzy__btn--primary",
  (e) => {
    console.log(e);
    // Logic something
    modal3.close();
  },
);

$("#open-modal-3").onclick = () => {
  modal3.open();
};
