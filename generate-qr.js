/**
 * QR Code Generator Script
 * 
 * This script generates QR codes for the treasure hunt game.
 * It can be run independently with: npm run generate-qr
 */

const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

// Ensure the qrcodes directory exists
const qrcodesDir = path.join(__dirname, '..', 'public', 'qrcodes');
if (!fs.existsSync(qrcodesDir)) {
  fs.mkdirSync(qrcodesDir, { recursive: true });
  console.log(`Created directory: ${qrcodesDir}`);
}

// QR code values to generate
const qrValues = [
  'QR_CODE_1',
  'QR_CODE_2',
  'QR_CODE_3',
  'QR_CODE_4',
  'QR_CODE_5'
];

// Options for the QR code generation
const options = {
  errorCorrectionLevel: 'H', // Higher error correction for better scanning
  margin: 2,
  width: 300,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
};

// Generate each QR code
async function generateQRCodes() {
  console.log('Starting QR code generation...');
  
  for (const value of qrValues) {
    try {
      const qrPath = path.join(qrcodesDir, `${value}.png`);
      await qrcode.toFile(qrPath, value, options);
      console.log(`✓ Generated QR code for ${value}`);
    } catch (err) {
      console.error(`✗ Error generating QR code for ${value}:`, err);
    }
  }
  
  console.log('QR code generation complete!');
}

// Run the generator
generateQRCodes().catch(err => {
  console.error('Failed to generate QR codes:', err);
  process.exit(1);
});