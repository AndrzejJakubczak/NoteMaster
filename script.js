const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("button");

const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec",
  "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false;
let updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Dodaj nową notatkę";
  addBtn.innerText = "Dodaj";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) {
    titleTag.focus();
  }
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edytuj</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Usuń</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  notes.splice(noteId, 1);
  saveNotesToLocalStorage();
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Aktualizuj notatkę";
  addBtn.innerText = "Aktualizuj";
}

addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim();
  let description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();

    let noteInfo = {
      title,
      description,
      date: `${day} ${month}, ${year}`
    };

    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }

    saveNotesToLocalStorage();
    showNotes();
    closeIcon.click();
  }
});

function saveNotesToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function showSearchedNotes(filteredNotes) {
  if (!filteredNotes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  filteredNotes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                    <div class="details">
                        <p>${note.title}</p>
                        <span>${filterDesc}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edytuj</li>
                                <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Usuń</li>
                            </ul>
                        </div>
                    </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

function searchNotes(searchTerm) {
  const filteredNotes = notes.filter(note => {
    const noteTitle = note.title.toLowerCase();
    const noteDescription = note.description.toLowerCase();
    return (
      noteTitle.includes(searchTerm.toLowerCase()) ||
      noteDescription.includes(searchTerm.toLowerCase())
    );
  });

  showSearchedNotes(filteredNotes);
}

const searchInput = document.querySelector(".search-box input");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  searchNotes(searchTerm);
});

