// Global map to store physics engines so we can stop them later
const tubeEngines = new Map();

function playVideo() {
    console.log("video called");
    var video = document.getElementById("bookVideo");
    if (video) video.play();
}

function fadeInText() {
    var text = document.getElementById("overlay-text");
    if (text) text.classList.add("fade-in-text");
}

window.houseCupAnimate = () => {
    const el = document.querySelector(".housecup-overlay");
    if (!el) return;
    el.classList.remove("animate");
    void el.offsetWidth; // trigger reflow
    el.classList.add("animate");
};

window.houseCupDiamonds = () => {
    console.log("houseCupDiamonds (Physics) called");

    const overlay = document.querySelector(".housecup-overlay");
    if (!overlay) return;

    const tubes = Array.from(overlay.querySelectorAll(".tube"));
    if (!tubes.length) return;

    // Ensure Matter.js is loaded
    if (typeof Matter === 'undefined') {
        console.error("Matter.js is not loaded.");
        return;
    }

    const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Events = Matter.Events;

    tubes.forEach((tube) => {
        // 1. Cleanup previous simulation
        if (tubeEngines.has(tube)) {
            const old = tubeEngines.get(tube);
            Runner.stop(old.runner);
            Engine.clear(old.engine);
            tubeEngines.delete(tube);
        }

        // 2. Read Data
        const totalPoints = parseInt(tube.dataset.points || "0", 10);
        const newPoints = parseInt(tube.dataset.delta || "0", 10);

        if (totalPoints <= 0) {
            const layer = tube.querySelector(".diamond-layer");
            if (layer) layer.innerHTML = "";
            return;
        }

        const layer = tube.querySelector(".diamond-layer");
        if (!layer) return;

        layer.innerHTML = ""; // Clear visuals

        const width = layer.clientWidth;
        const height = layer.clientHeight;
        if (!width || !height) return;

        // 3. Setup Physics World
        const engine = Engine.create();
        const world = engine.world;
        const runner = Runner.create();

        // 4. Create Walls (invisible)
        const wallOpts = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts);
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 4, wallOpts);
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 4, wallOpts);

        Composite.add(world, [ground, leftWall, rightWall]);

        // 5. Calculate Diamonds
        // REVERTED: Step is back to 100
        const step = 100;
        const totalCount = Math.ceil(totalPoints / step);
        const newCount = (newPoints > 0) ? Math.ceil(newPoints / step) : 0;
        const oldCount = Math.max(0, totalCount - newCount);

        const diamondSize = 24; // Slightly bigger for the new shape

        for (let i = 0; i < totalCount; i++) {
            const isNew = i >= oldCount;

            // A. Create DOM Element
            const div = document.createElement("div");
            div.className = "diamond";

            // Add Sparkle Element (Visual only)
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            div.appendChild(sparkle);

            // REMOVED: No text inside the diamond
            layer.appendChild(div);

            // B. Determine Start Position
            let x, y;

            if (isNew) {
                // FALLING IN
                x = Math.random() * (width - 40) + 20;
                y = - ((i - oldCount) * 60) - 50;
            } else {
                // ALREADY THERE
                x = Math.random() * (width - 40) + 20;
                const groundLevel = height - 20;
                y = groundLevel - (Math.random() * (height * 0.7)) - 20;
            }

            // C. Create Physics Body
            // We use a rectangle approximation for the physics to keep it stable,
            // even though the visual is a gem shape.
            const body = Bodies.rectangle(x, y, diamondSize, diamondSize, {
                restitution: 0.1, // Low bounce for heavy gems
                friction: 0.2,    // Glass friction
                angle: Math.random() * Math.PI,
                plugin: { domElement: div }
            });

            Composite.add(world, body);
        }

        // 6. Update Loop
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