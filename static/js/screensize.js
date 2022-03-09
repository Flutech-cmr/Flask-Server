// This script posts the screensizes of the visitos along with other information

let screen_width = window.screen.width;
let screen_height = window.screen.height;
let logicalProcessors = window.navigator.hardwareConcurrency
let time_now = new Date();
let payload = {
    "Screen Width": screen_width,
    "Screen Height": screen_height,
    "Logical Processors": logicalProcessors,
    "Time Of Visit": time_now

};
function post_screen_size() {
    // avoid cors
    let url = "/screen-sizes";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    console.log("screen size posted");
}
window.onload = post_screen_size();
