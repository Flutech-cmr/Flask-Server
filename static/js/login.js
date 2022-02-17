// this script is called from the login.html file currently and is responsible for performing the login functions

var ClearFields = function () {
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""
}

var PleaseEnter = function (field) {
    if (field == "username") {
        if (!!document.getElementById("pleaseenterusername") == false) {
            document.getElementById("usernamediv").innerHTML += '<p class="text-red text-xs italic text-left" id="pleaseenterusername">Please Enter your username.</p>'
            document.getElementById(field).focus()
        }
    }
    if (field == "password") {
        if (!!document.getElementById("pleaseenterpassword") == false) {
            document.getElementById("passworddiv").innerHTML += '<p class="text-red text-xs italic text-left" id="pleaseenterpassword">Please Enter your password.</p>'
            document.getElementById(field).focus()
        }
    }
}

var GetInputFields = function () {
    const UsernameField = document.getElementById("username")
    const PasswordField = document.getElementById("password")
    const username = UsernameField.value
    const password = PasswordField.value
    if (username == "" || password == "") {
        if (username == "") {
            PleaseEnter("username")
        }
        if (password == "") {
            PleaseEnter("password")
        }
    } else {
        ClearFields()
        return [username, password];
    }
}

var OnType = function (field) {
    if (field == "username") {
        if (!!document.getElementById("pleaseenterusername") == true) {
            document.getElementById("pleaseenterusername").remove()
        }
    }
    if (field == "password") {
        if (!!document.getElementById("pleaseenterpassword") == true) {
            document.getElementById("pleaseenterpassword").remove()
        }
    }
}


var StoreCredentials = function (credentials) {
    const username = credentials[0]
    const password = credentials[1]
    localStorage.setItem("Flutech_username", username)
    localStorage.setItem("Flutech_password", password)

}

var login = function () {
    const credentials = GetInputFields()
    StoreCredentials(credentials)
    posttoserver(credentials)
}

var posttoserver = function (credentials) {
    const username = credentials[0]
    const password = credentials[1]
    const url='/checklogin'
    const data={
        "username":username,
        "password":password
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    // set cross origin header
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            if (response.status == "success") {
                window.location.href = "/home"
            } else {
                alert(response.message)
            }
        } else {
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
