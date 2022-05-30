var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/getcollection/" + "EmployeeDetails", true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const returnstat = JSON.parse(xhr.responseText);
            const parent = document.getElementById("employeelistparent");
            const maxchildren = 20;
            for ([key, value] of Object.entries(returnstat)) {
                let template = getemployeetemplate();
                parent.appendChild(template);
                document.getElementsByClassName("SlNo")[key].innerText = parseInt(key) + 1;
                document.getElementsByClassName("EmployeeName")[key].innerText = value["Employee Name"];
                document.getElementsByClassName("EmployeeID")[key].innerText = value["Employee ID"];
                document.getElementsByClassName("EmployeeDept")[key].innerText = value["Employee Dept"];
                document.getElementsByClassName("EmployeeCompany")[key].innerText = value["Employee Company"];
                document.getElementsByClassName("DateOfJoining")[key].innerText = value["Employee Date Of Joining"];
                document.getElementsByClassName("EmployeeRole")[key].innerText = value["Employee Role"];
                document.getElementsByClassName("MobileNumber")[key].innerText = value["Mobile Number"];
                document.getElementsByClassName("deleteuser")[key].id = value["_id"];
                if (parseInt(key) >= maxchildren) {
                    hidekey = parseInt(key) + 1;
                    document.getElementsByTagName("tr")[hidekey].classList.add("hidden");
                }
            }
            totalemployees(Object.keys(returnstat).length);
        }
    }
}

var totalemployees = function (totalemployees) {

    document.getElementById("totalemployees").innerText = totalemployees
};

var getemployeetemplate = function () {
    const template = document.getElementsByTagName("template")[0];
    const clone = template.content.cloneNode(true);
    return clone;
}

var addemployee = function () {
    const EmployeeName = document.getElementById("EmployeeName").value;
    const EmployeeID = document.getElementById("EmployeeID").value;
    const EmployeeDept = document.getElementById("EmployeeDept").value;
    const EmployeeCompany = document.getElementById("EmployeeCompany").value;
    const EmployeeDateOfJoining = document.getElementById("EmployeeDateOfJoining").value;
    const EmployeeRole = document.getElementById("EmployeeRole").value;
    const EmployeeMobileNumber = document.getElementById("EmployeeMobileNumber").value;
    let AppPrivilege = document.getElementById("AppPrivilege").value;
    if (EmployeeName == "" || EmployeeID == "" || EmployeeDept == "" || EmployeeCompany == "" || EmployeeDateOfJoining == "" || EmployeeRole == "" || EmployeeMobileNumber == "" || AppPrivilege == "") {
        alert("Please fill all the fields");
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/dashboard/addemployee", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            "Employee Name": EmployeeName,
            "Employee ID": EmployeeID,
            "Employee Dept": EmployeeDept,
            "Employee Company": EmployeeCompany,
            "Employee Date Of Joining": EmployeeDateOfJoining,
            "Employee Role": EmployeeRole,
            "Mobile Number": EmployeeMobileNumber,
            "App Privileges": AppPrivilege,
            "Password":EmployeeID+"pass"
        }));
        xhr.onload = function () {
            if (xhr.status == 200) {
                clearaddemployeemodal();
                location.reload();
            }
        }
    }
}

var clearaddemployeemodal = function () {
    document.getElementById("EmployeeName").value = "";
    document.getElementById("EmployeeID").value = "";
    document.getElementById("EmployeeDept").value = "";
    document.getElementById("EmployeeCompany").value = "";
    document.getElementById("EmployeeDateOfJoining").value = "";
    document.getElementById("EmployeeRole").value = "";
    document.getElementById("EmployeeMobileNumber").value = "";
    document.getElementById("AppPrivilege").value = "";
}

var ShowNextEmployees = function () {
    let rows = document.getElementsByTagName("tr");
    let endseries = document.getElementById("endseries");
    let startseries = document.getElementById("startseries");
    let maxxincolumn = 20;
    for (let i = 1; i <= parseInt(endseries.innerText); i++) {
        rows[i].classList.add("hidden");
    }
    startseries.innerText = parseInt(startseries.innerText) + maxxincolumn;
    endseries.innerText = parseInt(endseries.innerText) + maxxincolumn;
    for (let i = parseInt(startseries.innerText); i <= parseInt(endseries.innerText); i++) {
        rows[i].classList.remove("hidden");
    }
}

var ShowPreviousEmployees = function () {
    let rows = document.getElementsByTagName("tr");
    let endseries = document.getElementById("endseries");
    let startseries = document.getElementById("startseries");
    let maxxincolumn = 20;
    for (let i = parseInt(startseries.innerText); i <= parseInt(endseries.innerText) && i < rows.length; i++) {
        rows[i].classList.add("hidden");
    }
    startseries.innerText = parseInt(startseries.innerText) - maxxincolumn;
    endseries.innerText = parseInt(endseries.innerText) - maxxincolumn;
    for (let i = parseInt(startseries.innerText); i <= parseInt(endseries.innerText) && i < rows.length; i++) {
        rows[i].classList.remove("hidden");
    }
}

var deleteusertogle = function () {
    document.getElementById("delete-user-modal").classList.toggle("hidden");
}

var parentget = function (element) {
    const node = element.id
    const data = { "_id": node }
    localStorage.setItem("deleteemployee", JSON.stringify(data));
}

var confirmdelete = function () {
    const xhr = new XMLHttpRequest();
    const payload = localStorage.getItem("deleteemployee")
    xhr.open("POST", "/api/dashboard/deleteemployee", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(payload);
    xhr.onload = function () {
        if (xhr.status == 200) {
            location.reload();
            console.log("deleted");
            localStorage.removeItem("deleteemployee");
        }
    }
}

var ExportEmployeeDetails = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/dashboard/getemployeepdf", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            json = JSON.parse(xhr.responseText);
            jsonstatus = json.status;
            if (jsonstatus == "success") {
                var a = document.createElement('a');
                a.href = json.filepath;
                console.log(a.href)
                a.download = json.filename;
                a.id = "downloademployee";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}