// Elementer fra HTML-siden
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search_results");
const trackList = document.getElementById("track_list");
const sangtitel = document.getElementById("sangtitel");
const queueList = document.getElementById("queue_list");

let albums = [];         // alle album fra json-filen
let queue = [];          // sange der venter
let currentSong = null;  // sangen der spiller lige nu

// Hent json-filen
async function loadAlbums() {
  const response = await fetch("albums.json");
  const data = await response.json();
  albums = data.albums;
}
loadAlbums();

// Kør søgningen hver gang man skriver i søgefeltet
searchInput.addEventListener("input", search);

function search() {
  const text = searchInput.value.trim().toLowerCase();

  // Tøm listen
  trackList.innerHTML = "";

  // Skjul resultater hvis feltet er tomt
  if (text === "") {
    searchResults.hidden = true;
    return;
  }
  searchResults.hidden = false;

  // Gå alle album og alle sange igennem
  for (const album of albums) {
    for (const track of album.tracks) {
      if (track.title.toLowerCase().includes(text)) {
        addSong(track.title + " - " + album.artist.name);
      }
    }
  }
}

// Tilføj en sang til søgeresultaterne med en "Vælg"-knap
function addSong(label) {
  const li = document.createElement("li");
  li.textContent = label + " ";

  const button = document.createElement("button");
  button.textContent = "Vælg";
  button.addEventListener("click", function () {
    if (currentSong === null) {
      // Der spiller ingenting, så sangen starter med det samme
      currentSong = label;
      sangtitel.textContent = label;
    } else if (queue.length >= 3) {
      // Køen er fuld
      alert("Køen er fuld (maks. 3 sange)");
      return;
    } else {
      // Der spiller noget, så sangen stilles bagerst i køen
      queue.push(label);
      showQueue();
    }

    searchInput.value = "";
    search();
  });

  li.appendChild(button);
  trackList.appendChild(li);
}

// Vis køen
function showQueue() {
  queueList.innerHTML = "";
  for (const song of queue) {
    const li = document.createElement("li");
    li.textContent = song;
    queueList.appendChild(li);
  }
}