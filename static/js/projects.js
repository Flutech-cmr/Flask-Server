// initializing an empty array to set the field names for which the project utility must work for
var GlobalFieldnames = []

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