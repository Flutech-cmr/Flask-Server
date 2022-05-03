var GetProjectName = function () {
    let currentURL = window.location.href
    let projectName = currentURL.split("/").pop()
    return projectName
}

var EnableDisableButtons = function (id) {
    const intimebuttons = document.getElementsByClassName("intime")[id]
    const outtimebuttons = document.getElementsByClassName("outtime")[id]
    if (intimebuttons.innerHTML.includes("In-Time")) {
        intimebuttons.disabled = false
        outtimebuttons.disabled = true
    }
    else if (outtimebuttons.innerHTML.includes("Out-Time") && !intimebuttons.innerHTML.includes("In-Time")) {
        intimebuttons.disabled = true
        outtimebuttons.disabled = false
    }
}

var GetFlutterLocation = function (rand) {
    GetLocation.postMessage('GetFlutterLocation' + '|' + rand);
}

var postattendance = function (payload) {
    const xhr = new XMLHttpRequest()
    const projectname = GetProjectName()
    xhr.open("POST", "/workerattendance/" + projectname, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    if (payload["function"] == "marknew") {
        xhr.send(JSON.stringify(payload))
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(xhr.responseText)
                if (response["status"] == "success") {
                    if (response["type"] == "intime") {
                        const buttonin = document.getElementsByClassName("intime")[payload["id"]]
                        buttonin.innerHTML = response["time"]
                        buttonin.disabled = true
                        buttonin.style.backgroundColor = "grey"
                        document.getElementsByClassName("outtime")[payload["id"]].disabled = false
                    }
                    else if (response["type"] == "outtime") {
                        const buttonout = document.getElementsByClassName("outtime")[payload["id"]]
                        buttonout.innerHTML = response["time"]
                        buttonout.style.backgroundColor = "grey"
                        buttonout.disabled = true
                    }
                }
                EnableDisableButtons(payload["id"])
            }
        }
    }
    else if (payload["function"] == "checkprevious") {
        xhr.send(JSON.stringify(payload))
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(xhr.responseText)
                if (response["status"] == "success") {
                    if (response["type"] == "intime") {
                        const buttonin = document.getElementsByClassName("intime")[payload["id"]]
                        buttonin.innerHTML = response["time"]
                        buttonin.style.backgroundColor = "grey"
                        buttonin.disabled = true

                    }
                    else if (response["type"] == "outtime") {
                        const buttonout = document.getElementsByClassName("outtime")[payload["id"]]
                        buttonout.innerHTML = response["time"]
                        buttonout.style.backgroundColor = "grey"
                        buttonout.disabled = true
                    }
                }
                EnableDisableButtons(payload["id"])
            }
        }
    }
}
var GetAttendanceMarkerID = function () {
    const EMP_Id = localStorage.getItem("Flutech_EMP_ID")
    if (EMP_Id == null) {
        return "0"
    }
    else {
        return EMP_Id
    }
}

var MarkInTime = function (id, workername, contractor, labourtype) {
    const rand = Math.random()
    payload = {
        "Workername": workername,
        "ContractorID": contractor,
        "LabourType": labourtype,
        "id": id,
        "type": "intime",
        "function": "marknew",
        "Attendance-Marked-By": ""
    }
    payload["Attendance-Marked-By"] = GetAttendanceMarkerID()
    payload["random"] = rand
    GetFlutterLocation(rand)
    postattendance(payload)
}

var MarkOutTime = function (id, workername, contractor, labourtype) {
    const rand = Math.random()
    payload = {
        "Workername": workername,
        "ContractorID": contractor,
        "LabourType": labourtype,
        "id": id,
        "type": "outtime",
        "function": "marknew",
        "Attendance-Marked-By": ""
    }
    payload["Attendance-Marked-By"] = GetAttendanceMarkerID()
    payload["random"] = rand
    GetFlutterLocation(rand)
    postattendance(payload)
}

var CheckPreviousAttendance = async function (id, workername, contractor, labourtype) {
    payload = {
        "Workername": workername,
        "ContractorID": contractor,
        "LabourType": labourtype,
        "id": id,
        "type": "intime",
        "function": "checkprevious"
    }
    postattendance(payload)
    payload["type"] = "outtime"
    postattendance(payload)
}

// this function is responsible to populate all the workers on the page
var PopulateWorkeronPage = function (workername, contractor, labourtype, key) {
    const allworkers = document.getElementById("all_workers")
    const template = document.getElementsByTagName("template")[0]
    let clone = template.content.cloneNode(true)
    // set clone id
    clone.firstChild.id = "worker " + key
    allworkers.appendChild(clone)
    const intkey = parseInt(key)
    document.getElementsByClassName("workername")[intkey].innerHTML = workername
    document.getElementsByClassName("contractorname")[intkey].innerHTML = contractor
    document.getElementsByClassName("LabourType")[intkey].innerHTML = labourtype
    const intimebutton = document.getElementsByClassName("intime")[intkey]
    intimebutton.onclick = function () {
        MarkInTime(intkey, workername, contractor, labourtype)
    }
    const outtimebutton = document.getElementsByClassName("outtime")[intkey]
    outtimebutton.onclick = function () {
        MarkOutTime(intkey, workername, contractor, labourtype)
    }
    CheckPreviousAttendance(intkey, workername, contractor, labourtype)

}



// this function is the entrypoint for the page
var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest()
    const currentpage = GetProjectName()
    xhr.open("GET", "/getallworkers/" + currentpage, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText)
            const ResponseTextAllWorkers = JSON.parse(xhr.responseText)
            let maxkey = 0
            for (const [key, value] of Object.entries(ResponseTextAllWorkers)) {
                const workername = value["Workername"]
                const contractor = value["ContractorID"]
                const labourtype = value["LabourType"]
                PopulateWorkeronPage(workername, contractor, labourtype, key)
                maxkey += 1
            }
        }
    }
}