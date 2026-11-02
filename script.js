function jukebox () {
    
}

// denne funktion henter data fra albums.json og viser dem i en liste på siden
let trackListElement = document.getElementById("tracks");

fetchData("albums.json").then((data) => {
  console.log(data);
  const albums = data.albums;
  for (let i = 0; i < albums.length; i++) {
    //console.log(albums[i].title);
    const trackList = albums[i].tracks;
    for (let h = 0; h < trackList.length; h++) {
      console.log(trackList[h].title);
      trackListElement.innerHTML =
        trackListElement.innerHTML + "<li>" + trackList[h].title + "</li>";
    }
  }
});






//Magi - det taler vi om senere!!
async function fetchData(url) {
  let request = await fetch(url);
  let json = await request.json();
  return json;
}