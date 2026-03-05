/**
 * Microphone Checker - Vanilla JavaScript Extension
 * No React, no build tools - pure vanilla JS for Chrome extension
 */

// State
let audioContext = null;
let stream = null;
let analyser = null;
let gainNode = null;
let animationId = null;
let mediaRecorder = null;
let recordedChunks = [];
let devices = [];
let selectedDevice = "";
let micConnected = false;
let permissionGranted = null;
let troubleShowing = false;

// DOM Elements
const deviceSelect = document.getElementById("deviceSelect");
const startBtn = document.getElementById("startBtn");
const recordBtn = document.getElementById("recordBtn");
const stopRecordBtn = document.getElementById("stopRecordBtn");
const stopBtn = document.getElementById("stopBtn");
const statusEl = document.getElementById("status");
const soundMeterEl = document.getElementById("soundMeter");
const soundValueEl = document.getElementById("soundValue");
const noiseMeterEl = document.getElementById("noiseMeter");
const noiseValueEl = document.getElementById("noiseValue");
const noiseStatusEl = document.getElementById("noiseStatus");
const troublePanel = document.getElementById("troublePanel");
const troubleContent = document.getElementById("troubleContent");
const connectionStatusEl = document.getElementById("connectionStatus");
const permissionStatusEl = document.getElementById("permissionStatus");
const devicesStatusEl = document.getElementById("devicesStatus");
const issuesSection = document.getElementById("issuesSection");
const issuesList = document.getElementById("issuesList");
const successMsg = document.getElementById("successMsg");
const playerEl = document.getElementById("player");
const audioPlayer = document.getElementById("audioPlayer");
const downloadBtn = document.getElementById("downloadBtn");
const toggleIcon = document.getElementById("toggleIcon");

// Event Listeners
startBtn.addEventListener("click", startMicrophone);
stopBtn.addEventListener("click", stopMicrophone);
recordBtn.addEventListener("click", startRecording);
stopRecordBtn.addEventListener("click", stopRecording);
deviceSelect.addEventListener("change", (e) => {
  selectedDevice = e.target.value;
});

// Get available microphones on load
window.addEventListener("DOMContentLoaded", getDevices);

/**
 * Get available audio input devices
 */
async function getDevices() {
  try {
    const deviceList = await navigator.mediaDevices.enumerateDevices();
    devices = deviceList.filter((device) => device.kind === "audioinput");

    // Populate device selector
    deviceSelect.innerHTML = "";
    if (devices.length === 0) {
      deviceSelect.innerHTML = '<option value="">No microphones found</option>';
      return;
    }

    devices.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Microphone ${index + 1}`;
      deviceSelect.appendChild(option);
    });

    // Select primary microphone
    const primaryMic = devices.find((device) => {
      const label = device.label.toLowerCase();
      return (
        label.includes("microphone") ||
        label.includes("built-in") ||
        label.includes("internal") ||
        label.includes("default")
      );
    }) || devices[0];

    if (primaryMic) {
      selectedDevice = primaryMic.deviceId;
      deviceSelect.value = selectedDevice;
    }

    updateDevicesStatus();
  } catch (error) {
    console.error("Error getting devices:", error);
    statusEl.textContent = "Error: Could not access devices";
  }
}

/**
 * Start microphone
 */
async function startMicrophone() {
  try {
    statusEl.textContent = "Requesting microphone access...";

    const constraints = {
      audio: {
        deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    permissionGranted = true;
    micConnected = true;

    // Setup audio processing
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    source.connect(compressor);
    compressor.connect(gainNode);
    gainNode.connect(analyser);

    statusEl.textContent = "Microphone Active 🎤";
    deviceSelect.disabled = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    recordBtn.disabled = false;

    troublePanel.style.display = "block";
    updateTroubleshooting();

    // Start analyzing
    analyzeMicrophone();
  } catch (error) {
    console.error("Microphone error:", error);
    statusEl.textContent = "Microphone Permission Denied ❌";
    permissionGranted = false;
    micConnected = false;
    troublePanel.style.display = "block";
    updateTroubleshooting();
  }
}

/**
 * Stop microphone
 */
function stopMicrophone() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  if (audioContext) {
    audioContext.close();
  }

  micConnected = false;
  statusEl.textContent = "Microphone Stopped 🛑";
  deviceSelect.disabled = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  recordBtn.disabled = true;
  stopRecordBtn.disabled = true;

  soundMeterEl.style.width = "0%";
  soundValueEl.textContent = "0%";
  noiseMeterEl.style.width = "0%";
  noiseValueEl.textContent = "0%";

  troublePanel.style.display = "none";

  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

/**
 * Analyze microphone audio
 */
function analyzeMicrophone() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function update() {
    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    let noiseSum = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const x = dataArray[i] - 128;
      sum += x * x;
      if (i < dataArray.length * 0.1) {
        noiseSum += Math.abs(x);
      }
    }

    const volume = Math.sqrt(sum / dataArray.length);
    const volumeLevel = Math.min(100, Math.round(volume * 2));
    const noiseLevelValue = Math.min(
      100,
      Math.round((noiseSum / (dataArray.length * 0.1)) * 0.8)
    );

    // Update UI
    soundMeterEl.style.width = volumeLevel + "%";
    soundValueEl.textContent = volumeLevel + "%";

    noiseMeterEl.style.width = noiseLevelValue + "%";
    noiseValueEl.textContent = noiseLevelValue + "%";

    // Update noise status
    updateNoiseStatus(noiseLevelValue);

    // Adjust gain
    if (volumeLevel < 10) {
      gainNode.gain.value = 0.3;
    } else if (volumeLevel < 20) {
      gainNode.gain.value = 0.6;
    } else {
      gainNode.gain.value = 1;
    }

    updateTroubleshooting(volumeLevel, noiseLevelValue);

    animationId = requestAnimationFrame(update);
  }

  update();
}

/**
 * Update noise status label
 */
function updateNoiseStatus(level) {
  if (level < 15) {
    noiseStatusEl.textContent = "Very Quiet 🟢";
  } else if (level < 30) {
    noiseStatusEl.textContent = "Quiet 🟢";
  } else if (level < 50) {
    noiseStatusEl.textContent = "Moderate 🟡";
  } else if (level < 70) {
    noiseStatusEl.textContent = "Noisy 🟠";
  } else {
    noiseStatusEl.textContent = "Very Noisy 🔴";
  }
}

/**
 * Detect audio issues
 */
function detectIssues(volumeLevel, noiseLevelVal) {
  const issues = [];

  if (volumeLevel === 0) {
    issues.push("❌ No sound detected - Check microphone connection");
  }
  if (volumeLevel < 15) {
    issues.push(
      "⚠️ Low volume - Check microphone placement or increase volume"
    );
  }
  if (noiseLevelVal > 70) {
    issues.push("📢 High background noise - Find a quieter location");
  }
  if (noiseLevelVal > 50 && volumeLevel < 40) {
    issues.push("🔧 Noise exceeds voice level - Use noise filter or move mic");
  }

  return issues;
}

/**
 * Update troubleshooting panel
 */
function updateTroubleshooting(volumeLevel = 0, noiseLevelVal = 0) {
  // Connection Status
  connectionStatusEl.className = micConnected
    ? "diagnostic-value success"
    : "diagnostic-value warning";
  connectionStatusEl.textContent = micConnected
    ? "✅ Connected"
    : "⚠️ Not Connected";

  // Permissions
  const permClass =
    permissionGranted === true
      ? "success"
      : permissionGranted === false
      ? "error"
      : "neutral";
  const permText =
    permissionGranted === true
      ? "✅ Granted"
      : permissionGranted === false
      ? "❌ Denied"
      : "⚪ Not Requested";
  permissionStatusEl.className = `diagnostic-value ${permClass}`;
  permissionStatusEl.textContent = permText;

  // Devices
  updateDevicesStatus();

  // Issues
  const issues = detectIssues(volumeLevel, noiseLevelVal);
  if (issues.length > 0) {
    issuesSection.style.display = "block";
    issuesList.innerHTML = issues.map((issue) => `<li>${issue}</li>`).join("");
    successMsg.style.display = "none";
  } else if (micConnected) {
    issuesSection.style.display = "none";
    successMsg.style.display = "block";
  } else {
    issuesSection.style.display = "none";
    successMsg.style.display = "none";
  }
}

/**
 * Update devices status
 */
function updateDevicesStatus() {
  devicesStatusEl.className = devices.length > 0 ? "diagnostic-value success" : "diagnostic-value error";
  devicesStatusEl.textContent =
    devices.length > 0 ? `✅ ${devices.length}` : "❌ None";
}

/**
 * Toggle troubleshooting panel
 */
function toggleTroubleshooting() {
  troubleShowing = !troubleShowing;
  troubleContent.style.display = troubleShowing ? "block" : "none";
  toggleIcon.textContent = troubleShowing ? "▼" : "▶";
}

/**
 * Start recording
 */
function startRecording() {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    downloadBtn.href = url;
    playerEl.style.display = "block";
  };

  mediaRecorder.start();
  statusEl.textContent = "Recording... 🔴";
  recordBtn.disabled = true;
  stopRecordBtn.disabled = false;
}

/**
 * Stop recording
 */
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  statusEl.textContent = "Recording Stopped ✅";
  recordBtn.disabled = false;
  stopRecordBtn.disabled = true;
}
