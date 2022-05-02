var totalemployees = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/dashboardStats/" + "numberofemployees", true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const returnstat = JSON.parse(xhr.responseText);
            document.getElementById("totalemployees").innerText = returnstat
        }
    }
    const x=xhr.responseText;
    console.log(x,"hello");
};