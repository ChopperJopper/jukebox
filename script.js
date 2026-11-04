const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search_results");
const sangtitel = document.getElementById("sangtitel");
const songprogress = document.getElementById("songprogress");
const songTime = document.getElementById("songtime");
const queueList = document.getElementById("queue_list");
let progressInterval;

const allAlbums = [];
const queue = [];
let currentTrack = null;


const resultLists = {
  album: document.getElementById("album_list"),
  song: document.getElementById("track_list"),
  artist: document.getElementById("artist_list"),
  genre: document.getElementById("genre_list"),
};

async function loadCatalog() {
  const response = await fetch("albums.json");

  if (!response.ok) {
    throw new Error(`Could not load albums.json: ${response.status}`);
  }

  const data = await response.json();
  allAlbums.push(...data.albums);

  searchInput.addEventListener("input", showSearchResults);
}

function showSearchResults() {
  const searchText = searchInput.value.trim().toLowerCase();
  searchResults.hidden = searchText === "";

  for (const list of Object.values(resultLists)) {
    list.replaceChildren();
  }

  if (!searchText) return;

  const matches = {
    album: allAlbums.map((album) => album.title),
    artist: allAlbums.map((album) => album.artist.name),
    genre: allAlbums.flatMap((album) =>
      album.tracks.map((track) => track.genre.name)
    ),
  };

  for (const [type, values] of Object.entries(matches)) {
    const uniqueMatches = [...new Set(values)].filter((value) =>
      value.toLowerCase().includes(searchText)
    );

    for (const value of uniqueMatches) {
      const item = document.createElement("li");
      item.textContent = value;
      resultLists[type].append(item);
    }
  }

  const songMatches = allAlbums
    .flatMap((album) =>
      album.tracks.map((track) => ({
        track,
        label: `${track.title} — ${album.artist.name} (${album.title})`,
      }))
    )
    .filter(({ label }) => label.toLowerCase().includes(searchText));

  for (const { track, label } of songMatches) {
    const item = document.createElement("li");
    const chooseButton = document.createElement("button");

    item.append(document.createTextNode(`${label} `));
    chooseButton.type = "button";
    chooseButton.textContent = "Vælg";
    chooseButton.addEventListener("click", () => {
      queue.push({ track, label });
      updateQueueDisplay();

      if (!currentTrack) {
        playNextTrack();
      }

      searchInput.value = "";
      showSearchResults();
    });

    item.append(chooseButton);
    resultLists.song.append(item);
  }
}

function updateQueueDisplay() {
  queueList.replaceChildren();

  for (const { label } of queue) {
    const item = document.createElement("li");
    item.textContent = label;
    queueList.append(item);
  }
}

function playNextTrack() {
  currentTrack = queue.shift() ?? null;
  updateQueueDisplay();

  if (!currentTrack) {
    sangtitel.textContent = "Ingen sang valgt";
    songprogress.value = 0;
    songprogress.max = 100;
    songTime.textContent = "0:00 / 0:00";
    return;
  }

  sangtitel.textContent = currentTrack.track.title;
  simulateProgress(currentTrack.track.duration_ms);
}

function simulateProgress(durationMs) {
  clearInterval(progressInterval);

  const durationSeconds = durationMs / 1000;
  const startTime = performance.now();

  songprogress.max = durationSeconds;
  songprogress.value = 0;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function updateProgress() {
    const elapsed = Math.min(
      (performance.now() - startTime) / 1000,
      durationSeconds
    );

    songprogress.value = elapsed;
    songTime.textContent =
      `${formatTime(elapsed)} / ${formatTime(durationSeconds)}`;

    if (elapsed >= durationSeconds) {
      clearInterval(progressInterval);
      playNextTrack();
    }
  }

  updateProgress();
  if (durationSeconds > 0) {
    progressInterval = setInterval(updateProgress, 250);
  }
}

loadCatalog().catch((error) => {
  console.error("Could not load the music catalog:", error);
});