var ClearFields = function () {
    document.getElementById("feedbacktype").value = "Feedback"
    document.getElementById("messagearea").value = ""
}

var PleaseEnter = function (field) {
    if (field == "message") {
        if (!!document.getElementById("pleaseentermessage") == false) {
            let p = document.createElement("p")
            p.id = "pleaseentermessage"
            p.innerHTML = "Please enter a message"
            p.classList.add("text-red", "text-xs", "italic", "text-left")
            document.getElementById("messagediv").appendChild(p)
            document.getElementById(field).focus()
        }
    }
}

var OnType = function (field) {
    if (field == "message") {
        if (!!document.getElementById("pleaseentermessage") == true) {
            document.getElementById("pleaseentermessage").remove()
        }
    }

}

var GetInputFields = function () {
    const FeedbackField = document.getElementById("feedbacktype")
    const MessageField = document.getElementById("messagearea")
    const feedback = FeedbackField.value
    const message = MessageField.value
    if (message == "") {
        PleaseEnter("message")
    } else {
        ClearFields()
        return [feedback, message];
    }
}

var posttotelegram = function (topost) {
    const url = '/botmessage'
    const data = { "message": topost }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText)
        }
    }
    xhr.send(JSON.stringify(data))
}

var Submit = function () {
    const get = GetInputFields()
    let feedback = get[0]
    let message = get[1]
    const EmployeeInLocalStorage = localStorage.getItem("Flutech_EMP_ID")
    if (get != null && EmployeeInLocalStorage !== null) {
        const temp = "New " + feedback + " From Employee ID " + EmployeeInLocalStorage + " \n" + message
        posttotelegram(temp)
    }
}