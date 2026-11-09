const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Popzy(options = {}) {
  const { templateId } = options;
  const template = $(`#${templateId}`);

  this.open = () => {
    if (!template) return console.error(`#${templateId} doesn't exist!`);

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
  };
}

const modal1 = new Popzy({ templateId: "modal-1" });

$("#open-modal-1").onclick = () => modal1.open();

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
