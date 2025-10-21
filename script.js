const resultElement = document.getElementById("result");
let recognition;

function startConverting() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    setupRecognition(recognition);
    recognition.start();
  } else {
    resultElement.textContent = "SpeechRecognition not supported in this browser.";
  }
}

function setupRecognition(recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    // process the event.results and get final + interim transcripts
    const { finalTranscript, interTranscript } = processResult(event.results);
    // show final + interim (you can style or wrap interim differently if wanted)
    resultElement.innerHTML = finalTranscript + interTranscript;
  };

  recognition.onerror = function (err) {
    console.error("Speech recognition error:", err);
  };

  recognition.onend = function () {
    // optional: restart or update UI when recognition ends
    console.log("Recognition ended");
  };
}

function processResult(results) {
  let finalTranscript = "";
  let interTranscript = "";

  for (let i = 0; i < results.length; i++) {
    let transcript = results[i][0].transcript;
    // remember to assign the replaced value back
    transcript = transcript.replace(/\n/g, "<br>");

    if (results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interTranscript += transcript;
    }
  }

  return { finalTranscript, interTranscript };
}

function stopConverting() {
  if (recognition) {
    recognition.stop();
  }
}
