let currentsong = new Audio()
let songs;


function formatTime(seconds) {
    if (seconds==NaN){
        return ("00 : 00")
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}


let getsongs = async () => {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let atag = div.getElementsByTagName("a");
    let songs = []
    for (let i = 0; i < atag.length; i++) {
        const element = atag[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.replace("http://127.0.0.1:5500/songs/", ""))
        }
    }
    return songs;
}
let playmusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (pause) {
        currentsong.play()
    }
    document.querySelector(".song-desc").innerHTML = track
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".song-duration").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)} `
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`
    })
}

let main = async () => {
    songs = await getsongs()
    playmusic(songs[0])
    let ul = document.querySelector(".songs-list").getElementsByTagName("ul")[0]
    for (let song of songs) {
        ul.innerHTML = ul.innerHTML + `<li>
        <img class="invert" src="music.svg">
        <div class="info">
            <div class="song-name">${song} </div>
        </div>
        <div class="play-button">
            <img class="invert pointer" src="play.svg">
        </div>
    </li>`
    }

    //add event listner to each list item
    Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
        let play = e.querySelector(".pointer")
        play.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            let changebtn = document.querySelector(".song-button").querySelectorAll("img")[1];
            playmusic(e.querySelector(".info").firstElementChild.innerHTML, true)
            changebtn.src = "pause.svg";

        });

    })
// adding previous button
    let previous= document.getElementById("previous")
    previous.addEventListener("click",(e)=>{
        console.log("previous clicked") 
        console.log(currentsong.src)  
       let index= songs.indexOf(currentsong.src.replace("http://127.0.0.1:5500/songs/", ""))
       if(index>0){
        playmusic(songs[index-1],true)
        changebtn.src="pause.svg"
       }
    })

    // adding next button
    let next= document.getElementById("next")
    next.addEventListener("click",(e)=>{
       let index= songs.indexOf(currentsong.src.replace("http://127.0.0.1:5500/songs/", ""))
       if(index+1<songs.length){
        playmusic(songs[index+1],true)
        changebtn.src="pause.svg"
       }
    })
//automatic changing the song after current song ends
    currentsong.addEventListener("ended",()=>{
        let index= songs.indexOf(currentsong.src.replace("http://127.0.0.1:5500/songs/", ""))
        if(index+1<songs.length){
         playmusic(songs[index+1],true)
    }
})


// changing play button
    let changebtn = document.querySelector(".song-button").querySelectorAll("img")[1];
    changebtn.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            changebtn.src = "pause.svg"
        }
        else {
            currentsong.pause()
            changebtn.src = "play.svg"
        }  
    })

//toggling whit playbar
     document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.offsetWidth)*100;
        document.querySelector(".circle").style.left=`${percent}%`
        currentsong.currentTime= (currentsong.duration *  percent)/100;
     })
     //changing the volume
     document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        let vol=e.target.value
        currentsong.volume=vol/100;
     })
     
    document.querySelector(".mute").addEventListener("click",(e)=>{
        currentsong.volume=0;
        document.querySelector(".volume").getElementsByTagName("input")[0].value=0
    })
    document.querySelector(".unmute").addEventListener("click",(e)=>{
        currentsong.volume=1;
        document.querySelector(".volume").getElementsByTagName("input")[0].value=100
    })

    //adding functionality to hamburger
    document.querySelector(".hamburger").addEventListener("click",(e)=>{
        document.querySelector(".left-side").style.left="0%"
    })
        //adding functionality to hamburger
        document.querySelector(".cross").addEventListener("click",(e)=>{
            document.querySelector(".left-side").style.left="-120%"
        })
}

main()