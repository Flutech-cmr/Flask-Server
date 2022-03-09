var ClearFields = function () {
    document.getElementById("MasterID").value = ""
    document.getElementById("AuthID").value = ""
}

var OnType = function (field) {
    if (field == "MasterID") {
        if (!!document.getElementById("pleaseenterusername") == true) {
            document.getElementById("pleaseenterusername").remove()
        }
    }
    if (field == "AuthID") {
        if (!!document.getElementById("pleaseenterpassword") == true) {
            document.getElementById("pleaseenterpassword").remove()
        }
    }
}

var login = function () {
    const credentials = GetInputFields()
    const username = credentials[0]
    const password = credentials[1]
    if(username=="Flutechhr"){
        if(password=="Flutechcmr"){
            window.location.href = "/masterpanel"
        }
    }
}

var GetInputFields = function () {
    const UsernameField = document.getElementById("MasterID")
    const PasswordField = document.getElementById("AuthID")
    const username = UsernameField.value
    const password = PasswordField.value
    if (username == "" || password == "") {
        if (username == "") {
            PleaseEnter("MasterID")
        }
        if (password == "") {
            PleaseEnter("AuthID")
        }
    } else {
        ClearFields()
        return [username, password];
    }
}