/*  TODO:
    - show high score, store it in local storage
 */
let words = [];
let globalWordIndex = 49;
const nWords = 50;

const levels = {
    easy: 5,
    medium: 3,
    hard: 2
};
let currentLevel = levels.easy;
let timeCount = currentLevel + 1, scoreCount = 0, isPlaying, wordDisplayed;
let wordToWrite, correctlyTypedWord;

let currentWord  = document.querySelector('#current-word'),
    inputWord = document.querySelector('#input-word'),
    time = document.querySelector('#seconds'),
    timeLeft = document.querySelector('#time-left'),
    score = document.querySelector('#score'),
    message = document.querySelector('#message'),
    difficultyLevel = document.querySelector('#difficulty');

let correctlyTypedWordSpan = document.createElement('span');
correctlyTypedWordSpan.classList.add('bg-warning');

// EVENT LISTENERS
window.addEventListener('load', () => fetchWords(50, init));
inputWord.addEventListener('input', startMatch);
difficultyLevel.addEventListener('change', changeLevel);


// FUCNTIONS
function init() { 
    time.textContent = currentLevel;
    showWord();
    // call the countdown function every second
    setInterval(countdown, 1000);
    // checking the game status every 0.1s
    setInterval(checkStatus, 500);
}
function showWord() {
    let wordIndex = globalWordIndex++ % nWords;
    wordDisplayed = words[wordIndex];

    wordToWrite = wordDisplayed;
    correctlyTypedWord = '';
    correctlyTypedWordSpan.textContent = '';

    currentWord.appendChild(correctlyTypedWordSpan);
    currentWord.appendChild(document.createTextNode(wordDisplayed));
}
function countdown() {
    if (timeCount > 0) {
        timeCount--;   
        timeLeft.textContent = timeCount;
    } else if(timeCount === 0) {
        isPlaying = false;
    }
}
function checkStatus() {
    if(!isPlaying && timeCount === 0) {
        message.textContent = 'Time Up!!';
        scoreCount = 0
        message.className = 'mt-3 text-danger';
    }
}
// Called on keyboard input
function startMatch() {
    if (this.value[this.value.length-1] === wordToWrite[0]) {
       correctlyTypedWord += wordToWrite[0];
       wordToWrite = wordToWrite.substr(1, wordToWrite.length); 
       currentWord.textContent = '';
       correctlyTypedWordSpan.textContent = correctlyTypedWord;
       currentWord.appendChild(correctlyTypedWordSpan);
       currentWord.appendChild(document.createTextNode(wordToWrite));
    } else {
        this.value = this.value.slice(0, this.value.length-1);
    }
    if (this.value === wordDisplayed) {
        isPlaying = true;
        message.textContent  = 'Correct!!'
        message.className = 'mt-3 text-success'
        this.value = ''
        scoreCount++;
        score.textContent = scoreCount;
        timeCount = currentLevel + 1; // will reset the clock to start the countdown again
        showWord();
    }
}
function changeLevel() {
    let level = this.options[this.selectedIndex].value;
    if (level === 'Medium') {
        inputWord.focus();
        scoreCount = 0;
        message.textContent = '';
        isPlaying = true;
        currentLevel = levels.medium;
        time.textContent = currentLevel;
        timeCount = currentLevel + 1;
        startMatch();
    }
    if (level === 'Hard') {
        inputWord.focus();
        scoreCount = 0;
        message.textContent = '';
        isPlaying = true;
        currentLevel = levels.hard;
        time.textContent = currentLevel;
        timeCount = currentLevel + 1;
        startMatch();
    }
}
// FETCH REQUESTS

// Get n words from an API and saves them to the global variables words, 
// then call the callback function (which is supposed to be init())
function fetchWords(n, callbackFn){
fetch(`https://random-word-api.herokuapp.com/word?number=${n}&swear=0`)
    .then(response => response.json())
    .then(json => {
        words = json;
        callbackFn();
    });
}