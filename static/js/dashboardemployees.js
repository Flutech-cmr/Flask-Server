var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/getcollection/" + "EmployeeDetails", true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const returnstat = JSON.parse(xhr.responseText);
            const parent = document.getElementById("employeelistparent");
            for ([key, value] of Object.entries(returnstat)) {
                let template = getemployeetemplate();
                parent.appendChild(template);
                document.getElementsByClassName("EmployeeName")[key].innerText = value["Employee Name"];   
                document.getElementsByClassName("EmployeeID")[key].innerText = value["Employee ID"];
                document.getElementsByClassName("EmployeeDept")[key].innerText = value["Employee Dept"];
                document.getElementsByClassName("EmployeeCompany")[key].innerText = value["Employee Company"];
                document.getElementsByClassName("DateOfJoining")[key].innerText = value["Date Of Joining"];
                document.getElementsByClassName("EmployeeRole")[key].innerText = value["Employee Role"];
                document.getElementsByClassName("MobileNumber")[key].innerText = value["Mobile Number"];
            }
        }
    }
}

var totalemployees = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/dashboardStats/" + "numberofemployees", true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const returnstat = JSON.parse(xhr.responseText);
            document.getElementById("totalemployees").innerText = returnstat
        }
    }
};

var getemployeetemplate = function () {
    const template = document.getElementsByTagName("template")[0];
    const clone = template.content.cloneNode(true);
    return clone;
}