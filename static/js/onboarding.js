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

// returns string with firt letter capitalized
var capitalizeFirstLetter = function (string) {
    const capitalized = string.charAt(0).toUpperCase() + string.slice(1);
    return capitalized
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
    let today = new Date().toLocaleDateString()
    today=today.replaceAll('/','-')
    data["Onboaded On"]=today
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
        console.log(Fieldarray[x].id, data[Fieldarray[x].id])
        if (Fieldarray[x].id.toLowerCase().includes("name")) {
            data[Fieldarray[x].id] = capitalizeFirstLetter(data[Fieldarray[x].id])
        }
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

var GetProjectName = function () {
    let currentURL = window.location.href
    let projectName = currentURL.split("/").pop()
    return projectName
}

var PostEmployeeDetails = function (data) {
    const xhr = new XMLHttpRequest()
    const currentpage = GetProjectName()
    const payload = JSON.stringify(data)
    xhr.open("POST", "/recieveworkerdata/" + currentpage, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(payload)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText)
            ClearFields();
            toggleModal('modal-id')
        }
    }
}

var register = function () {
    let Fieldarray = GetInputFields()
    if (Fieldarray != "empty") {
        PostEmployeeDetails(Fieldarray)
    }
}

var GetTemplate = function () {
    document.getElementById("all_workers").innerHTML += template.innerHTML
    return template
}

var PopulateWorkers = function (key, value) {

    const templateprefix0 = '<div class="templatediv"'
    const templateprefix1 = '  <a href="#" class="w-full border-2 border-b-4 border-gray-200 rounded-xl ">\
                        <div class="grid grid-cols-6 p-5 gap-y-2 bg-gray-100">\
                            <!-- Description -->\
                            <div class="col-span-5 md:col-span-4 ml-4 workercontainer">'
    const attributesprefix = '<p class = "text-gray-600 text-xs mt-2">'
    const attributesuffix = '</p>'
    const templatesuffix = '    </div>\
                        </div>\
                    </a>\
                </div>'
    let output = templateprefix0 + ' id=' + '"' + key + ' container' + '"' + '>' + templateprefix1
    for (const [key1, value1] of Object.entries(value)) {
        if (key1 == "AadharPhoto" || key1 == "PANPhoto" || key1 == "_id") {
            continue
        }
        output += attributesprefix + '<span class="text-red-500">' + key1 + '</span>' + ": " + value1 + attributesuffix
    }
    output += templatesuffix
    document.getElementById("all_workers").innerHTML += output
}

var AlreadyOnboardedWorkers = function () {
    const currentpage = GetProjectName()
    window.location.href = '/alreadyonboardedworkers/' + currentpage
}


var GetAllEmployees = function () {
    const currentpage = GetProjectName()
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "/getallworkers/" + currentpage, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const ResponseTextAllWorkers = JSON.parse(xhr.responseText)
            for (const [key, value] of Object.entries(ResponseTextAllWorkers)) {
                PopulateWorkers(key, value)
            }
        }
    }
}

