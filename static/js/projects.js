// initializing an empty array to set the field names for which the project utility must work for
var GlobalFieldnames = []
var GlobalProjectDetails = {}

// setting global field names from html script call
var SetGlobalFieldnames = function (fieldnames) {
    GlobalFieldnames = fieldnames
}

// clearing input fields in html on load and on wrong input
var ClearFields = function () {
    for (let i = 0; i < GlobalFieldnames.length; i++) {
        document.getElementById(GlobalFieldnames[i]).value = ""
    }
}

var PopulateProjects = function () {
    for (const [key, value] of Object.entries(GlobalProjectDetails)) {
        const project = value;
        for (const [key, value] of Object.entries(project)) {
            console.log(key, value)
        }
    }
}

var LoadProjects = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/loadprojects", true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const projects = JSON.parse(xhr.responseText);
            GlobalProjectDetails = projects;
            PopulateProjects();
        }
    }
}

