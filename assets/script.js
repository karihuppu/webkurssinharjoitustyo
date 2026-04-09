document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('sonderAudio');
    const button = document.getElementById('chillbutton');
    const volumeSlider = document.getElementById('volume');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    const gainNode = audioContext.createGain();

    audioSource.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;

    button.addEventListener('click', async () => {
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    if (audio.paused) {
        try {
            await audio.play();
            button.textContent = "Pause Song";
        } catch (err) {
            console.error("Play failed:", err);
            alert("Could not play audio. Check console (F12) for details.");
        }
    } else {
        audio.pause();
        button.textContent = "Play Song";
    }
});

    volumeSlider.addEventListener('input', () => {
        gainNode.gain.value = volumeSlider.value;
    });

    // Canvas setup
    const canvas = document.getElementById('equalizer');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let barHeights = new Array(bufferLength).fill(0);

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeights[i] += (dataArray[i] - barHeights[i]) * 0.3;
            const barHeight = barHeights[i];

            const ratio = barHeight / 255;
            const r = 150 + ratio * 105;
            const g = 150 + ratio * 105;
            const b = 255;

            ctx.fillStyle = `rgb(${Math.min(r,255)}, ${Math.min(g,255)}, ${b})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

            x += barWidth;
        }
    }

    draw();

    
});
function myFunction() {
  var txt;
  if (confirm("Are you chill?")) {
    txt = "You are chill!";
  } else {
    txt = "You are not chill!";
  }
  document.getElementById("chilltest").innerHTML = txt;
}

function displayDate() {
  document.getElementById("demo").innerHTML = Date();
}

function chillFunction() {
            alert('You are chilling!');
        }
