

var fetchattendance = function (id) {
    console.log("attempting to fetch attendance")
    const projectname = id.split("-")[0];
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/DownloadAttendance/" + projectname, true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const allprojects = JSON.parse(xhr.responseText);
            console.log(allprojects);
            if (allprojects["status"] == "failed") {
                toggleModal('modal-id')
            }
            else if (allprojects["status"] == "success") {
                // download file from server
                console.log("downloading file");
                var a = document.createElement("a");
                a.href = allprojects["DownloadURL"];
                a.download = projectname + ".xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}

var AttendanceMarkedToday = function (id) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/dashboard/attendancemarkedtoday", true);
    const data = {
        "ProjectName": id
    }
    xhr.send(JSON.stringify(data));
}
var CheckAttendanceStatus = async function (id) {
    let projectname = id.split("-")[0]
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/dashboard/attendancemarkedtoday-" + projectname, true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const statustoday = JSON.parse(xhr.responseText);
            if (statustoday["status"] == "success") {
                document.getElementById(id).innerText = "Marked Today";
            }
            else if (statustoday["status"] == "failed") {
                document.getElementById(id).innerText = "Not Marked Today";
            }

        }
    }
}

    var populateTable = function (projectname) {
        let tboady = document.getElementById("attendancetable");
        let childelementcount = tboady.childElementCount;
        let tr = document.createElement("tr");
        tr.setAttribute("id", projectname + "-TR");
        if (childelementcount % 2 == 0) {
            tr.classList.add("bg-gray-50");
        }
        let td1 = document.createElement("td");
        td1.classList.add("p-4", "whitespace-nowrap", "text-sm", "font-normal", "text-gray-900");
        td1.innerHTML = projectname;
        let td2 = document.createElement("td");
        td2.classList.add("p-4", "whitespace-nowrap", "text-sm", "font-normal", "text-gray-900");
        let td3 = document.createElement("td");
        td3.classList.add("p-4", "whitespace-nowrap", "text-sm", "font-normal", "text-gray-900");
        let p = document.createElement("p");
        p.setAttribute("id", projectname + "-p");
        p.classList.add("hidden", "sm:inline-flex", "ml-5", "text-white", "bg-cyan-600", "hover:bg-cyan-700", "focus:ring-4", "focus:ring-cyan-200", "font-medium", "rounded-lg", "text-sm", "px-5", "py-2.5", "text-center", "items-center", "mr-3");
        p.innerHTML = "Download";
        p.onclick = function () {
            fetchattendance(this.id)
        }
        let p2 = document.createElement("p");
        p2.setAttribute("id", projectname + "-p-checking");
        p2.classList.add("text-base", "text-gray-900");
        p2.innerHTML = "Checking...";
        p2.onclick = function () {
            CheckAttendanceStatus(this.id)
        }
        p2.click();
        td2.appendChild(p);
        td3.appendChild(p2);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tboady.appendChild(tr);
    }

    var GetProjectFromAPi = function () {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/loadprojects", true);
        xhr.send(null);
        xhr.onload = function () {
            if (xhr.status == 200) {
                const allprojects = JSON.parse(xhr.responseText);
                for (const [key, value] of Object.entries(allprojects)) {
                    populateTable(value["Project Name"]);
                }
            }
        }
    }

    var PopulateProjects = function () {
        GetProjectFromAPi();
    }



    var GetStats = function (id) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/dashboardStats/" + id, true);
        xhr.send(null);
        xhr.onload = function () {
            if (xhr.status == 200) {
                const returnstat = JSON.parse(xhr.responseText);
                document.getElementById(id).innerText = returnstat
            }
        }
    }


    var CanAccessDashboard = function (credentials) {
        const IsAccessAvailable = credentials[0]
        const IsEmpIDAvailable = credentials[1]
        const WindowHeight = window.innerHeight;
        const WindowWidth = window.innerWidth;
        if (WindowHeight > WindowWidth) {
            window.location.href = "/notallowed"
            return
        }
        if (IsAccessAvailable != null && IsEmpIDAvailable != null) {
            if (IsAccessAvailable >= 1) {
                return
            }
            else {
                window.location.href = "/master"
                return
            }
        }
        else {
            window.location.href = "/master"
            return
        }
    }

    var postlocation = function () {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/postlocation", true);
        xhr.send(null);
        returntext = xhr.responseText
        console.log(returntext)
    }