// This script posts the screensizes of the visitos along with other information

function GetDeviceIP() {
    const url = "https://api.ipify.org"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    // return pormise of ip address
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText);
            }
        }
    }
    )
}

let DeviceDetailsPayload = {
    "Screen Width": window.screen.width,
    "Screen Height": window.screen.height,
    "Logical Processors": window.navigator.hardwareConcurrency,
    "Time Of Visit": new Date(),
    "User Agent": window.navigator.userAgent,
    "Language": window.navigator.language,
    "Platform": window.navigator.platform,
    "Username": localStorage.getItem("Flutech_EMP_ID"),
    "GeoLocation": window.navigator.geolocation.getCurrentPosition(function (position) {
        return position.coords.latitude + "," + position.coords.longitude;
    }),
    "IP": "ip"

};

function post_screen_size() {
    ip = GetDeviceIP();
    ip.then(function (value) {
        DeviceDetailsPayload["IP"] = value;
    }
    )
    console.log(DeviceDetailsPayload);
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
