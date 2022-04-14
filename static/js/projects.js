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
var GetProjectTemplates = function () {
    const Template = document.getElementsByTagName("template")[0];
    const TemplateHTML = Template.innerHTML;
    const projectdiv = document.getElementById("ProjectLists")
    return [TemplateHTML, projectdiv];
}

var Workeraction = function (id,button,projectname) {
    if(button=="AddWorkerButton"){
        window.location = "/workeronboarding/"+projectname;
    }
    else if(button=="TakeAttendanceButton"){
        window.location = "/takeattendance/"+projectname;
    }
}

var PopulateProjects = function () {
    let ProjectTemplates = GetProjectTemplates();
    let TemplateHTML = ProjectTemplates[0];
    let projectdiv = ProjectTemplates[1];
    let iter = 0;
    for (const [key, value] of Object.entries(GlobalProjectDetails)) {
        let project = value;
        if (project["Project Name"] != undefined && project["Site Location"] != undefined && project["City"] != undefined) {
            projectdiv.innerHTML += TemplateHTML;
            let Projectname = document.getElementsByClassName("template-projectname")[iter];
            let ProjectLocation = document.getElementsByClassName("template-sitelocation")[iter];
            let ProjectCity = document.getElementsByClassName("template-city")[iter];
            let templateparent = document.getElementsByClassName("template-parent")[iter];
            let AddWorkerButton = document.getElementsByClassName("onboardworkers")[iter];
            let TakeAttendanceButton = document.getElementsByClassName("takeattendance")[iter];
            Projectname.innerHTML = project["Project Name"];
            ProjectLocation.innerHTML = project["Site Location"];
            ProjectCity.innerHTML = project["City"];
            templateparent.id = project._id;
            AddWorkerButton.onclick = function () {Workeraction(iter,"AddWorkerButton",project["Project Name"])};
            TakeAttendanceButton.onclick = function () {Workeraction(iter,"TakeAttendanceButton",project["Project Name"])};
            iter++;

        }
    }
}
// entry point for this script
var LoadProjects = function () {
    GetProjectTemplates();
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
