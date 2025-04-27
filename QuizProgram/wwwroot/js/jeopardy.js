function playVideo() {
    console.log("video called");
    var video = document.getElementById("bookVideo");
    video.play();
}

function fadeInText() {
    var text = document.getElementById("overlay-text");
    text.classList.add("fade-in-text");
}