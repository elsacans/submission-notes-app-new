import Swal from "sweetalert2";

const API_BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  //   Gunakan Fungsi ini untuk membuat note baru ke API
  static createNote(event) {
    console.log(event);
    return fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: event.noteTitle, body: event.noteDesc }),
    })
      .then((response) => {
        response.json();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil menambahkan note baru",
        });
      })

      .catch((error) => {
        console.error("Gagal menambahkan note baru:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menambahkan note baru",
        });
      });
  }

  //   Gunakan Fungsi ini untuk pengambil data dari API
  static getNotes() {
    return fetch(`${API_BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Something went wrong`));
        }
      })
      .then((responseJson) => {
        const { data: notes } = responseJson;
        return Promise.resolve(notes);
      });
  }

  //   Panggil Fungsi ini untuk Menghapus data dari API
  static deleteNote(event) {
    const noteId = event;
    return fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal menghapus note");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Note berhasil di hapus:", data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil menghapus note",
        });
      })

      .catch((error) => {
        console.error("Gagal menghapus note:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus note",
        });
      });
  }
}

export default NotesApi;
