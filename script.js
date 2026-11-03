const searchInput = document.getElementById("search_input");
const searchResults = document.getElementById("search_results");

const allAlbums = [];
const queue = [];

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
    song: allAlbums.flatMap((album) =>
      album.tracks.map(
        (track) => `${track.title} — ${album.artist.name} (${album.title})`
      )
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
}

loadCatalog().catch((error) => {
  console.error("Could not load the music catalog:", error);
});