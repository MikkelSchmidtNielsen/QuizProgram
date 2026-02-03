function playVideo() {
    console.log("video called");
    var video = document.getElementById("bookVideo");
    video.play();
}

function fadeInText() {
    var text = document.getElementById("overlay-text");
    text.classList.add("fade-in-text");
}

window.houseCupAnimate = () => {
    const el = document.querySelector(".housecup-overlay");
    if (!el) return;
    el.classList.remove("animate");
    void el.offsetWidth;
    el.classList.add("animate");
};

window.houseCupDiamonds = () => {
    console.log("houseCupDiamonds called");

    const overlay = document.querySelector(".housecup-overlay");
    if (!overlay) return;

    const tubes = Array.from(overlay.querySelectorAll(".tube"));
    if (!tubes.length) return;

    tubes.forEach((tube) => {
        const delta = parseInt(tube.dataset.delta || "0", 10);
        if (!delta || delta <= 0) return;

        const layer = tube.querySelector(".diamond-layer");
        if (!layer) return;

        // clear old
        layer.innerHTML = "";

        const w = layer.clientWidth || 0;
        const h = layer.clientHeight || 0;
        if (!w || !h) return;

        // 1 diamond per 100 points (remainder becomes last diamond)
        const step = 100;
        const count = Math.max(1, Math.ceil(delta / step));

        let remaining = delta;

        for (let i = 0; i < count; i++) {
            const value = (i === count - 1) ? remaining : Math.min(step, remaining);
            remaining -= value;

            const diamond = document.createElement("div");
            diamond.className = "diamond";

            const text = document.createElement("div");
            text.className = "diamond-text";
            text.textContent = `+${value}`;
            diamond.appendChild(text);

            // random horizontal position inside the glass
            const size = 18;
            const x = Math.max(2, Math.min(w - size - 2, Math.floor(Math.random() * (w - size))));
            diamond.style.left = `${x}px`;

            // start slightly above the glass
            diamond.style.top = `-24px`;

            // land stacked from bottom
            const gap = 4;
            const finalY = Math.max(6, h - (i + 1) * (size + gap) - 10);
            diamond.style.setProperty("--finalY", `${finalY}px`);

            layer.appendChild(diamond);
        }
    });
};

