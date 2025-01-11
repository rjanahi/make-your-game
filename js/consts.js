//variables.js

//Consts
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
const game = document.getElementById('game');
const after = document.getElementById('after');
const after2 = document.getElementById('after2');
const timer = document.getElementById("timer");
const welcome = document.getElementById('welcome');
const pauseMenu = document.getElementById("pauseMenu");
const playerNameDisplay = document.getElementById("displayNamel");
const goodbye = document.getElementById('gameOver');
const theName = document.getElementById('theName');


const scoreEl = document.querySelector('#scoreEl')
const levelEl = document.querySelector('#levelEl')
const pellets = [];
const boundries = [];
const powerUps = [];
const PLAYER_SPEED = 4;

const keys = {
    w: {
        pressed : false
    },
    s: {
        pressed : false
    },
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },
}


export{canvas,c,game,after,after2,timer,welcome,pauseMenu,playerNameDisplay,goodbye,theName,scoreEl,levelEl,pellets,boundries,powerUps,PLAYER_SPEED,keys}