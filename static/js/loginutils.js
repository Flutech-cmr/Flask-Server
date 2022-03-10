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
var PleaseEnterParagraph = function (FieldID) {
    let FieldToEnter = null
    if (FieldID.includes(GlobalFieldnames[0])) {
        FieldToEnter = GlobalFieldnames[0]
    }
    else {
        FieldToEnter = GlobalFieldnames[1]
    }
    prefix = '<p class="text-red text-xs italic text-left" id="'
    suffix = '"> Please Enter your '+FieldToEnter+'.</p>'
    html = prefix + FieldID + suffix
    console.log(html)
    return html

}

// removes prompt fields on type
var OnType = function (field) {
    if (!!document.getElementById("PleaseEnter" + field) == true) {
        document.getElementById("PleaseEnter" + field).remove()
    }
}

// generates an html prompt for the user to enter their credentials if they havent already
var PleaseEnter = function (field) {
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
        ClearFields();
        return [username, password];
    }
}

var CheckLoginFromDB = function (LoginCredentials) {
console.log("idle")
}

// this is the login utility for the login page
var login = function () {
    const credentials = GetInputFields(GlobalFieldnames)
    const username = credentials[0]
    const password = credentials[1]
    if (username == "Flutechhr") {
        if (password == "Flutechcmr") {
            window.location.href = "/masterpanel"
        }
    }
}
