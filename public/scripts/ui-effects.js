let html5QrCode;

function startScanner() {
    const cameraStatus = document.getElementById('camera-status');
    const scannerError = document.getElementById('scanner-error');
    
    if (cameraStatus) cameraStatus.textContent = "Starting camera...";
    if (scannerError) scannerError.style.display = "none";
    
    // Log our starting point
    console.log("Starting scanner initialization");
    
    // Create a new instance
    if (html5QrCode && html5QrCode.isScanning) {
        console.log("Scanner already running, stopping it first");
        html5QrCode.stop().then(() => {
            console.log("Successfully stopped previous scan");
            initScanner();
        }).catch(err => {
            console.error("Error stopping previous scan:", err);
            initScanner();
        });
    } else {
        initScanner();
    }
}

function initScanner() {
    console.log("Creating new scanner instance");
    
    try {
        html5QrCode = new Html5Qrcode("reader");
        
        console.log("Scanner instance created, attempting to start camera");
        
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                console.log("QR code detected:", decodedText);
                html5QrCode.stop().then(() => {
                    processQrCode(decodedText);
                });
            },
            (errorMessage) => {
                // Just log scan errors, don't display
                console.log("QR scan error:", errorMessage);
            }
        ).then(() => {
            console.log("Camera started successfully");
            document.getElementById('camera-status').textContent = "Camera active! Point at a QR code.";
        }).catch(err => {
            console.error("Camera start error:", err);
            document.getElementById('camera-status').textContent = "Camera failed to start.";
            document.getElementById('scanner-error').style.display = "block";
            document.getElementById('scanner-error').innerHTML = `
                <strong>Camera Error:</strong> ${err}<br>
                Check your camera permissions and make sure no other app is using the camera.
            `;
        });
    } catch (err) {
        console.error("Error creating scanner instance:", err);
        document.getElementById('camera-status').textContent = "Failed to initialize scanner.";
        document.getElementById('scanner-error').style.display = "block";
        document.getElementById('scanner-error').innerHTML = `
            <strong>Scanner Error:</strong> ${err}<br>
            There was a problem initializing the QR scanner.
        `;
    }
}

// Add the missing processQrCode function
function processQrCode(qrValue) {
    console.log("QR Code scanned:", qrValue);
    if (window.qrCodes && window.qrCodes[qrValue]) {
        const qrCode = window.qrCodes[qrValue];

        if (qrCode.found) {
            alert("You've already found this QR code!");
            startScanner();
            return;
        }

        qrCode.found = true;
        foundCodes++;

        saveProgress();
        const pointElem = document.getElementById(`point-${qrCode.id}`);
        if (pointElem) {
            pointElem.classList.add('active');
        }
        updateProgressBar();

        document.getElementById('found-which-qr').textContent = `You found QR Code #${qrCode.id}!`;
        document.getElementById('clue-content').textContent = qrCode.clue;
        document.getElementById('next-hint').textContent = qrCode.nextHint;

        showScreen('clue-screen');

        if (foundCodes === 5) {
            setTimeout(() => {
                document.getElementById('treasure-location').textContent = window.treasureLocation;
                showScreen('treasure-screen');
                createConfetti();
            }, 5000);
        }
    } else {
        alert("This doesn't seem to be one of the treasure hunt QR codes. Keep looking!");
        startScanner();
    }
}