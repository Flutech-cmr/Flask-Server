var RefreshPage = function (InTime) {
    if (InTime == null) {
        InTime = 0;
    }
    setTimeout(function () {
        window.location.reload();
        console.log("refreshed");
    }, InTime);
}