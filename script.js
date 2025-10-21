// script.js
const resultElement = document.getElementById("result");
let recognition = null;
let finalTranscript = "";       // store confirmed text
let lastFinalIndex = 0;         // index guard so we don't re-append finals

function startConverting() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    resultElement.textContent = "SpeechRecognition not supported in this browser.";
    return;
  }

  // If you want a fresh start each time, uncomment these lines:
  // finalTranscript = "";
  // lastFinalIndex = 0;
  // resultElement.innerHTML = "";

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    let interim = "";

    // Start from the first new result (event.resultIndex)
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      let transcript = (res[0].transcript || "").trim();

      // normalize line breaks / spaces
      transcript = transcript.replace(/\n/g, "<br>").replace(/\s+/g, " ").trim();

      if (res.isFinal) {
        // Only append finals that we haven't appended before
        if (i >= lastFinalIndex) {
          // add a space if finalTranscript is not empty
          finalTranscript += (finalTranscript ? " " : "") + transcript;
          lastFinalIndex = i + 1; // set guard to next index
          console.log("Appended final:", transcript, "lastFinalIndex:", lastFinalIndex);
        } else {
          console.log("Ignored duplicate final at index", i, transcript);
        }
      } else {
        // Keep only the latest interim (prevents stacking)
        interim = transcript;
      }
    }

    // Show final + interim (interim styled differently)
    resultElement.innerHTML =
      (finalTranscript ? finalTranscript + " " : "") +
      (interim ? '<span class="interim">' + interim + "</span>" : "");
  };

  recognition.onerror = function (err) {
    console.error("Speech recognition error:", err);
  };

  recognition.onend = function () {
    console.log("Recognition ended");
    // Do not auto-restart by default — causes duplicate issues if not careful.
    // If you want continuous behavior, you can restart here BUT guard to avoid loops.
    // recognition.start();
  };

  recognition.start();
}

function stopConverting() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}
