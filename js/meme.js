'use strict';

var gMeme;
var gCtx;
var gImgObj;

function createGmeme(imgId, name) {
    return {
        selectedImgId: imgId,
        name: name,
        txts: [createTxt('Your Text', 150, 70), createTxt('Your Text', 150, 300)],
        votes: 0
    };
}

function createTxt(line, x, y) {
    return {
        //object txt = {property:value}
        line: line,
        size: 40,
        align: 'left',
        color: '#000000', // in color picker, if choosing color from platte notice it stays "solid".
        fontFamily: 'Impact',
        isOutline: true,
        lineWidth: 2, // outline width
        strokeStyle: '#ffffff',
        isShadow: false,
        shadowColor: '#000000',
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 0,
        x: x,
        y: y
    };
}

function initMemeEditor(imgId, imgName) {
    toggleView();
    gMeme = createGmeme(imgId, imgName);
    initCanvas();
    renderTxtsEditor();
}

function initCanvas() {

    var canvas = document.querySelector('.memeCanvas');
    gCtx = canvas.getContext('2d');

    gImgObj = new Image();
    gImgObj.src = getImgSrc();

    gImgObj.onload = function () {
        canvas.width = gImgObj.width;
        canvas.height = gImgObj.height;
        gMeme.txts[1].y = gImgObj.height - 70;

        drawCanvas();
    };


}

function getImgSrc() {
    // imgIdx needed to find img src url in gImg[]
    var imgIdx = gImgs.findIndex(function (img) {
        return gMeme.selectedImgId === img.id;
    });

    return gImgs[imgIdx].url;
}

function drawCanvas() {
    gCtx.drawImage(gImgObj, 0, 0);

    gMeme.txts.forEach(function (txt) {
        drawTxt(txt);
    });
    drawVote();
}

function drawVote() {
    gCtx.font = 40 + 'px' + ' ' + 'Impact';
    gCtx.textAlign = 'left';
    gCtx.fillStyle = '#c4511e';
    
    gCtx.fillText(gMeme.votes.toString(), 50, 50);
    console.log('draw vote', gMeme);
}

function drawTxt(txt) {
    gCtx.font = txt.size + 'px' + ' ' + txt.fontFamily;
    gCtx.textAlign = txt.align;
    gCtx.fillStyle = txt.color;
    if (txt.isShadow) addTxtShadow(txt);
    if (txt.isOutline) addTxtOutline(txt);

    gCtx.fillText(txt.line, txt.x, txt.y);
}

function addTxtShadow(txt) {
    gCtx.shadowColor = txt.shadowColor;
    gCtx.shadowOffsetX = txt.shadowOffsetX;
    gCtx.shadowOffsetY = txt.shadowOffsetY;
    gCtx.shadowBlur = txt.shadowBlur;
}

function addTxtOutline(txt) {
    gCtx.strokeStyle = txt.strokeStyle;
    gCtx.lineWidth = txt.lineWidth;
    gCtx.strokeText(txt.line, txt.x, txt.y);
}

/**
 * editTxt() gets changes for txt and update gMeme model.
 * Update gMeme.txts[].txt = {property:value}
 * Redraws canvas.
 * Input types: text, number, checkbox, dropdown.
 * 
 *  txtIdx - the specific txt to change in []. it's line num -1 because idx starts with 0.
 *  property - (using data-* attributes) ex. line, size, align, color, isShadow.. 
 *  value - ex. 'text', 30, left, red, true..
 */
function editTxt(elinput, txtIdx) {
    var property = elinput.dataset.property;  // using data-* attributes
    var value;

    switch (elinput.type) {
        case 'select-one':
            value = elinput.options[elinput.selectedIndex].value;
            break;
        case 'checkbox':
            value = elinput.checked;
            break;
        default: // text, number
            value = elinput.value;
            break;
    }
    gMeme.txts[txtIdx][property] = value;

    drawCanvas();
}


function renderTxtsEditor() {
    var strHtml = gMeme.txts.map(function (txt, idx) {
        return `
        <div class="txt-editor">
                   
                    <p>
                    <button onclick="deleteTxt(${idx})"><i class="fas fa-eraser"></i></button>
                    <input type="text" data-property="line" placeholder="${txt.line}" oninput="editTxt(this,${idx})">
                    <i class="fas fa-text-height"></i> <input type="range" value="${txt.size}"  min="10" step="2" data-property="size" oninput="editTxt(this ,${idx})">
                    <input type="color" value="${txt.color}" data-property="color" oninput="editTxt(this,${idx})">
                    Family: 
                    <select data-property="fontFamily" oninput="editTxt(this,${idx})">
                    <option value="${txt.fontFamily}">${txt.fontFamily}</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Geneva">Geneva</option>
                    <option value="Verdana">Verdana</option>
                    </select>
                    </p>

                    <p>
                    <i class="fas fa-arrows-alt-h"></i> <input type="number" value="${txt.x}"  min="0" step="5" data-property="x" oninput="editTxt(this ,${idx})">
                    <i class="fas fa-arrows-alt-v"></i> <input type="number" value="${txt.y}"  min="0" step="5" data-property="y" oninput="editTxt(this ,${idx})">

                    <select data-property="align" oninput="editTxt(this,${idx})">
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                     </select>
                    </p>

                    <p>
                    <input id="outline" type="checkbox" data-property="isOutline" checked onclick="editTxt(this,${idx})">
                    <label for="outline">Outline</label>
                    Width: <input type="number" value="${txt.lineWidth}"  min="0" step="1" data-property="lineWidth" oninput="editTxt(this ,${idx})">
                    <input type="color" value="${txt.strokeStyle}" data-property="strokeStyle" oninput="editTxt(this,${idx})">
                    </p>
                    <p>
                    
                    <input id="shadow" type="checkbox" data-property="isShadow" onclick="editTxt(this,${idx})">
                    <label for="shadow">Shadow</label>
                    <input type="color" value="${txt.shadowColor}" data-property="shadowColor" oninput="editTxt(this,${idx})">
                    <i class="fas fa-arrows-alt-h"></i> <input type="number" value="${txt.shadowOffsetX}"  step="1" data-property="shadowOffsetX" oninput="editTxt(this ,${idx})">
                    <i class="fas fa-arrows-alt-v"></i><input type="number" value="${txt.shadowOffsetY}"  step="1" data-property="shadowOffsetY" oninput="editTxt(this ,${idx})">
                    Blur: <input type="number" value="${txt.shadowBlur}" data-property="shadowBlur" oninput="editTxt(this,${idx})">
                    </p>
                 
                </div>
        `
    })
        .join(' ');

    document.querySelector('.txts-list').innerHTML = strHtml;

}

function newTxtBtnClicked() {
    gMeme.txts.push(createTxt('New Line', 150, 150));
    drawCanvas();
    renderTxtsEditor();
}

function deleteTxt(txtIdx) {
    gMeme.txts.splice(txtIdx, 1); //arr.splice(start, deleteCount)
    drawCanvas();
    renderTxtsEditor();
}


/* REGISTER DOWNLOAD HANDLER */
function dlCanvas(eldllink) {
    var canvas = document.querySelector('.memeCanvas');

    var dt = canvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=canvas.png');
    console.log('dt',dt);
    eldllink.href = dt;
}

function like() {
    gMeme.votes++;
    drawCanvas();

    console.log('gMeme votes++',gMeme);
}

var meme_server = 'http://localhost:3001';

async function saveDB() {
    try{
        let url = meme_server + "/api/save";
        let uuid = sha256(gMeme.name + gMeme.txts[0].line + gMeme.txts[1].line);
        let body = {
            name: gMeme.name,
            toptext: gMeme.txts[0].line,
            bottomtext: gMeme.txts[1].line,
            votes: gMeme.votes,
            uuid: uuid,
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        console.log('saveDB', body)
    } catch(e) {
        console.error(e);
    }
}

async function likedImgs() {
    try{
        let url = meme_server + "/api/list";
        const response = await fetch(url, {method: 'GET'});
        var res = await response.json();
        console.log('allDB', res);
        var imgListDB = [];
        for (var i = 0; i < res.rows.rows.length; i++){
            var row = res.rows.rows[i];
            imgListDB.push(row.name);
        }
        gImgs = createImgs(imgListDB);
        renderImgs(gImgs); 
        return res;
    } catch(e) {
        console.error(e);
    }
}
async function getDB(name) {
    try{
        let url = meme_server + "/api/get";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: gMeme.name,
            })
        })
        var res = await response.json();
        console.log('getDB', res);
        if (res.rows.length === 0 || res.status !== 'ok') {
            return null;
        }
        var highVote = 0;
        var pickedItem = res.rows[0];
        for (var i = 0; i < res.rows.length; i++) {
            var item = res.rows[i];
            console.log("item votes", item.votes);
            if (item.votes !== null) {
                if (item.votes > highVote) {
                    highVote = item.votes;
                    pickedItem = item;
                }
            }
        }
        gMeme.votes = highVote;
        gMeme.txts[0].line = pickedItem.toptext;
        gMeme.txts[1].line = pickedItem.bottomtext;
        console.log('picked gMeme',gMeme)
        drawCanvas();
        return res;
    } catch(e) {
        console.error(e);
    }
}

function toggleView() {
    document.querySelector('.meme-container').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
}