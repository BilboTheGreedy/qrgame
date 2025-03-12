/**
 * Local fallback for the HTML5-QRCode library
 * This is a simplified version focused on basic QR code scanning
 * Place this file at: public/scripts/local-qrcode-lib.js
 */

// Define the main HTML5QrCode class
class Html5Qrcode {
    constructor(elementId, config) {
        this.elementId = elementId;
        this.config = config || {};
        this.isScanning = false;
        
        // Find the element
        this.element = document.getElementById(elementId);
        if (!this.element) {
            throw `Element with id=${elementId} not found`;
        }
        
        console.log(`Simple HTML5QrCode initialized with element ID: ${elementId}`);
    }
    
    // Method to start scanning
    start(cameraIdOrConfig, configuration, qrCodeSuccessCallback, qrCodeErrorCallback) {
        return new Promise((resolve, reject) => {
            if (this.isScanning) {
                reject("Already scanning");
                return;
            }
            
            this.isScanning = true;
            
            // Create camera element
            this.videoElement = document.createElement('video');
            this.videoElement.style.width = '100%';
            this.videoElement.style.height = '100%';
            this.element.innerHTML = '';
            this.element.appendChild(this.videoElement);
            
            // Add a message that this is a simplified version
            const messageDiv = document.createElement('div');
            messageDiv.style.position = 'absolute';
            messageDiv.style.bottom = '10px';
            messageDiv.style.left = '0';
            messageDiv.style.right = '0';
            messageDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
            messageDiv.style.color = 'white';
            messageDiv.style.padding = '10px';
            messageDiv.style.textAlign = 'center';
            messageDiv.textContent = 'Using fallback QR scanner. Please install the app if needed.';
            this.element.appendChild(messageDiv);
            
            // Get camera access
            const constraints = { 
                video: { facingMode: "environment" } 
            };
            
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    this.videoElement.srcObject = stream;
                    this.stream = stream;
                    this.videoElement.play();
                    
                    resolve();
                    
                    // Simulate finding a QR code for testing purposes
                    this.simulateButton = document.createElement('button');
                    this.simulateButton.textContent = 'Simulate QR Code (For Testing)';
                    this.simulateButton.style.position = 'absolute';
                    this.simulateButton.style.bottom = '50px';
                    this.simulateButton.style.left = '50%';
                    this.simulateButton.style.transform = 'translateX(-50%)';
                    this.simulateButton.style.padding = '10px 15px';
                    this.simulateButton.style.backgroundColor = '#2196F3';
                    this.simulateButton.style.color = 'white';
                    this.simulateButton.style.border = 'none';
                    this.simulateButton.style.borderRadius = '5px';
                    this.simulateButton.style.zIndex = '999';
                    
                    this.simulateButton.addEventListener('click', () => {
                        qrCodeSuccessCallback('QR_CODE_1');
                    });
                    
                    this.element.appendChild(this.simulateButton);
                })
                .catch((error) => {
                    this.isScanning = false;
                    reject(error);
                });
        });
    }
    
    // Method to stop scanning
    stop() {
        return new Promise((resolve, reject) => {
            if (!this.isScanning) {
                resolve();
                return;
            }
            
            if (this.stream) {
                const tracks = this.stream.getTracks();
                tracks.forEach(track => track.stop());
                this.stream = null;
            }
            
            if (this.videoElement) {
                this.videoElement.srcObject = null;
                this.videoElement.pause();
            }
            
            if (this.simulateButton) {
                this.simulateButton.remove();
            }
            
            this.isScanning = false;
            this.element.innerHTML = '';
            resolve();
        });
    }
}

// Add supported formats
const Html5QrcodeSupportedFormats = {
    QR_CODE: 0
};

// Log that the fallback library is loaded
console.log("Local fallback HTML5-QRCode library loaded");

// Export to global scope
window.Html5Qrcode = Html5Qrcode;
window.Html5QrcodeSupportedFormats = Html5QrcodeSupportedFormats;