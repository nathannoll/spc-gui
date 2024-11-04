"use strict";
const bulb = `💡`;
const bulb_div = document.getElementById('lightbulb');
let pid;
let vals = [.2, .3, .7, .8, .5];
let enc = vals.map(mapValueToPixel);
let panicking;
let statusLabel = document.getElementById('status-label');
let reminderTimeout;
const reminderMessage = document.getElementById('reminder-message');
function startReminderTimer() {
    clearTimeout(reminderTimeout);
    reminderTimeout = setTimeout(() => {
        if (reminderMessage) {
            reminderMessage.style.display = 'block';
        }
        panic();
    }, 60000);
}
function flip() {
    if (bulb_div.innerHTML == bulb)
        return bulb_div.innerHTML = '';
    return bulb_div.innerHTML = bulb;
}
// <div class="bar red">.60</div>
//     <div class="bar yellow">.50</div>
//     <div class="bar green">.40</div>
//     <div class="bar green">.30</div>
//     <div class="bar yellow">.20</div>
//     <div class="bar red">.10</div>
// let points = document.getElementById("points-div")!
const pointsDiv = document.getElementById("points-div");
const codeDiv = document.getElementById('code');
pointsDiv.innerHTML = '';
function addPoint() {
    vals.shift();
    enc.shift();
    const val = Number(codeDiv.value);
    const e = mapValueToPixel(val);
    vals.push(val);
    enc.push(mapValueToPixel(vals[vals.length - 1]));
    console.log('val', val, 'e', e);
    const ans = vals.map((v, i) => `<div class='point' style='margin-left:${(i + 1) * 125}px; top:${mapValueToPixel(v)}px'></div>`);
    console.log(ans, vals);
    pointsDiv.innerHTML = ans.join('');
    checkval(val, vals);
    if (reminderMessage) {
        reminderMessage.style.display = 'none';
    }
    startReminderTimer();
    // const ar  = vals.map((v,i)=>`<div class='point' style='left:${i*50}px></div>"`)
    // console.log(ar)
    // document.getElementById("points-div")!.innerHTML=ar.join('');
}
addPoint();
function mapValueToPixel(value) {
    const maxValue = 0.6;
    const maxPixel = 290;
    // Ensure the value is within the expected range
    if (value < 0)
        value = 0;
    if (value > maxValue)
        value = maxValue;
    // Map the value to pixel position
    const ans = maxPixel - (value / maxValue * maxPixel);
    console.log('value', value, 'ans', ans);
    return ans;
}
// function scale(x:number):number{
//     if(x>.6) return 0;
//     if(x<0) return 290;
//     return 290*
// }
// function measurmentToCircleDiv(v:number,i:number){
//     const div = `<div class="point" style="margin-left: 650px; top: 0px;"></div>`;
//     return 
// }
// addPoint()
function panic() {
    if (!panicking) {
        bulb_div.style.background = 'red';
        pid = setInterval(() => { flip(); }, 300);
        panicking = true;
    }
}
function checkval(val, vals) {
    if (val < 0.1) {
        panic();
        if (statusLabel) {
            statusLabel.textContent = "Loosen!";
        }
        return;
    }
    else if (val > 0.5) {
        panic();
        if (statusLabel) {
            statusLabel.textContent = "Tighten!";
        }
        return;
    }
    else if (val < 0.2) {
        calm();
        bulb_div.style.background = 'yellow';
        if (statusLabel) {
            statusLabel.textContent = "Loosen";
        }
        if (vals[vals.length - 2] < 0.2) {
            if (vals[vals.length - 2] >= 0.1) {
                panic();
                if (statusLabel) {
                    statusLabel.textContent = "Loosen!";
                }
            }
        }
    }
    else if (val > 0.4) {
        calm();
        bulb_div.style.background = 'yellow';
        if (statusLabel) {
            statusLabel.textContent = "Tighten";
        }
        if (vals[vals.length - 2] > 0.4) {
            if (vals[vals.length - 2] <= 0.5) {
                panic();
                if (statusLabel) {
                    statusLabel.textContent = "Tighten!";
                }
            }
        }
    }
    else {
        calm();
        if (statusLabel) {
            statusLabel.textContent = "all good";
        }
    }
}
function calm() {
    if (pid !== undefined) {
        clearInterval(pid);
        pid = undefined;
    }
    bulb_div.style.background = 'transparent';
    panicking = false;
    return bulb_div.innerHTML = bulb;
}
// panic()
// calm()
