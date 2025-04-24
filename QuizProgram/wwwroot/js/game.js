let comboSoundPlayed = false;

window.playComboSound = () => {
    if (comboSoundPlayed) {
        return;
    }

    const audio = new Audio('/audio/HarryCombo.mp3');
    audio.play();
    comboSoundPlayed = true;
};

let canRecord = false;
let recorder = null;
let audioChunks = [];
let isInitialized = false;
let mediaStream = null;

function SetupAudio(toggle) {
    if (!isInitialized) {
        isInitialized = true;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                console.log("Stream OK!");
                SetupStream(stream);
                ToggleMic(toggle);
            })
            .catch(err => console.error(err));
    } else {
        ToggleMic(toggle);
    }
}

window.SetupAudio = SetupAudio;

function SetupStream(stream) {
    mediaStream = stream;

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => {
        audioChunks.push(e.data);
    }

    recorder.onstop = e => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        audioChunks = [];
    }

    canRecord = true;
}

function ToggleMic(start) {
    if (!canRecord) {
        return;
    }

    if (start) {
        if (recorder.state === "inactive") {
            audioChunks = []; // nulstiller
            recorder.start();
            console.log("start");
        }
    } else {
        if (recorder.state === "recording") {
            recorder.stop();
            StopMicrophone();
            console.log("slut");
        }
    }
}

window.ToggleMic = ToggleMic;

function StopMicrophone() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
        canRecord = false;
        recorder = null;
        isInitialized = false;
    }
}
