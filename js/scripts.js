window.addEventListener("load", () => {
   class AudioPlayer {
      static API_KEY = "7f9451dc34msh40dd5dba6adf75ep15ee18jsn6a82f7114f0d";
      static SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
      static DEFAULT_HEADERS = {
         'X-RapidAPI-Key': AudioPlayer.API_KEY,
         'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
      };
      static SECTIONS = {
         main: "main",
         playlist: "playlist",
      };
      static inputArtistName = document.getElementById("inputArtistName");
      static searchBtn = document.getElementById("search-btn");
      static cardsOutput = document.getElementById("cards-output");
      static playlistOutput = document.querySelector(".audioplayer__playlist-output");
      static audioTrack = document.querySelector(".audioplayer-audio");
      static playBtn = document.querySelector(".audioplayer__button--play");
      static trackDuration = document.querySelector(".audioplayer__controls-track-duration");

      constructor (data = [], playlist = []) {
         this.data = data;
         this.playlist = playlist,
         this.renderPlaylist();

         AudioPlayer.searchBtn.onclick = () => {
            this.getData(AudioPlayer.inputArtistName.value)
            .then(() => this.renderData(this.data));
         };
         
         // AudioPlayer.playBtn.onclick = () => {
         //    const playlistData = this.getPlaylistData();
         //    AudioPlayer.audioTrack.src = playlistData[0].preview;
         //    AudioPlayer.audioTrack.play();
         // }
         
      }
   
      async getData (trackName = "") {
         try {
            const responseData = await fetch (AudioPlayer.SEARCH_URL + trackName, {
               headers: AudioPlayer.DEFAULT_HEADERS
            });
            const data = await responseData.json();
            this.data = data.data ? data.data : [];
            console.log(this.data);

         } catch (e) {
            console.log (e)
         }
      }

      getPlaylistData() {
         return JSON.parse(localStorage.getItem("Playlist") || "[]");
      }
   
      addPlaylistData(track) {
         const oldPlaylist = this.getPlaylistData();
         localStorage.setItem("Playlist", JSON.stringify([...oldPlaylist, track]));
      }
   
      removePlaylistData(id) {
         const oldPlaylist = this.getPlaylistData();
         localStorage.setItem("Playlist", JSON.stringify([...oldPlaylist].filter((track) => track.id !== id)));
      }
   
      checkIfPlaylistContainsTrack(id) {
         return this.getPlaylistData().find((track) => track.id === id) ? true : false;
      }

      renderData(dataToRender, outputElement = AudioPlayer.cardsOutput, isUsingAsPlayist = false) {
         outputElement.innerHTML = "";
   
         dataToRender.forEach((track) => {
            const { id, title, artist, album, duration, rank,  preview} = track;
   
            const isTrackAddedToPlaylist = this.checkIfPlaylistContainsTrack(id);
   
            outputElement.innerHTML += `<figure id="${id}" class="audioplayer__track-card">
               <div class="audioplayer__track-image-block"><img  class="audioplayer__track-image" src="${album.cover_medium}" alt="image"></div>
               <figcaption class="audioplayer__track-description">
                  <h3>${artist.name}</h3>
                  <p>${title}</p>
                  <h4>album: ${album.title}</h4>
                  <p>rating: ${rank}</p>
                  <button class="audioplayer__track-button" id="playlist-button">${
                     isTrackAddedToPlaylist ? "Delete from playlist" : "Add to playlist"
                   }</button>
               </figcaption>
            </figure>`
         });

         const tracksBtn = document.querySelectorAll("#playlist-button");

         [...tracksBtn].forEach((btn, i) => {
            btn.onclick = () => {
               const currentTrack = dataToRender[i] || null;
               if (this.checkIfPlaylistContainsTrack(currentTrack.id)) {
                  this.removePlaylistData(currentTrack.id);
                  btn.textContent = "Add to playlist"
                  this.renderPlaylist(currentTrack.id);
               } else {
                  this.addPlaylistData(currentTrack);
                  btn.textContent = "Delete to playlist"
                  this.renderPlaylist(currentTrack);

               }
            }
         })
      }
      renderPlaylist () {
         AudioPlayer.playlistOutput.innerHTML = "";
         const playlistData = this.getPlaylistData();
         let trackCounter = 1;
         playlistData.forEach((track) => {
            AudioPlayer.playlistOutput.innerHTML += `<p class="audioplayer__track track-in-playlist" id="${track.id}"><span>${trackCounter}. </span><span>${track.artist.name} - ${track.title}</span> 
            <button class="audioplayer__button-playlist audioplayer__button-playlist--delete _icon-trash-btn"></button>
            </p>`
            trackCounter++;
         })
         const trackInPlaylist = document.querySelectorAll(".track-in-playlist");
         [...trackInPlaylist].forEach((track, i) => {
            track.onclick = () => {
               [...trackInPlaylist].forEach((el => el.style.color = "#ffffff"));
               track.style.color = "#f23005";
            }
            track.ondblclick = (event) => {
               
               [...trackInPlaylist].forEach((el => el.style.color = "#ffffff"));
               let currentTrack = playlistData[i];
               console.log(currentTrack);
               track.style.color = "#f23005";
               this.renderTrackDuration(currentTrack);
               AudioPlayer.audioTrack.src = currentTrack.preview;

               AudioPlayer.playBtn.onclick = () => {
                  if (AudioPlayer.playBtn.classList.contains("_icon-play-btn")) {
                     AudioPlayer.audioTrack.play();
                     AudioPlayer.playBtn.classList.remove("_icon-play-btn");
                     AudioPlayer.playBtn.classList.add("_icon-pause-btn");
                  } else {
                        AudioPlayer.audioTrack.pause();
                        AudioPlayer.playBtn.classList.add("_icon-play-btn");
                        AudioPlayer.playBtn.classList.remove("_icon-pause-btn");
                     }
               }
            };
         });
      }
      renderTrackDuration (track) {
         AudioPlayer.trackDuration.textContent = "";
         const minutes = Math.floor(track.duration / 60).toString();
         const seconds = (track.duration - (Math.floor(track.duration / 60) * 60)).toString();
         const modificatedSeconds = seconds.length === 1 ?  "0" + seconds : seconds;
         AudioPlayer.trackDuration.textContent = `${minutes}:${modificatedSeconds}`
      }
   }

   new AudioPlayer();

});


const slider = document.querySelector('.slider');
const progress = document.querySelector('.progress');

slider.oninput = function(e){
  progress.style.width = `${e.target.value}%`;
};
