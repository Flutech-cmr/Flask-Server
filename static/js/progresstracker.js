
var uploadimages = function () {
    document.getElementById("upload_images").click();
}

var recieve_images = function (this_element) {
    let files = this_element.files;
    let file_count = files.length;
    for (let i = 0; i < file_count; i++) {
        const file = files[i];
        console.log(file.name);
        
    }
    this_element.value = "";
}