import React, { useEffect, useRef, useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [noiseCancel, setNoiseCancel] = useState(false);
  const [user, setUser] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPiece + " ";
        } else {
          interim += transcriptPiece;
        }
      }

      setTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [language, listening]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const startListening = () => {
    setListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop();
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
  };

  const toggleNoiseCancel = () => {
    setNoiseCancel((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>Talkie Now</h1>

      {!user ? (
        <button className="auth-btn" onClick={handleLogin}>
          Login with Google
        </button>
      ) : (
        <div className="user-section">
          <span>Welcome, {user.displayName}</span>
          <button className="auth-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="controls">
        <button onClick={listening ? stopListening : startListening}>
          {listening ? "Stop Listening" : "Start Listening"}
        </button>
        <button onClick={clearTranscript}>Clear</button>
        <button onClick={downloadTranscript}>Download</button>

        <label className="toggle">
          <input
            type="checkbox"
            checked={noiseCancel}
            onChange={toggleNoiseCancel}
          />
          <span>Noise Cancellation</span>
        </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="es-ES">Spanish</option>
          <option value="yo-NG">Yoruba (NG)</option>
          <option value="ig-NG">Igbo (NG)</option>
          <option value="ha-NG">Hausa (NG)</option>
        </select>
      </div>

      <div className="transcript-box">
        <p>
          {transcript}
          <span className="interim">{interimTranscript}</span>
        </p>
      </div>
    </div>
  );
};

export default App;
