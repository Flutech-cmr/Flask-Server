// This script posts the screensizes of the visitos along with other information

const DeviceDetailsPayload = {
    "Screen Width": window.screen.width,
    "Screen Height": window.screen.height,
    "Logical Processors": window.navigator.hardwareConcurrency,
    "Time Of Visit": new Date(),
    "User Agent": window.navigator.userAgent

};

function post_screen_size() {
    const url = "/screen-sizes";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(DeviceDetailsPayload));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText);
        }
    }
}
window.onload = post_screen_size();