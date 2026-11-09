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

    closetBtn.onclick = () => {
      this.close();
      return;
    };

    this.backdrop.onclick = (e) => {
      if (e.target === "Escape") {
        this.close();
        return;
      }
    };

    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    };
  };

  this.close = () => {
    this.backdrop.classList.remove("popzy--show");
    this.backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "opacity") return;
      document.body.removeChild(this.backdrop);
    };
  };
}

const modal1 = new Popzy({ templateId: "modal-1" });

$("#open-modal-1").onclick = () => modal1.open();
