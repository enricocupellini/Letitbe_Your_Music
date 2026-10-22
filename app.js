/* Compositore didattico - struttura MVC leggera
   Model: state. View: render*. Controller: eventi delegati.
   Ogni elemento conserva gli INDICI delle opzioni, non copie di oggetti UI. */
const categories = [
  {name:"ARMONIA",accent:"#25815b",bg:"#edf8f0",line:"#cce7d3",tint:"#d8efdf",options:[
    {label:"Tonica",image:"assets/placeholders/armonia-a.svg"},
    {label:"Sopratonica",image:"assets/placeholders/armonia-b.svg"},
    {label:"Sottodominante",image:"assets/placeholders/armonia-c.svg"},
    {label:"Dominante",image:"assets/placeholders/armonia-d.svg"},
    {label:"Sopradominante",image:"assets/placeholders/armonia-e.svg"}
  ]},
  {name:"PROFILO",accent:"#286fc4",bg:"#edf5ff",line:"#c9def8",tint:"#dceaff",options:[
    {label:"Stazionario",image:"assets/placeholders/andamento-a.svg"},
    {label:"Sale o scende",image:"assets/placeholders/andamento-b.svg"},
    {label:"Salta",image:"assets/placeholders/andamento-c.svg"}
  ]},
  {name:"TEMA",accent:"#c95042",bg:"#fff0ed",line:"#f2c9c2",tint:"#f7d8d3",options:[
    {label:"Tema",image:"assets/placeholders/voce-a.svg"},
    {label:"Pausa",image:"assets/placeholders/voce-b.svg"},
    {label:"Tema/Pausa",image:"assets/placeholders/voce-c.svg"},
    {label:"Pausa/Tema",image:"assets/placeholders/voce-d.svg"}
  ]}
];
const MAX_ITEMS = 16;
const model = { defaults: categories.map(() => 0), items: [], activeId: null, nextId: 1 };
const $ = s => document.querySelector(s);
const categoryRoot = $("#categories"), compositionRoot = $("#composition"), addButton = $("#add"), removeSelectedButton = $("#removeSelected"), status = $("#status");
let suppressClick = false, touchDrag = null;
const activeItem = () => model.items.find(item => item.id === model.activeId) || null;
function announce(message) { status.textContent = message; }

// VIEW: le evidenziazioni sono sempre derivate dal modello corrente.
function renderCategories() {
  const current = activeItem();
  categoryRoot.replaceChildren();
  categories.forEach((cat, ci) => {
    const box = document.createElement("section"); box.className = "category";
    Object.entries({accent:cat.accent,bg:cat.bg,line:cat.line,tint:cat.tint,"cat-ink":cat.accent}).forEach(([k,v]) => box.style.setProperty("--"+k,v));
    const heading = document.createElement("h3"); heading.textContent = cat.name;
    const options = document.createElement("div"); options.className = "options";
    cat.options.forEach((op, oi) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "option"; button.dataset.category = ci; button.dataset.option = oi;
      button.style.setProperty("--cat-accent",cat.accent); button.style.setProperty("--cat-tint",cat.tint);
      const selectedIndex = current ? current.choices[ci] : model.defaults[ci];
      button.setAttribute("aria-pressed", String(selectedIndex === oi));
      const image = document.createElement("img"); image.src = op.image; image.alt = "";
      const label = document.createElement("span"); label.textContent = op.label;
      button.append(image,label); options.append(button);
    });
    box.append(heading,options); categoryRoot.append(box);
  });
}
function renderItems() {
  removeSelectedButton.disabled = model.activeId === null || !model.items.some(item => item.id === model.activeId); addButton.disabled = model.items.length >= MAX_ITEMS;
  $("#count").textContent = model.items.length;
  if (!model.items.length) {
    compositionRoot.innerHTML = '<div class="empty-state"><p>La composizione è vuota.</p><span>Scegli le regole e premi “Aggiungi elemento”.</span></div>';
    return;
  }
  const grid = document.createElement("div"); grid.className = "sequence";
  model.items.forEach((item, index) => {
    const card = document.createElement("article"); card.className = "sequence-item" + (item.id === model.activeId ? " selected" : "");
    card.style.order = String(index);
    card.draggable = true; card.tabIndex = 0; card.dataset.id = item.id; card.setAttribute("aria-selected",String(item.id === model.activeId));
    const top = document.createElement("div"); top.className = "sequence-top";
    const number = document.createElement("span"); number.className = "sequence-number"; number.textContent = `ELEMENTO ${String(index+1).padStart(2,"0")}`;
    const controls = document.createElement("div"); controls.className = "item-controls";
    [["←",index-1],["→",index+1]].forEach(([text,target]) => { const b=document.createElement("button"); b.type="button"; b.className="move-button"; b.textContent=text; b.disabled=target<0||target>=model.items.length; b.draggable=false; b.dataset.move=target; b.dataset.id=item.id; b.setAttribute("aria-label",text==="←"?"Sposta a sinistra":"Sposta a destra"); controls.append(b); });
    top.append(number,controls);
    const images=document.createElement("div"); images.className="sequence-images";
    item.choices.forEach((oi,ci) => {
      const op=categories[ci].options[oi];
      const cell=document.createElement("div");
      cell.className = "sequence-choice " + (ci===2 ? "sequence-choice-voice" : ci===0 ? "sequence-choice-harmony" : "sequence-choice-tempo");
      cell.style.setProperty("--cat-bg",categories[ci].bg); cell.style.setProperty("--cat-ink",categories[ci].accent);
      const img=document.createElement("img"); img.src=op.image; img.alt=op.label;
      const label=document.createElement("span"); label.textContent=op.label;
      cell.append(img,label); images.append(cell);
    });
    card.append(top,images); grid.append(card);
  });
  compositionRoot.replaceChildren(grid);
}
function renderAll() { renderCategories(); renderItems(); }

// CONTROLLER: eventi delegati, così ogni click usa sempre lo stato più recente.
categoryRoot.addEventListener("click", event => {
  const button = event.target.closest("button.option"); if (!button) return;
  const ci = Number(button.dataset.category), oi = Number(button.dataset.option);
  const current = activeItem();
  if (current) { current.choices[ci] = oi; renderAll(); announce(`Elemento ${model.items.indexOf(current)+1} aggiornato.`); }
  else { model.defaults[ci] = oi; renderCategories(); announce("Scelta predefinita aggiornata per il prossimo elemento."); }
});
compositionRoot.addEventListener("click", event => {
  if (suppressClick) return;
  const moveButton = event.target.closest("button[data-move]");
  if (moveButton) { event.stopPropagation(); const from=model.items.findIndex(x=>x.id===Number(moveButton.dataset.id)); moveItem(from,Number(moveButton.dataset.move)); return; }
  const card = event.target.closest(".sequence-item");
  if (card) { selectItem(Number(card.dataset.id)); return; }
  if (model.activeId !== null) { model.activeId=null; renderAll(); announce("Elemento deselezionato."); }
});
compositionRoot.addEventListener("keydown", event => {
  const card=event.target.closest(".sequence-item"); if(!card||event.target!==card)return;
  const index=model.items.findIndex(x=>x.id===Number(card.dataset.id));
  if(event.key==="Enter"||event.key===" "){event.preventDefault();selectItem(Number(card.dataset.id));}
  else if(event.key==="ArrowLeft"&&index>0){event.preventDefault();moveItem(index,index-1);}
  else if(event.key==="ArrowRight"&&index<model.items.length-1){event.preventDefault();moveItem(index,index+1);}
});
function selectItem(id) {
  model.activeId = model.activeId === id ? null : id;
  const current=activeItem(); renderAll();
  announce(current ? `Elemento ${model.items.indexOf(current)+1} selezionato: ora puoi modificarne le regole.` : "Elemento deselezionato.");
}
function moveItem(from,to) {
  if(from<0||to<0||from>=model.items.length||to>=model.items.length||from===to)return;
  const [item]=model.items.splice(from,1); model.items.splice(to,0,item); renderAll(); announce("Ordine aggiornato.");
}
addButton.addEventListener("click", () => {
  if (model.items.length >= MAX_ITEMS) return;

  // Inserimento esclusivamente in coda al modello: mai dopo l'elemento selezionato.
  const item = { id: model.nextId++, choices: [...model.defaults] };
  model.items.push(item);

  // Un nuovo elemento non resta selezionato: deseleziona le schede esistenti
  // e ripristina le regole predefinite in alto.
  model.activeId = null;
  model.defaults = categories.map(() => 0);

  renderAll();
  announce(`Nuovo elemento aggiunto in fondo alla sequenza (posizione ${model.items.length}). Selezione annullata e regole ripristinate.`);
});
removeSelectedButton.addEventListener("click", () => {
  if (model.activeId === null) return;
  const index = model.items.findIndex(item => item.id === model.activeId);
  if (index < 0) return;
  model.items.splice(index, 1);
  model.activeId = null;
  renderAll();
  announce(`Elemento ${index + 1} rimosso.`);
});

// Riordino desktop con drag and drop.
compositionRoot.addEventListener("dragstart",event=>{const card=event.target.closest(".sequence-item");if(!card)return;event.dataTransfer.setData("text/plain",card.dataset.id);event.dataTransfer.effectAllowed="move";card.classList.add("dragging");suppressClick=true;});
compositionRoot.addEventListener("dragover",event=>{if(event.target.closest(".sequence-item"))event.preventDefault();});
compositionRoot.addEventListener("drop",event=>{const target=event.target.closest(".sequence-item");if(!target)return;event.preventDefault();const from=model.items.findIndex(x=>x.id===Number(event.dataTransfer.getData("text/plain")));let to=model.items.findIndex(x=>x.id===Number(target.dataset.id));const r=target.getBoundingClientRect();if(event.clientX>r.left+r.width/2)to++;if(from<to)to--;to=Math.max(0,Math.min(model.items.length-1,to));moveItem(from,to);});
compositionRoot.addEventListener("dragend",()=>{compositionRoot.querySelectorAll(".dragging").forEach(x=>x.classList.remove("dragging"));setTimeout(()=>suppressClick=false,0);});

// Riordino touch: trascina un elemento sopra un altro.
compositionRoot.addEventListener("pointerdown",event=>{const card=event.target.closest(".sequence-item");if(!card||event.target.closest("button")||event.pointerType==="mouse")return;touchDrag={id:event.pointerId,itemId:Number(card.dataset.id),x:event.clientX,y:event.clientY,card,started:false};});
compositionRoot.addEventListener("pointermove",event=>{if(!touchDrag||event.pointerId!==touchDrag.id)return;if(!touchDrag.started&&Math.hypot(event.clientX-touchDrag.x,event.clientY-touchDrag.y)>12){touchDrag.started=true;touchDrag.card.classList.add("dragging");suppressClick=true;}if(touchDrag.started)event.preventDefault();},{passive:false});
function finishTouch(event){if(!touchDrag||event.pointerId!==touchDrag.id)return;const drag=touchDrag;touchDrag=null;drag.card.classList.remove("dragging");if(drag.started){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest(".sequence-item");if(target){const from=model.items.findIndex(x=>x.id===drag.itemId);let to=model.items.findIndex(x=>x.id===Number(target.dataset.id));const r=target.getBoundingClientRect();if(event.clientX>r.left+r.width/2)to++;if(from<to)to--;moveItem(from,Math.max(0,Math.min(model.items.length-1,to)));}}setTimeout(()=>suppressClick=false,0);}
compositionRoot.addEventListener("pointerup",finishTouch);compositionRoot.addEventListener("pointercancel",event=>{if(touchDrag&&event.pointerId===touchDrag.id){touchDrag.card.classList.remove("dragging");touchDrag=null;setTimeout(()=>suppressClick=false,0);}});
renderAll();
