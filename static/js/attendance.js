var postattendance = function (payload) {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/workerattendance", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(payload))
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.responseText)
            if (response["status"] == "success") {

                if (response["type"] == "intime") {
                    document.getElementsByClassName("intime")[payload["id"]].innerHTML = response["time"]
                }
                else if (response["type"] == "outtime") {
                    document.getElementsByClassName("outtime")[payload["id"]].innerHTML = response["time"]
                }
            }
        }
    }

}

var MarkInTime = function (id, workername, contractor, labourtype) {
    payload = {
        "Workername": workername,
        "ContractorID": contractor,
        "LabourType": labourtype,
        "id": id,
        "type": "intime"
    }
    postattendance(payload)

}

var MarkOutTime = function (id, workername, contractor, labourtype) {
    payload = {
        "Workername": workername,
        "ContractorID": contractor,
        "LabourType": labourtype,
        "id": id,
        "type": "outtime"
    }
    postattendance(payload)
}

var PopulateWorkeronPage = function (workername, contractor, labourtype, key) {
    const template = document.getElementsByTagName("template")[0]
    const allworkers = document.getElementById("all_workers")
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
}



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
                const workername = value["Workername"]
                const contractor = value["ContractorID"]
                const labourtype = value["LabourType"]
                PopulateWorkeronPage(workername, contractor, labourtype, key)
            }
        }
    }
}