var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest();
    const project = currentproject();
    xhr.open("GET", "/getallworkers/" + project, true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const returnstat = JSON.parse(xhr.responseText);
            const parent = document.getElementById("workerlistparent");
            const maxchildren = 10;
            for ([key, value] of Object.entries(returnstat)) {
                let template = getemployeetemplate();
                parent.appendChild(template);
                document.getElementsByClassName("SlNo")[key].innerText = parseInt(key) + 1;
                document.getElementsByClassName("Workername")[key].innerText = value.Workername;
                document.getElementsByClassName("CompanyID")[key].innerText = value.CompanyID;
                document.getElementsByClassName("SiteID")[key].innerText = value.SiteID;
                document.getElementsByClassName("ContractorID")[key].innerText = value.ContractorID
                document.getElementsByClassName("LabourType")[key].innerText = value.LabourType;
                document.getElementsByClassName("DOB")[key].innerText = value.DOB;
                document.getElementsByClassName("BloodGroup")[key].innerText = value.BloodGroup;
                document.getElementsByClassName("MobileNumber")[key].innerText = value.MobileNumber;
                document.getElementsByClassName("AltMobileNumber")[key].innerText = value.AltMobileNumber;
                document.getElementsByClassName("EmergencyMobileNumber")[key].innerText = value.EmergencyMobileNumber;
                document.getElementsByClassName("EmergencyMobileNumber2")[key].innerText = value.EmergencyMobileNumber2;;
                document.getElementsByClassName("NameFather")[key].innerText = value.NameFather;
                document.getElementsByClassName("NameMother")[key].innerText = value.NameMother;
                document.getElementsByClassName("AadharNumber")[key].innerText = value.NameFather;
                document.getElementsByClassName("PANNumber")[key].innerText = value.NameMother;
                document.getElementsByClassName("PermanantAddress")[key].innerText = value.NameFather;
                document.getElementsByClassName("CurrentAddress")[key].innerText = value.NameMother;


                if (parseInt(key) >= maxchildren) {
                    hidekey = parseInt(key) + 1;
                    document.getElementsByTagName("tr")[hidekey].classList.add("hidden");
                }
            }
            totalworkers(Object.keys(returnstat).length);
        }
    }
}

var totalworkers = function (totalworkers) {

    document.getElementById("totalemployees").innerText = totalworkers


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
    const AppPrivilege = document.getElementById("AppPrivilege").value;
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
            "App Privileges": AppPrivilege
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
    let maxxincolumn = 10;
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
    let maxxincolumn = 10;
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
    const parentnode = element.parentNode.parentNode;
    const allnodes = parentnode.childNodes
    var data = {}
    allnodes.forEach(td => {
        const listt = td.classList;
        if (listt !== undefined) {
            if (listt.contains("Workername")) {
                data["Workername"] = td.innerText;
            }
            else if (listt.contains("AadharNumber")) {
                data["AadharNumber"] = td.innerText;
            }
            else if (listt.contains("SiteID")) {
                data["SiteID"] = td.innerText;
            }
        }
    });
    localStorage.setItem("deleteworker", JSON.stringify(data));
    console.log(data);
}

var confirmdelete = function () {
    const xhr = new XMLHttpRequest();
    const payload = localStorage.getItem("deleteworker")
    const projectname=currentproject()
    xhr.open("POST", "/api/dashboard/deleteworker_"+projectname, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(payload);
    xhr.onload = function () {
        if (xhr.status == 200) {
            // location.reload();
            console.log("deleted worker");
            localStorage.removeItem("deleteworker");
        }
    }
}

var currentproject = function () {
    const selector = document.getElementById("selectproject");
    const option = selector.options[selector.selectedIndex].value;
    return option;

}

var getprojects = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/dashboard/getprojects", true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const projects = JSON.parse(xhr.responseText);
            let selector = document.getElementById("selectproject");
            for ([key, value] of Object.entries(projects)) {
                const project = value["Project Name"];
                const option = document.createElement("option");
                option.value = project;
                option.innerText = project;
                selector.appendChild(option);
            }
            selector.options[1].selected = true;
            GetAllEmployees();
        }
    }
}