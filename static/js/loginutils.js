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
    } else {
        FieldToEnter = GlobalFieldnames[1]
    }
    prefix = '<p class="text-red text-xs italic text-left" id="'
    suffix = '"> Please Enter your ' + FieldToEnter + '.</p>'
    html = prefix + FieldID + suffix
    console.log(html)
    return html

}

var InvalidLogin = function (prompt) {
    if (!!document.getElementById("InvalidCredentials") == false) {
        InvalidLoginPrompt = '<p class="text-xs ext-gray-700 mt-4" id="InvalidCredentials">' + prompt + '</p>'
        ButtonDiv = document.getElementById("DivButton")
        ButtonInnerHTML = ButtonDiv.innerHTML
        ButtonDiv.innerHTML = InvalidLoginPrompt + ButtonInnerHTML
    }
}

// removes prompt fields on type
var OnType = function (field) {
    if (!!document.getElementById("PleaseEnter" + field) == true) {
        document.getElementById("PleaseEnter" + field).remove()
    }
    if (!!document.getElementById("InvalidCredentials") == true) {
        document.getElementById("InvalidCredentials").remove()
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
        return [username, password];
    }
}

var StoreCredentials = function (response, EMP_ID) {
    localStorage.setItem("Flutech_Access_Level", response.access_level)
    localStorage.setItem("Flutech_EMP_ID", EMP_ID)
}

var FetchCredentials = function () {
    const IsAccessAvailable = localStorage.getItem("Flutech_Access_Level")
    const IsEmpIDAvailable = localStorage.getItem("Flutech_EMP_ID")
    return [IsAccessAvailable, IsEmpIDAvailable]
}

var CheckLoginFromDB = function (LoginCredentials) {
    PostCredentials = {
        "username": LoginCredentials[0],
        "password": LoginCredentials[1],
        "currentpage": window.location.href,
        "status": "NewLogin"
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/checklogin", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(PostCredentials));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response)
            if (response.status == "success") {
                window.location.href = "/" + response.redirect
                StoreCredentials(response, LoginCredentials[0])
            } else if (response.status == "notauthorized") {
                InvalidLogin("You are not authorized to access this page.")
            } else {
                InvalidLogin("Invalid Credentials. Please try again.")
            }
            ClearFields();
        }
    }

}

var PreviousLoginExists = function (payload) {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/checklogin", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhr.send(JSON.stringify(payload))
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            if (response.status == "success") {
                window.location.href = "/" + response.redirect
            } else if (response.status == "notauthorized") {
                InvalidLogin("You are not authorized to access this page.")
            } else {
                InvalidLogin("Invalid Credentials. Please try again.")
            }
            ClearFields();
        }
    }
}

// this is the login utility for the login page
var AutoLoginOnPageLoad = function () {
    const FetchedCredentials = FetchCredentials()
    if (FetchedCredentials[0] == "null" || FetchedCredentials[1] == "null" || FetchedCredentials[0] == null || FetchedCredentials[1] == null) {
        console.log("No previous login found")
        const credentials = GetInputFields(GlobalFieldnames)
        CheckLoginFromDB(credentials)
    } else {
        console.log("Previous login found")
        const payload = {
            "username": FetchedCredentials[1],
            "access_level": FetchedCredentials[0],
            "currentpage": window.location.href,
            "status": "PreviousLogin"
        }
        PreviousLoginExists(payload)
    }
}

var login = function () {
    const credentials = GetInputFields(GlobalFieldnames)
    CheckLoginFromDB(credentials)
}