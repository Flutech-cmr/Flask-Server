
var uploadimages = function () {
    document.getElementById("recieve_images").click();
}

var recieve_images = function (this_element) {
    const file = this_element.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.load = function () {
        let image = document.createElement('img');
        let li=document.createElement('li');
        image.src = reader.result;
        li.appendChild(image);
        document.getElementById("lisrr").appendChild(li);
    }
}

var getprojects = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/dashboard/getprojects", true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const projects = JSON.parse(xhr.responseText);
            let selector = document.getElementById("selectproject");
            for ([key, value] of Object.entries(projects)) {
                const project = value["Project Name"];
                const option = document.createElement("option");
                option.value = project;
                option.innerText = project;
                selector.appendChild(option);
            }
            selector.options[1].selected = true;
        }
    }
}