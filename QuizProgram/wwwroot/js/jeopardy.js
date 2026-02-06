/* ==========================================================================
   GLOBAL VARIABLES
   ========================================================================== */
const tubeEngines = new Map();
let audioContext;
let analyser;
let dataArray;
let pulseLoopId;

/* ==========================================================================
   VIDEO & UI HELPERS
   ========================================================================== */
function playVideo() {
    var video = document.getElementById("bookVideo");
    if (video) video.play();
}

function fadeInText() {
    var text = document.getElementById("overlay-text");
    if (text) text.classList.add("fade-in-text");
}

window.initBackgroundLoop = () => {
    const v1 = document.getElementById("bgVideo1");
    const v2 = document.getElementById("bgVideo2");
    if (!v1 || !v2) return;

    let active = v1;
    let next = v2;
    const overlap = 2.0;

    v1.classList.add("active");
    v1.style.zIndex = 2;
    v2.style.zIndex = 1;
    v1.play().catch(() => { });

    const loop = () => {
        if (!active || !active.duration) {
            requestAnimationFrame(loop);
            return;
        }
        const remaining = active.duration - active.currentTime;

        if (remaining <= overlap && next.paused) {
            next.currentTime = 0;
            next.play().then(() => {
                next.classList.add("active");
                next.style.zIndex = 2;
                active.style.zIndex = 1;
            }).catch(e => console.log("Fade play error", e));
        }

        if (active.ended || (remaining <= 0.1 && !next.paused)) {
            active.classList.remove("active");
            active.pause();
            active.currentTime = 0;
            active.style.zIndex = 1;
            const temp = active;
            active = next;
            next = temp;
        }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

/* ==========================================================================
   HOUSE CUP PHYSICS
   ========================================================================== */
window.houseCupAnimate = () => {
    const el = document.querySelector(".housecup-overlay");
    if (!el) return;
    el.classList.remove("animate");
    void el.offsetWidth;
    el.classList.add("animate");
};

window.houseCupDiamonds = () => {
    const overlay = document.querySelector(".housecup-overlay");
    if (!overlay) return;
    const tubes = Array.from(overlay.querySelectorAll(".tube"));
    if (!tubes.length) return;

    if (typeof Matter === 'undefined') return;

    const Engine = Matter.Engine, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite, Events = Matter.Events;

    tubes.forEach((tube) => {
        if (tubeEngines.has(tube)) {
            const old = tubeEngines.get(tube);
            Runner.stop(old.runner);
            Engine.clear(old.engine);
            tubeEngines.delete(tube);
        }

        const totalPoints = parseInt(tube.dataset.points || "0", 10);
        const newPoints = parseInt(tube.dataset.delta || "0", 10);

        if (totalPoints <= 0) {
            const layer = tube.querySelector(".diamond-layer");
            if (layer) layer.innerHTML = "";
            return;
        }

        const layer = tube.querySelector(".diamond-layer");
        if (!layer) return;
        layer.innerHTML = "";

        const width = layer.clientWidth;
        const height = layer.clientHeight;
        if (!width || !height) return;

        const engine = Engine.create();
        const world = engine.world;
        const runner = Runner.create();

        const wallOpts = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts);
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 4, wallOpts);
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 4, wallOpts);

        Composite.add(world, [ground, leftWall, rightWall]);

        const step = 100;
        const totalCount = Math.ceil(totalPoints / step);
        const newCount = (newPoints > 0) ? Math.ceil(newPoints / step) : 0;
        const oldCount = Math.max(0, totalCount - newCount);
        const diamondSize = 24;

        for (let i = 0; i < totalCount; i++) {
            const isNew = i >= oldCount;
            const div = document.createElement("div");
            div.className = "diamond";
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            div.appendChild(sparkle);
            layer.appendChild(div);

            let x, y;
            if (isNew) {
                x = Math.random() * (width - 40) + 20;
                y = - ((i - oldCount) * 60) - 50;
            } else {
                x = Math.random() * (width - 40) + 20;
                const groundLevel = height - 20;
                y = groundLevel - (Math.random() * (height * 0.7)) - 20;
            }

            const body = Bodies.rectangle(x, y, diamondSize, diamondSize, {
                restitution: 0.1,
                friction: 0.2,
                angle: Math.random() * Math.PI,
                plugin: { domElement: div }
            });
            Composite.add(world, body);
        }

        Events.on(engine, 'afterUpdate', () => {
            const bodies = Composite.allBodies(world);
            bodies.forEach(body => {
                if (body.plugin && body.plugin.domElement) {
                    const dom = body.plugin.domElement;
                    const x = body.position.x - (diamondSize / 2);
                    const y = body.position.y - (diamondSize / 2);
                    const angle = body.angle;
                    dom.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
                    dom.style.opacity = 1;
                }
            });
        });

        Runner.run(runner, engine);
        tubeEngines.set(tube, { runner, engine });
    });
};

window.triggerExplosion = () => {
    const board = document.getElementById("jeopardy-board");
    if (!board) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const flash = document.createElement("div");
    flash.style.position = "absolute";
    flash.style.inset = "0";
    flash.style.backgroundColor = "white";
    flash.style.zIndex = "2147483646";
    flash.style.opacity = "0.8";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.5s ease-out";
    board.appendChild(flash);

    requestAnimationFrame(() => {
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 500);
    });

    const text = document.createElement("div");
    text.className = "expelliarmus-text";
    text.textContent = "Expelliarmus!";
    board.appendChild(text);
    setTimeout(() => text.remove(), 2500);

    const particleCount = 150;
    const colors = ["#ff0000", "#ffaa00", "#ffffff", "#880000"];

    for (let i = 0; i < particleCount; i++) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("click-sparkle");
        const size = 6 + Math.random() * 8;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.position = "absolute";
        sparkle.style.zIndex = "2147483647";
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        const angle = Math.random() * 2 * Math.PI;
        const velocity = 200 + Math.random() * 600;
        const tx = Math.cos(angle) * velocity + "px";
        const ty = Math.sin(angle) * velocity + "px";
        sparkle.style.setProperty("--tx", tx);
        sparkle.style.setProperty("--ty", ty);
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 15px ${sparkle.style.backgroundColor}`;
        sparkle.style.animationDuration = (0.8 + Math.random() * 0.7) + "s";
        board.appendChild(sparkle);
        setTimeout(() => { sparkle.remove(); }, 1500);
    }
};

document.addEventListener("mousedown", (e) => {
    const board = document.getElementById("jeopardy-board");
    if (!board) return;
    const particleCount = 8;
    const colors = ["#ffffff", "#f6e39a", "#a3d8f4", "#e1bee7"];
    for (let i = 0; i < particleCount; i++) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("click-sparkle");
        sparkle.style.position = "absolute";
        sparkle.style.zIndex = "2147483647";
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        const angle = Math.random() * 2 * Math.PI;
        const dist = 10 + Math.random() * 25;
        const tx = Math.cos(angle) * dist + "px";
        const ty = Math.sin(angle) * dist + "px";
        sparkle.style.setProperty("--tx", tx);
        sparkle.style.setProperty("--ty", ty);
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 6px ${sparkle.style.backgroundColor}`;
        board.appendChild(sparkle);
        setTimeout(() => { sparkle.remove(); }, 500);
    }
});

/* ==========================================================================
   AUDIO PULSE EFFECT (Visualizer)
   ========================================================================== */
function setupAudioPulse(audioElementId) {
    const audioEl = document.getElementById(audioElementId);
    if (!audioEl) return;

    // 1. Initialize AudioContext
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume context if suspended (needed for some browsers after interaction)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // 2. Setup Analyser
    if (!analyser) {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Low detail is fine for simple pulsing
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    // 3. Connect Source (Only once per element)
    if (!audioEl._isConnected) {
        const source = audioContext.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioContext.destination); // Connect to speakers
        audioEl._isConnected = true;
    }

    // 4. Start Animation Loop
    if (pulseLoopId) cancelAnimationFrame(pulseLoopId); // Stop any old loop

    const pulse = () => {
        // If image is not there or audio paused, stop loop
        const img = document.querySelector('.dumbledore-solo');
        if (!img || audioEl.paused) {
            if (img) img.style.transform = 'scale(1)'; // Reset
            return;
        }

        requestAnimationFrame(pulse);

        // Get Audio Data
        analyser.getByteFrequencyData(dataArray);

        // Calculate Average Volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // Map Volume to Scale (1.0 to 1.15)
        // Adjust "255" and "0.15" to change sensitivity
        const scale = 1 + (average / 255) * 0.15;

        img.style.transform = `scale(${scale})`;
    };

    pulse();
}

/* ==========================================================================
   SPELL RECOGNITION (Conversation)
   ========================================================================== */
window.initSpeechRecognition = (dotNetHelper) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition is not supported.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'da-DK';
    recognition.continuous = true;
    recognition.interimResults = false;

    let stopListening = false;

    recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                .trim();

            console.log("Heard:", transcript);

            if (transcript.includes("dumbledore") &&
                (transcript.includes("fortæl om reglerne") ||
                    transcript.includes("fortælle om reglerne") ||
                    transcript.includes("fortæller om reglerne") ||
                    transcript.includes("fortæller reglerne"))) {

                console.log("Triggering Rules.");
                stopListening = true;
                recognition.stop();

                dotNetHelper.invokeMethodAsync('TriggerDumbledoreEvent');
            }

            else if (transcript.includes("tak dumbledore") || transcript.includes("mange tak dumbledore")) {
                console.log("Thanks triggered.");

                // A. Switch UI
                dotNetHelper.invokeMethodAsync('TriggerThanksEvent');

                // B. Play Audio & Start Pulse
                const thanksAudio = document.getElementById("thanksAudio");
                if (thanksAudio) {
                    thanksAudio.currentTime = 0;

                    // Setup the Pulse Effect BEFORE playing
                    setupAudioPulse("thanksAudio");

                    thanksAudio.play().then(() => {
                        thanksAudio.onended = () => {
                            console.log("Thanks finished.");
                            dotNetHelper.invokeMethodAsync('TriggerCloseRules');
                        };
                    }).catch(e => console.log("Thanks audio failed", e));
                }
            }
        }
    };

    recognition.onend = () => {
        if (!stopListening) {
            try { recognition.start(); } catch (e) { }
        }
    };

    const rulesAudio = document.getElementById("rulesAudio");
    if (rulesAudio) {
        rulesAudio.onended = () => {
            console.log("Rules finished. Restarting listener...");
            stopListening = false;
            try { recognition.start(); } catch (e) { }
        };
    }

    try {
        recognition.start();
        console.log("Listening for spells...");
    } catch (e) {
        console.error("Error starting speech:", e);
    }
};

window.playRulesAudio = () => {
    const audio = document.getElementById("rulesAudio");
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
};

/* ---------------------------------------------------- */
/* WINNER CONFETTI                                      */
/* ---------------------------------------------------- */
window.triggerWinnerConfetti = () => {
    const board = document.getElementById("jeopardy-board");
    if (!board) return;

    const colors = ["#f6e39a", "#d4af37", "#ffffff", "#ff0000", "#00ff00", "#0000ff"];

    // Create 300 confetti particles
    for (let i = 0; i < 300; i++) {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.zIndex = "5000";
        confetti.style.width = Math.random() * 10 + 5 + "px";
        confetti.style.height = Math.random() * 5 + 5 + "px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random starting position (top of screen)
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-10vh";

        // Random animation properties
        const duration = Math.random() * 3 + 2 + "s";
        const delay = Math.random() * 2 + "s";

        confetti.style.animation = `confetti-fall ${duration} linear ${delay} forwards`;

        // Random rotation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        board.appendChild(confetti);

        // Cleanup
        setTimeout(() => confetti.remove(), 6000);
    }
};

// Add styles dynamically for confetti fall
const style = document.createElement('style');
style.innerHTML = `
@keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(style);