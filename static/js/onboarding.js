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

// removes prompt fields on type
var OnType = function (field) {
    if (!!document.getElementById("PleaseEnter" + field) == true) {
        document.getElementById("PleaseEnter" + field).remove()
    }
    if (!!document.getElementById("InvalidCredentials") == true) {
        document.getElementById("InvalidCredentials").remove()
    }
}

var PleaseEnterParagraph = function (FieldID) {
    let FieldToEnter = null
    for (x in GlobalFieldnames) {
        if (FieldID.includes(GlobalFieldnames[x])) {
            FieldToEnter = GlobalFieldnames[x]
        }
    }
    prefix = '<p class="text-red text-xs italic text-left" id="'
    suffix = '"> Please Enter your ' + FieldToEnter + '.</p>'
    html = prefix + FieldID + suffix
    return html

}

var PleaseEnter = function (field) {
    try {
        if (!!document.getElementById("PleaseEnter" + field) == false) {
            document.getElementById("Div" + field).innerHTML += PleaseEnterParagraph("PleaseEnter" + field)
            document.getElementById(field).focus()
        }
    } catch (err) {
        console.log("field", field)
        console.log("error", err)
    }
}

var ConvertHTMLFileInputToBase64 = function (file) {
    let FileName = null
    try {
        FileName = file.name
    } catch (err) {
        return {
            "Error": "File Not Uploaded"
        }
    }
    var Base64Img = {}
    if (FileName.includes(".jpg") || FileName.includes(".png") || FileName.includes(".jpeg") || FileName.includes(".webp") || FileName.includes(".bmp") || FileName.includes(".tiff") || FileName.includes(".tif") || FileName.includes(".svg")) {
        const reader = new FileReader()
        Base64Img["FileName"] = FileName
        reader.readAsDataURL(file)
        reader.onload = function () {
            Base64Img["Data"] = reader.result.split(',')[1]
        }
    } else {
        return {
            "Error": "File type not supported"
        }
    }
    return Base64Img
}

var GetInputFields = function () {
    let Fieldarray = new Array(GlobalFieldnames.length)
    let FileUploadFields = []
    let data = {}
    let emptyfields = false
    for (x in GlobalFieldnames) {
        if (GlobalFieldnames[x].includes("Photo")) {
            FileUploadFields.push(document.getElementById(GlobalFieldnames[x]))
        } else {
            Fieldarray[x] = document.getElementById(GlobalFieldnames[x])
        }
    }
    for (x in Fieldarray) {
        data[Fieldarray[x].id] = Fieldarray[x].value
        if (data[Fieldarray[x].id] == "") {
            emptyfields = true
            PleaseEnter(Fieldarray[x].id)
        }
    }
    for (x in FileUploadFields) {
        const PhotoFieldName = FileUploadFields[x].id
        const y = ConvertHTMLFileInputToBase64(FileUploadFields[x].files[0])
        data[PhotoFieldName] = y
    }
    if (emptyfields) {
        return "empty"
    } else {
        return data
    }

}

var PostEmployeeDetails = function (data) {
    const xhr = new XMLHttpRequest()
    const payload = JSON.stringify(data)
    xhr.open("POST", "/recieveworkerdata", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(payload)
    console.log(payload)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText)
            ClearFields();
        }
    }
}

var register = function () {
    let Fieldarray = GetInputFields()
    if (Fieldarray != "empty") {
        PostEmployeeDetails(Fieldarray)
    }
}

var GetTemplate=function(){
    var template=document.getElementsByTagName("template")[0]
    document.getElementById("all_workers").innerHTML+=template.innerHTML
    return template
}

var GetAllEmployees = function () {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "/getallemployees", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const ResponseTextAllWorkers = JSON.parse(xhr.responseText)
            for (const [key, value] of Object.entries(ResponseTextAllWorkers)) {
                const Workers = value
                for (const [key, value] of Object.entries(Workers)) {
                }
            }
            console.log(GetTemplate())
        }
    }
}

GetAllEmployees()