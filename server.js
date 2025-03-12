const http = require('http');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Ensure the qrcodes directory exists
const qrcodesDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrcodesDir)) {
  fs.mkdirSync(qrcodesDir, { recursive: true });
}

// Generate QR Codes for the treasure hunt
async function generateQRCodes() {
  console.log('Generating QR codes...');
  
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
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  };
  
  // Generate each QR code
  for (const value of qrValues) {
    try {
      const qrPath = path.join(qrcodesDir, `${value}.png`);
      await qrcode.toFile(qrPath, value, options);
      console.log(`Generated QR code for ${value}`);
    } catch (err) {
      console.error(`Error generating QR code for ${value}:`, err);
    }
  }
  
  console.log('QR code generation complete');
  return qrValues.length;
}

const server = http.createServer(async (req, res) => {
  // Handle API requests
  if (req.url === '/api/generate-qrcodes' && req.method === 'POST') {
    try {
      const count = await generateQRCodes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }
  
  // Handle download requests
  if (req.url.startsWith('/api/download-qr/')) {
    const qrId = req.url.split('/').pop();
    const qrFile = path.join(qrcodesDir, `QR_CODE_${qrId}.png`);
    
    if (fs.existsSync(qrFile)) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      fs.createReadStream(qrFile).pipe(res);
    } else {
      res.writeHead(404);
      res.end('QR Code not found');
    }
    return;
  }
  
  // Normalize the URL by removing query strings, etc.
  let filePath = path.join('public', req.url === '/' ? 'index.html' : req.url);
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Page not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Generate QR codes on server start
generateQRCodes().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}).catch(err => {
  console.error('Failed to generate QR codes on startup:', err);
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/ (QR generation failed)`);
  });
});