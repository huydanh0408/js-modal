const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/**
 *    <!-- Modal 1 -->
    <div id="modal-1" class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-close">&times;</div>
        <div class="modal-content">
          <h2>
            Modal 1 - The Quiet Life Is the Most Underrated Path to Success
          </h2>
          <p>
            I live a boring life. I’m 39, and most of my days look exactly the
            same.
          </p>
          <p>
            I work from a small office, take walks, see my family, lift weights,
            read, and write. That’s about it.
          </p>
          <p>And I love it.</p>
          <p>
            My 19-year-old self would scoff at this. Even my 29-year-old self
            would. “Is that all there is to life?” he’d say. “You’ve got to be
            out there. In the middle of the action!”
          </p>
        </div>
      </div>
    </div>
 */

function Modal() {
  this.openModal = (content) => {
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
    modalContent.innerHTML = content;
    container.append(close, modalContent);
    backdrop.append(container);
    document.body.append(backdrop);

    setTimeout(() => backdrop.classList.add("show"), 0);

    // Attach event listeners
    close.onclick = () => {
      this.closeModal(backdrop);
    };

    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });
  };
  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    modalElement.ontransitionend = () => {
      modalElement.remove();
    };
  };
}

const modal = new Modal();

$("#open-modal-1").onclick = (e) => {
  modal.openModal("<h2>Modal 1</h2>");
};

$("#open-modal-2").onclick = (e) => {
  modal.openModal("<h2>Modal 2 - Heading of modal 3</h2>");
};
