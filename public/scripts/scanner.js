/**
 * QR Scanner Functionality
 * 
 * Handles all aspects of QR code scanning and camera interaction
 * Enhanced for mobile devices
 */

// Enhanced camera support check with device-specific handling
function checkCameraSupport() {
    return new Promise((resolve, reject) => {
        // Check for modern browser support of mediaDevices
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
            reject(new Error('Camera access is not supported on this device.'));
            return;
        }
    
        // Check for secure context (HTTPS or localhost)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            reject(new Error('Camera access requires a secure context (HTTPS).'));
            return;
        }
    
        // Check if Html5Qrcode is available
        if (typeof Html5Qrcode === 'undefined') {
            reject(new Error('QR Scanner library not loaded.'));
            return;
        }

        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Set appropriate camera constraints
        const constraints = {
            video: { 
                facingMode: "environment",
                // Better handling for iOS devices
                width: { ideal: isIOS ? window.innerWidth : 1280 },
                height: { ideal: isIOS ? window.innerHeight : 720 }
            }
        };
    
        // Attempt to get camera constraints
        navigator.mediaDevices.getUserMedia(constraints)
            .then(() => resolve(true))
            .catch(err => {
                console.error('Camera access error:', err);
                // Handle iOS errors specifically
                if (isIOS && err.name === 'NotAllowedError') {
                    reject(new Error('Camera permission denied. On iOS, you might need to enable camera access in Settings > Safari > Camera.'));
                } else {
                    reject(new Error('Could not access camera. Please check permissions.'));
                }
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
  
    // Check for orientation change to handle camera resizing
    const handleOrientationChange = () => {
        if (html5QrCode && html5QrCode.isScanning) {
            // Restart scanner on orientation change
            html5QrCode.stop().then(() => {
                setTimeout(initializeScanner, 500); // Small delay to let the DOM update
            }).catch(console.error);
        }
    };
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
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
                        <li>Ensure camera permissions are granted</li>
                        <li>Check if another app is using the camera</li>
                        <li>Try closing and reopening the app</li>
                        <li>Restart your device if issues persist</li>
                    </ul>
                `;
            }
        });
}

// Initialize scanner with mobile-friendly configuration
function initializeScanner() {
    // Ensure we don't have an existing scanner
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
    }

    // Get the camera container dimensions for better sizing
    const cameraContainer = document.querySelector('.camera-container');
    const containerSize = Math.min(cameraContainer.clientWidth, cameraContainer.clientHeight);
    
    // Calculate QR box size (70% of container)
    const qrboxSize = Math.floor(containerSize * 0.7);

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Recreate the Html5Qrcode instance with optimized settings
    html5QrCode = new Html5Qrcode("reader", { 
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false // Disable verbose logs for better performance on mobile
    });

    const qrCodeSuccessCallback = (decodedText) => {
        // Add vibration feedback on success (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // Play success sound (optional)
        try {
            const successSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyM2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYHg/gAAAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAxwAHZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2doaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoa2tra2tra2tra2tra2tra2tra2tra2tra2tv////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXMhTwAAAAAAAAAAAAAAAAAAAAAAP/jSMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAQAADIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjJMTExMTExMTExMTExMTExMTExMTExMTExMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjN3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3f////////////////////////////////8AAAAATGF2YzU4LjIwAAAAAAAAAAAAAAAAJALAAAAAAAAABTHzLuxPAAAAAAD/4zjEAAAAAAAAAAAASW5mbwAAAA8AAAADAAACMgAxMTExMTExMTExMTExMTExMTExMTExMTExVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7/////////////////////////////////AAAAAE1wM2FkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
            successSound.play().catch(e => console.log("Sound play error:", e));
        } catch (e) {
            console.log("Sound creation error:", e);
        }
        
        html5QrCode.stop().then(() => {
            console.log("Scanner stopped after successful scan");
            processQrCode(decodedText);
        }).catch(err => {
            console.error("Error stopping scanner after scan:", err);
        });
    };

    // Mobile-optimized configuration
    const config = { 
        fps: isMobile ? 15 : 10, // Higher FPS on mobile for better detection
        qrbox: { width: qrboxSize, height: qrboxSize },
        aspectRatio: 1.0,
        disableFlip: false,
        showTorchButtonIfSupported: true, // Show flashlight button if available
        showZoomSliderIfSupported: true, // Show zoom control if available
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

    // Start the scanner with mobile-optimized settings
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

// Show manual entry dialog with mobile-friendly enhancements
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
    input.autocomplete = 'off';  // Prevent autocomplete on mobile
    input.autocapitalize = 'none'; // Prevent auto-capitalization
    input.spellcheck = false; // Disable spellcheck
    
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.textContent = 'Submit';
    
    // Mobile-friendly touch events
    cancelBtn.addEventListener('touchstart', () => {
        cancelBtn.classList.add('active');
    });
    
    cancelBtn.addEventListener('touchend', () => {
        cancelBtn.classList.remove('active');
        document.body.removeChild(modal);
        startScanner();
    });
    
    submitBtn.addEventListener('touchstart', () => {
        submitBtn.classList.add('active');
    });
    
    submitBtn.addEventListener('touchend', () => {
        submitBtn.classList.remove('active');
        const qrValue = input.value.trim();
        if (qrValue) {
            document.body.removeChild(modal);
            processQrCode(qrValue);
        } else {
            alert('Please enter a valid QR code.');
        }
    });
    
    // Also add regular click events for non-touch devices
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        startScanner();
    });
    
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
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
    
    // Wait for animation to complete before focusing on input to prevent keyboard jumping issues
    setTimeout(() => {
        input.focus();
    }, 300);
}