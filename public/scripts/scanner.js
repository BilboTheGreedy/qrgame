/**
 * QR Scanner Functionality
 * 
 * Handles all aspects of QR code scanning and camera interaction
 */

// Enhanced camera support check
function checkCameraSupport() {
    return new Promise((resolve, reject) => {
        // Check for modern browser support of mediaDevices
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
            reject(new Error('Camera access is not supported on this device.'));
            return;
        }
    
        // Check for secure context (HTTPS or localhost)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            reject(new Error('Camera access requires a secure context (HTTPS).'));
            return;
        }
    
        // Check if Html5Qrcode is available
        if (typeof Html5Qrcode === 'undefined') {
            reject(new Error('QR Scanner library not loaded.'));
            return;
        }
    
        // Attempt to get camera constraints
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(() => resolve(true))
            .catch(err => {
                console.error('Camera access error:', err);
                reject(new Error('Could not access camera. Please check permissions.'));
            });
    });
}

// Initialize and start the QR scanner
function startScanner() {
    // Clear any existing error messages
    const cameraStatus = document.getElementById('camera-status');
    const scannerError = document.getElementById('scanner-error');
    if (cameraStatus) cameraStatus.textContent = "Starting camera...";
    if (scannerError) scannerError.style.display = "none";
  
    // Perform comprehensive camera support check
    checkCameraSupport()
        .then(() => initializeScanner())
        .catch(error => {
            console.error('Camera initialization failed:', error);
            
            // Update UI with error
            if (cameraStatus) cameraStatus.textContent = "Camera access failed.";
            if (scannerError) {
                scannerError.style.display = "block";
                scannerError.innerHTML = `
                    <strong>Camera Error:</strong> ${error.message}<br>
                    Possible solutions:
                    <ul>
                        <li>Ensure you're on HTTPS or localhost</li>
                        <li>Check camera permissions</li>
                        <li>Use a modern browser</li>
                        <li>Restart the application</li>
                    </ul>
                `;
            }
        });
}

// Initialize scanner with configuration
function initializeScanner() {
    // Ensure we don't have an existing scanner
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
    }

    // Recreate the Html5Qrcode instance
    html5QrCode = new Html5Qrcode("reader", { 
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] 
    });

    const qrCodeSuccessCallback = (decodedText) => {
        html5QrCode.stop().then(() => {
            console.log("Scanner stopped after successful scan");
            processQrCode(decodedText);
        }).catch(err => {
            console.error("Error stopping scanner after scan:", err);
        });
    };

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    const cameraStatus = document.getElementById('camera-status');
    const scannerError = document.getElementById('scanner-error');

    // Timeout to handle cases where camera doesn't start
    const startTimeout = setTimeout(() => {
        if (!html5QrCode.isScanning) {
            if (cameraStatus) cameraStatus.textContent = "Camera start timeout. Check permissions.";
            if (scannerError) {
                scannerError.style.display = "block";
                scannerError.innerHTML = `
                    <strong>Timeout Error:</strong> Could not start camera.<br>
                    Possible issues:
                    <ul>
                        <li>Camera in use by another app</li>
                        <li>Browser camera access blocked</li>
                        <li>Hardware or driver problems</li>
                    </ul>
                `;
            }
        }
    }, 10000);  // 10-second timeout

    // Start the scanner
    html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
            clearTimeout(startTimeout);
            console.error("QR scan error:", errorMessage);
        }
    ).then(() => {
        clearTimeout(startTimeout);
        if (cameraStatus) cameraStatus.textContent = "Camera active! Point at a QR code.";
        console.log("Camera started successfully");
    }).catch((err) => {
        clearTimeout(startTimeout);
        console.error("Error starting scanner:", err);
        if (scannerError) {
            scannerError.style.display = "block";
            scannerError.innerHTML = `
                <strong>Camera Start Error:</strong> ${err}<br>
                Possible solutions:
                <ul>
                    <li>Check camera permissions</li>
                    <li>Ensure secure context</li>
                    <li>Restart browser</li>
                </ul>
            `;
        }
        if (cameraStatus) cameraStatus.textContent = "Camera not available.";
    });
}

// Process a scanned QR code
function processQrCode(qrValue) {
    console.log("QR Code scanned:", qrValue);
    if (window.qrCodes[qrValue]) {
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

// Show manual entry dialog
function showManualEntry() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const title = document.createElement('h3');
    title.className = 'modal-title';
    title.textContent = 'Enter QR Code Manually';
    
    const description = document.createElement('p');
    description.textContent = 'If camera scanning isn\'t working, enter the QR code value manually:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'modal-input';
    input.placeholder = 'Enter QR Code (e.g., QR_CODE_1)';
    
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit';
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        startScanner();
    });
    
    submitBtn.addEventListener('click', () => {
        const qrValue = input.value.trim();
        if (qrValue) {
            document.body.removeChild(modal);
            processQrCode(qrValue);
        } else {
            alert('Please enter a valid QR code.');
        }
    });
    
    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(input);
    modalContent.appendChild(actions);
    
    modal.appendChild(modalContent);
    
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
            console.error("Error stopping scanner:", err);
        });
    }
    
    document.body.appendChild(modal);
    setTimeout(() => {
        input.focus();
    }, 100);
}