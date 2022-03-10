// initializing an empty array to set the field names for which the login utility must work for
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

// returning the inner html for the promt that asks the user to enter their credentials
var PleaseEnterParagraph = function (field) {
    return '<p class="text-red text-xs italic text-left" id="' + field + 'Please Enter your username.</p>'
}

// removes prompt fields on type
var OnType = function (field) {
    if (!!document.getElementById("PleaseEnter" + field) == true) {
        document.getElementById("PleaseEnter" + field).remove()
    }
}

// generates an html prompt for the user to enter their credentials if they havent already
var PleaseEnter = function (field) {
    console.log(field, "was empty")
    if (!!document.getElementById("PleaseEnter" + field) == false) {
        document.getElementById("Div" + field).innerHTML += PleaseEnterParagraph("PleaseEnter" + field)
        document.getElementById(field).focus()
    }
}

// fetches the input fields for the login function and ensures at all fields are available for the login utility to work
var GetInputFields = function (fieldnames) {
    const UsernameField = document.getElementById(fieldnames[0])
    const PasswordField = document.getElementById(fieldnames[1])
    const username = UsernameField.value
    const password = PasswordField.value
    if (username == "" || password == "") {
        if (username == "") {
            PleaseEnter(fieldnames[0])
        }
        if (password == "") {
            PleaseEnter(fieldnames[1])
        }
    } else {
        ClearFields(['MasterID', 'AuthID']);
        return [username, password];
    }
}

// this is the login utility for the login page
var login = function (fieldnames) {
    const credentials = GetInputFields(fieldnames)
    const username = credentials[0]
    const password = credentials[1]
    if (username == "Flutechhr") {
        if (password == "Flutechcmr") {
            window.location.href = "/masterpanel"
        }
    }
}
