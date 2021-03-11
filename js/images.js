'use strict';

/*  
1. images model.
2. render images.
*/

var gNextId = 0;
var gImgs;
var imgNames = [
    "aag", "ackbar", "afraid", "aint-got-time", "ams", "ants", "apcr",
    "atis", "away", "awesome", "awesome-awkward", "awkward", "awkward-awesome",
    "bad", "badchoice", "bd", "bender", "bihw", "biw", "blb", "boat", "both",
    "bs", "buzz", "captain", "captain-america", "cb", "cbg", "center", "ch",
    "cheems", "chosen", "cmm", "crazypills", "cryingfloor", "db", "disastergirl",
    "dodgson", "doge", "drake", "ds", "dsm", "dwight", "elf", "ermg",
    "fa", "facepalm", "fbf", "feelsgood", "fetch", "fine", "firsttry",
    "fmr", "fry", "fwp", "gandalf", "gb", "gears", "ggg", "gru", "grumpycat",
    "hagrid", "happening", "harold", "hipster", "icanhas", "imsorry",
    "inigo", "interesting", "ive", "iw", "jd", "jetpack", "joker", "jw",
    "keanu", "kermit", "kombucha", "leo", "live", "ll", "lrv", "mb",
    "michael-scott", "millers", "mini-keanu", "mmm", "money", "mordor",
    "morpheus", "mw", "nice", "noidea", "ntot", "oag", "officespace",
    "older", "oprah", "patrick", "persian", "philosoraptor", "pigeon",
    "ptj", "puffin", "red", "regret", "remembers", "rollsafe",
    "sad-biden", "sad-boehner", "sad-bush", "sad-clinton", "sad-obama",
    "sadfrog", "saltbae", "sarcasticbear", "sb", "scc", "sf", "sk",
    "ski", "snek", "soa", "sohappy", "sohot", "soup-nazi", "sparta",
    "spiderman", "spongebob", "ss", "stew", "stonks", "stop-it",
    "success", "tenguy", "toohigh", "tried", "trump", "ugandanknuck",
    "whatyear", "winter", "wkh", "wonka", "xy", "yallgot", "yodawg",
    "yuno", "zero-wing"
];

function init() {
    gImgs = createImgs(imgNames);
    renderImgs(gImgs);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function randomEdit() {
    var randNo = getRandomInt(gImgs.length);
    initMemeEditor(randNo, gImgs[randNo].name);
}

function orderImgs() {
    gImgs = createImgs(imgNames.sort());
    renderImgs(gImgs);
    if (currentView === "meme"){
        currentView = 'gallery';
        toggleView();
    }
}
function randomImgs() {
    var array = imgNames;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    gImgs = createImgs(array);
    renderImgs(gImgs);
    if (currentView === "meme"){
        currentView = 'gallery';
        toggleView();
    }
}

function createImgs(imgNames) {
    var imgs = [];
    gNextId = 0;
    imgNames.map(function(name) {
        imgs.push(createImage(name));
    });
    return imgs;
}

function createImage(name) {
    return {
        id: gNextId++,
        url: './img/gallery/' + name + '.jpg',
        name: name
    };
}

function renderImgs(imgs) {
    var strHtml = imgs.map(function (img, idx) {
        return `
        <img id='${img.id}' src='${img.url}' onclick="initMemeEditor(${img.id},'${img.name}',this)" alt='meme picture'/>
        `
    })
        .join(' ')
        
    document.querySelector('.gallery').innerHTML = strHtml;
}
