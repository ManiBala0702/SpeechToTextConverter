const resultElement = document.getElementById("result");
let recognition;
let finalTranscript = ""; // persistent store for confirmed text

function startConverting() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    resultElement.textContent = "SpeechRecognition not supported in this browser.";
    return;
  }
  recognition = new SpeechRecognition();
  setupRecognition(recognition);
  recognition.start();
}

function setupRecognition(recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    // Build only from new results (avoid re-processing older ones)
    let interim = "";

    // Use event.resultIndex to start from the first new result
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      let transcript = res[0].transcript || "";

      // normalize whitespace and convert newlines if needed
      transcript = transcript.replace(/\n/g, "<br>").replace(/\s+/g, " ").trim();

      if (res.isFinal) {
        // append to global finalTranscript once
        finalTranscript += (finalTranscript ? " " : "") + transcript;
      } else {
        // keep the latest interim only (prevents repeated stacking)
        interim = transcript;
      }
    }

    // Display final + interim (interim wrapped for styling)
    resultElement.innerHTML =
      (finalTranscript ? finalTranscript + " " : "") +
      (interim ? '<span class="interim">' + interim + "</span>" : "");
  };

  recognition.onerror = (e) => {
    console.error("SpeechRecognition error:", e);
  };

  recognition.onend = () => {
    // optional: restart automatically for continuous listening on some mobile browsers:
    // recognition.start();
    console.log("Recognition ended");
  };
}

function stopConverting() {
  if (recognition) recognition.stop();
}
