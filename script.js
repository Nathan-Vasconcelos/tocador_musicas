const cover = document.getElementById('cover');
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const audio = document.getElementById('audio');
const play = document.getElementById('play');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const currentProgress = document.getElementById('corrent-progress');
const conteinerProgress = document.getElementById('conteiner-progress');
const shfflerButton = document.getElementById('shffler');
const repeateButton = document.getElementById('repeate');
const likeButton = document.getElementById('like');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('TotalTime');

const nothingElseMatters = {
    songName : 'Nothing Else Matters',
    bandName : 'Metallica',
    som : 'nothing else matters.mp3',
    capa : 'the-black-album.png',
    liked : false
};

const livinOnAPrayer = {
    songName : 'Livin\' on a Prayer',
    bandName : 'Bon Jovi',
    som : 'livin on a prayer.mp3',
    capa : 'slippery-when-wet.jpg',
    liked : false
};

const soOsLoucosSabem = {
    songName : 'Só os Loucos Sabem',
    bandName : 'Charlie Brown Jr',
    som : 'so os loucos sabem.mp3',
    capa : 'camisadez.jpg',
    liked : false
};

const playlist =JSON.parse(localStorage.getItem('playlist')) ?? [nothingElseMatters, livinOnAPrayer, soOsLoucosSabem];
let sortedPlaylist = [...playlist];

let isPlaying = false;
let index = 0;
let isShffled = false;
let repeateOn = false;

function playSong(){
    audio.play();
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    isPlaying = true;
}

function pauseSong(){
    audio.pause();
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    isPlaying = false;

}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length -1;
    }
    else{
        index -= 1;
    }
    initializeSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length -1){
        index = 0;
    }
    else{
        index += 1;
    }
    initializeSong();
    playSong();
}

function initializeSong(){
    cover.src = `imagens/${sortedPlaylist[index].capa}`;
    songName.innerText = `${sortedPlaylist[index].songName}`;
    bandName.innerText = `${sortedPlaylist[index].bandName}`;
    audio.src = `songs/${sortedPlaylist[index].som}`;
    likeButtonRender();
}

function updateProgress(){
    const barWidth = (audio.currentTime/audio.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    updateCurrentTime();
}

function jumpTo(event){
    const width = conteinerProgress.clientWidth;
    const clcikPosition = event.offsetX;
    const jumpToTime = (clcikPosition/width) * audio.duration;
    audio.currentTime = jumpToTime;
}

function shffleArray(preShffleArray){
    const size = preShffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShffleArray[currentIndex];
        preShffleArray[currentIndex] = preShffleArray[randomIndex];
        preShffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shffleButtonClicked(){
    if(isShffled === false){
        isShffled = true;
        shffleArray(sortedPlaylist);
        shfflerButton.classList.add('button-active')
    }
    else{
        isShffled = false;
        sortedPlaylist = [...playlist];
        shfflerButton.classList.remove('button-active')
    }
}

function repeateButtonClicked(){
    if(repeateOn === false){
        repeateOn = true;
        repeateButton.classList.add('button-active')
    }
    else{
        repeateOn = false;
        repeateButton.classList.remove('button-active')
    }
}

function nextOrRepeat(){
    if(repeateOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateCurrentTime(){
    currentTime.innerText = toHHMMSS(audio.currentTime);
}

function updateTotalTime(){
    totalTime.innerText = toHHMMSS(audio.duration);
}

function likeButtonRender(){
    if(sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('button-active');
    }
    else{
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.remove('button-active');
    }
}

function likeButtonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(sortedPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextOrRepeat);
audio.addEventListener('loadedmetadata', updateTotalTime);
conteinerProgress.addEventListener('click', jumpTo);
shfflerButton.addEventListener('click', shffleButtonClicked);
repeateButton.addEventListener('click', repeateButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
