var ClearFields = function () {
    document.getElementById("projectname").value = "";
    document.getElementById("sitelocation").value = "";
    document.getElementById("city").value = "";
}

var PleaseEnter = function (field) {
    if (field == "projectname") {
        if (!!document.getElementById("pleaseenterproject") == false) {
            document.getElementById("projectnamediv").innerHTML += '<p class="text-red text-xs italic text-left" id="pleaseenterprojectname">Please Enter project name.</p>'
            document.getElementById(field).focus()
        }
    }
    if (field == "sitelocation") {
        if (!!document.getElementById("pleaseentersitelocation") == false) {
            document.getElementById("sitelocationdiv").innerHTML += '<p class="text-red text-xs italic text-left" id="pleaseentersitelocation">Please Enter site location.</p>'
            document.getElementById(field).focus()
        }
    }
    if (field == "city") {
        if (!!document.getElementById("pleaseentercity") == false) {
            document.getElementById("citydiv").innerHTML += '<p class="text-red text-xs italic text-left" id="pleaseentercity">Please Enter city.</p>'
            document.getElementById(field).focus()
        }
    }
}
var capitalizeFirstLetter= function(string) {
    console.log(string)
    const capitalized = string.charAt(0).toUpperCase() + string.slice(1);
    console.log(capitalized)
    return capitalized
  }

var GetInputFields = function () {
    const ProjectNameField = document.getElementById("projectname")
    const SiteLocationField = document.getElementById("sitelocation")
    const CityField = document.getElementById("city")
    const ProjectName = ProjectNameField.value
    const SiteLocation = SiteLocationField.value
    const City = CityField.value
    if (ProjectName == "" || SiteLocation == "" || City == "") {
        if (ProjectName == "") {
            PleaseEnter("projectname")
        }
        if (SiteLocation == "") {
            PleaseEnter("sitelocation")
        }
        if (City == "") {
            PleaseEnter("city")
        }
    } else {
        ClearFields()        
        return [capitalizeFirstLetter(ProjectName),capitalizeFirstLetter(SiteLocation),capitalizeFirstLetter(City)];
    }
}

var OnType = function (field) {
    if (field == "city") {
        if (!!document.getElementById("pleaseentercity") == true) {
            document.getElementById("pleaseentercity").remove()
        }
    }
    if (field == "sitelocation") {
        if (!!document.getElementById("pleaseentersitelocation") == true) {
            document.getElementById("pleaseentersitelocation").remove()
        }
    }
    if (field == "projectname") {
        if (!!document.getElementById("pleaseenterprojectname") == true) {
            document.getElementById("pleaseenterprojectname").remove()
        }
    }
}

var PostSiteDetails = function (credentials) {
    const payload = {
        "Project Name": credentials[0],
        "Site Location": credentials[1],
        "City": credentials[2]
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addsite");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Allow-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(payload));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText)
            if (response.status == "success") {
                console.log(response.message)
                // window.location.href = "/project-tracker"
            }
        }
    }
}


var Register = function () {
    const credentials = GetInputFields();
    if (credentials != null) {
        PostSiteDetails(credentials);
    }

}