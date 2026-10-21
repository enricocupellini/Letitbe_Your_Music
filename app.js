/*
 * CONFIGURAZIONE
 * Modifica l'array categories:
 * - name: titolo della categoria
 * - options: tre opzioni con label e percorso image
 * Puoi aggiungere/rimuovere categorie: il codice si adatta automaticamente.
 */
const categories = [
  { name: "RITMO", options: [
    { label: "Ritmo A", image: "assets/placeholders/ritmo-a.svg" },
    { label: "Ritmo B", image: "assets/placeholders/ritmo-b.svg" },
    { label: "Ritmo C", image: "assets/placeholders/ritmo-c.svg" }
  ]},
  { name: "MELODIA", options: [
    { label: "Melodia A", image: "assets/placeholders/melodia-a.svg" },
    { label: "Melodia B", image: "assets/placeholders/melodia-b.svg" },
    { label: "Melodia C", image: "assets/placeholders/melodia-c.svg" }
  ]},
  { name: "ARMONIA", options: [
    { label: "Armonia A", image: "assets/placeholders/armonia-a.svg" },
    { label: "Armonia B", image: "assets/placeholders/armonia-b.svg" },
    { label: "Armonia C", image: "assets/placeholders/armonia-c.svg" }
  ]},
  { name: "DINAMICA", options: [
    { label: "Dinamica A", image: "assets/placeholders/dinamica-a.svg" },
    { label: "Dinamica B", image: "assets/placeholders/dinamica-b.svg" },
    { label: "Dinamica C", image: "assets/placeholders/dinamica-c.svg" }
  ]}
];

const MAX_ITEMS = 16;
const selected = categories.map(() => 0);
const composition = []; // Solo RAM: nessun localStorage, cookie o database.
const categoriesEl = document.querySelector("#categories");
const compositionEl = document.querySelector("#composition");
const addButton = document.querySelector("#add");
const undoButton = document.querySelector("#undo");
const countEl = document.querySelector("#count");
const statusEl = document.querySelector("#status");

function renderCategories() {
  categoriesEl.replaceChildren();
  categories.forEach((category, categoryIndex) => {
    const section = document.createElement("section");
    section.className = "category";
    const heading = document.createElement("h3");
    heading.textContent = category.name;
    const options = document.createElement("div");
    options.className = "options";
    category.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("aria-pressed", String(selected[categoryIndex] === optionIndex));
      button.setAttribute("aria-label", `${category.name}: ${option.label}`);
      const img = document.createElement("img");
      img.src = option.image;
      img.alt = "";
      img.loading = "lazy";
      const label = document.createElement("span");
      label.textContent = option.label;
      button.append(img, label);
      button.addEventListener("click", () => {
        selected[categoryIndex] = optionIndex;
        renderCategories();
      });
      options.appendChild(button);
    });
    section.append(heading, options);
    categoriesEl.appendChild(section);
  });
}

function moveItem(from, to) {
  if (from < 0 || from >= composition.length || to < 0 || to >= composition.length || from === to) return;
  const [item] = composition.splice(from, 1);
  composition.splice(to, 0, item);
  renderComposition();
  statusEl.textContent = `Elemento spostato alla posizione ${to + 1}.`;
}

function makeChoiceCell(choice) {
  const cell = document.createElement("div");
  cell.className = "sequence-choice";
  const img = document.createElement("img");
  img.src = choice.image;
  img.alt = choice.label;
  img.loading = "lazy";
  const label = document.createElement("span");
  label.textContent = choice.label;
  cell.append(img, label);
  return cell;
}

function renderComposition() {
  countEl.textContent = String(composition.length);
  addButton.disabled = composition.length >= MAX_ITEMS;
  undoButton.disabled = composition.length === 0;

  if (composition.length === 0) {
    compositionEl.innerHTML = `<div class="empty-state">
      <div class="empty-symbol" aria-hidden="true">＋</div>
      <p>La composizione apparirà qui.</p>
      <span>Seleziona le regole e premi “Aggiungi elemento”.</span>
    </div>`;
    statusEl.textContent = "La composizione è vuota.";
    return;
  }

  const sequence = document.createElement("div");
  sequence.className = "sequence";

  composition.forEach((item, itemIndex) => {
    const card = document.createElement("article");
    card.className = "sequence-item";
    card.draggable = true;
    card.tabIndex = 0;
    card.dataset.index = String(itemIndex);
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", `Elemento ${itemIndex + 1}. Trascina per riordinare, oppure usa le frecce.`);

    const top = document.createElement("div");
    top.className = "sequence-top";
    const number = document.createElement("span");
    number.className = "sequence-number";
    number.textContent = `ELEMENTO ${String(itemIndex + 1).padStart(2, "0")}`;

    const controls = document.createElement("div");
    controls.className = "item-controls";
    const up = document.createElement("button");
    up.type = "button";
    up.className = "move-button";
    up.textContent = "←";
    up.title = "Sposta a sinistra";
    up.setAttribute("aria-label", `Sposta elemento ${itemIndex + 1} a sinistra`);
    up.disabled = itemIndex === 0;
    up.draggable = false;
    up.addEventListener("click", (event) => {
      event.stopPropagation();
      moveItem(itemIndex, itemIndex - 1);
    });
    const down = document.createElement("button");
    down.type = "button";
    down.className = "move-button";
    down.textContent = "→";
    down.title = "Sposta a destra";
    down.setAttribute("aria-label", `Sposta elemento ${itemIndex + 1} a destra`);
    down.disabled = itemIndex === composition.length - 1;
    down.draggable = false;
    down.addEventListener("click", (event) => {
      event.stopPropagation();
      moveItem(itemIndex, itemIndex + 1);
    });
    controls.append(up, down);
    top.append(number, controls);

    const images = document.createElement("div");
    images.className = "sequence-images";
    item.forEach((choice) => images.appendChild(makeChoiceCell(choice)));
    card.append(top, images);

    // Drag & drop nativo: supportato dai browser desktop.
    card.addEventListener("dragstart", (event) => {
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(itemIndex));
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      sequence.querySelectorAll(".drop-before,.drop-after").forEach(el => el.classList.remove("drop-before","drop-after"));
    });
    card.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      sequence.querySelectorAll(".drop-before,.drop-after").forEach(el => el.classList.remove("drop-before","drop-after"));
      if (event.dataTransfer.getData("text/plain") === "") return;
      const rect = card.getBoundingClientRect();
      card.classList.add(event.clientX < rect.left + rect.width / 2 ? "drop-before" : "drop-after");
    });
    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const from = Number(event.dataTransfer.getData("text/plain"));
      const rect = card.getBoundingClientRect();
      let to = itemIndex;
      if (event.clientX >= rect.left + rect.width / 2) to += 1;
      // Dopo aver rimosso l'elemento di partenza, corregge l'indice d'inserimento.
      if (from < to) to -= 1;
      to = Math.max(0, Math.min(composition.length - 1, to));
      moveItem(from, to);
    });

    // Accessibilità da tastiera: frecce sinistra/destra per riordinare.
    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key === "ArrowLeft" && itemIndex > 0) {
        event.preventDefault();
        moveItem(itemIndex, itemIndex - 1);
      } else if (event.key === "ArrowRight" && itemIndex < composition.length - 1) {
        event.preventDefault();
        moveItem(itemIndex, itemIndex + 1);
      }
    });

    sequence.appendChild(card);
  });

  compositionEl.replaceChildren(sequence);
  statusEl.textContent = composition.length === MAX_ITEMS
    ? "Hai raggiunto il limite di 16 elementi."
    : `${composition.length} ${composition.length === 1 ? "elemento creato" : "elementi creati"}.`;
}

// Touchscreen: Pointer Events per spostare con il dito senza librerie esterne.
// Si usa un piccolo movimento minimo per distinguere il trascinamento dal tap.
let pointerDrag = null;
compositionEl.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".sequence-item");
  if (!card || event.target.closest("button") || event.pointerType === "mouse") return;
  pointerDrag = {
    pointerId: event.pointerId,
    from: Number(card.dataset.index),
    startX: event.clientX,
    startY: event.clientY,
    card,
    active: false
  };
});
compositionEl.addEventListener("pointermove", (event) => {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const dx = event.clientX - pointerDrag.startX;
  const dy = event.clientY - pointerDrag.startY;
  if (!pointerDrag.active && Math.hypot(dx, dy) > 12) {
    pointerDrag.active = true;
    pointerDrag.card.classList.add("dragging");
  }
  if (!pointerDrag.active) return;
  event.preventDefault();
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".sequence-item");
  compositionEl.querySelectorAll(".drop-before,.drop-after").forEach(el => el.classList.remove("drop-before","drop-after"));
  if (target && target !== pointerDrag.card) {
    const rect = target.getBoundingClientRect();
    target.classList.add(event.clientX < rect.left + rect.width / 2 ? "drop-before" : "drop-after");
  }
}, { passive: false });
function finishPointerDrag(event) {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const drag = pointerDrag;
  pointerDrag = null;
  drag.card.classList.remove("dragging");
  compositionEl.querySelectorAll(".drop-before,.drop-after").forEach(el => el.classList.remove("drop-before","drop-after"));
  if (!drag.active) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".sequence-item");
  if (!target) return;
  const targetIndex = Number(target.dataset.index);
  if (targetIndex === drag.from) return;
  const rect = target.getBoundingClientRect();
  let to = targetIndex + (event.clientX >= rect.left + rect.width / 2 ? 1 : 0);
  if (drag.from < to) to -= 1;
  to = Math.max(0, Math.min(composition.length - 1, to));
  moveItem(drag.from, to);
}
compositionEl.addEventListener("pointerup", finishPointerDrag);
compositionEl.addEventListener("pointercancel", (event) => {
  if (pointerDrag && event.pointerId === pointerDrag.pointerId) {
    pointerDrag.card.classList.remove("dragging");
    pointerDrag = null;
  }
});

addButton.addEventListener("click", () => {
  if (composition.length >= MAX_ITEMS) return;
  // Ogni rettangolo conserva una copia delle opzioni selezionate al momento della creazione.
  composition.push(categories.map((category, i) => ({ ...category.options[selected[i]] })));
  renderComposition();
});
undoButton.addEventListener("click", () => {
  if (composition.length === 0) return;
  composition.pop();
  renderComposition();
});

renderCategories();
renderComposition();
