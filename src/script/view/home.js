import utils from "../utils.js";

import NotesApi from "../data/remote/notes-app.js";

const months = {
  1: "Januari",
  2: "Februari",
  3: "Maret",
  4: "April",
  5: "Mei",
  6: "Juni",
  7: "Juli",
  8: "Agustus",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};

const home = async () => {
  const addBox = document
      .querySelector("notes-item")
      .shadowRoot.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descriptionTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

  // Mendapatkan localStorage jika ada dan menguraikannya menjadi object js
  // Jika tidak melewatkan array kosong ke notes

  // Mendapatkan data dari local dan menguraikannya menjadi object untuk di tampilkan
  let notes = await NotesApi.getNotes();

  // fungsi untuk menampilkan semua notes
  function showNotes() {
    document
      .querySelector("notes-item")
      .shadowRoot.querySelectorAll(".note")
      .forEach((note) => note.remove());
    notes.forEach((note) => {
      let liTag = `<li class="note">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${note.body}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${formatDate(note.createdAt)}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="bi bi-three-dots"></i>
                                    <ul class="menu">
                                      <li onclick="deleteNote('${
                                        note.id
                                      }')"><i class="bi bi-trash-fill"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
    });
  }

  // fungsi untuk melakukan format data tanggal dari data lokal "data/notes.js"
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("id-ID", options);
  }

  // menampilkan menu pada tiap notes
  function showMenu(elem) {
    elem.parentElement.classList.add("show");
  }

  // menghapus notes yang dipilih dari data array notes dan menampilkan kembali sisanya
  async function deleteNote(noteId) {
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    await NotesApi.deleteNote(noteId);
    notes = await NotesApi.getNotes();
    // memindahkan note yang dipilih dari array/tasks
    showNotes();
    loading.style.display = "none";
  }

  addBox.addEventListener("click", () => {
    popupBox.classList.add("show");
  });

  closeIcon.addEventListener("click", () => {
    popupBox.classList.remove("show");
    titleTag.value = "";
    descriptionTag.value = "";
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
  });

  addBtn.addEventListener("click", async (event) => {
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    event.preventDefault();
    let noteTitle = titleTag.value,
      noteDesc = descriptionTag.value;
    await NotesApi.createNote({ noteTitle, noteDesc });
    notes = await NotesApi.getNotes();
    showNotes();
    loading.style.display = "none";
  });

  window.showMenu = showMenu;
  window.deleteNote = deleteNote;
  // fungsi yang pertama dijalankan saat fungsi home di panggil
  showNotes();
};

export default home;
