var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "/getallemployees", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const ResponseTextAllWorkers = JSON.parse(xhr.responseText)
            for (const [key, value] of Object.entries(ResponseTextAllWorkers)) {
                console.log(key, value)
            }
        }
    }
}

console.log("Hi Frands")