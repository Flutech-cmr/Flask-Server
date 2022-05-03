var RefreshPage = function (InTime) {
    if (InTime == null) {
        InTime = 0;
    }
    setTimeout(function () {
        window.location.reload();
        console.log("refreshed");
    }, InTime);
}
var heightadjust = function () {
    let navbar=document.getElementsByTagName("nav")[0];
    let indigobody=document.getElementById("indigobackground");
    let navbarheight=navbar.offsetHeight;
    let indigobodyheight=indigobody.offsetHeight;
    console.log(navbarheight,indigobodyheight);
    indigobody.style.height=indigobodyheight-navbarheight+"px";
}