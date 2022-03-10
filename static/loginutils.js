var ClearFields = function (fieldnames) {
    console.log(fieldnames)
    for (let i = 0; i < fieldnames.length; i++) {
        document.getElementById(fieldnames[i]).value = ""
    }
    console.log("Cleared fields")
}
