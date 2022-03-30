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
                console.log(key, value)
                const workername = value["Workername"]
                const contractor = value["ContractorID"]
                const labourtype = value["LabourType"]
                PopulateWorkeronPage(workername, contractor, labourtype, key)
            }
        }
    }
}