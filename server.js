// server.js - Backend for QR Code Treasure Hunt
const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes to help with camera access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'public')));

// QR Code configuration - customize these clues and hints for your girlfriend
const qrCodesConfig = {
    "QR_CODE_1": {
        id: 1,
        clue: "Our first date was so special to me. I remember how nervous I was when we met at that café. You ordered your favorite drink and we talked for hours.",
        nextHint: "For your next clue, look where we keep something sweet..."
    },
    "QR_CODE_2": {
        id: 2,
        clue: "Remember our first trip together? We took so many pictures and laughed so much. That sunset by the beach was magical.",
        nextHint: "Your next clue is hiding where we keep our favorite books..."
    },
    "QR_CODE_3": {
        id: 3,
        clue: "That time we cooked together and almost burned the kitchen! But the meal turned out perfect in the end, just like us.",
        nextHint: "Look for the next clue where music plays..."
    },
    "QR_CODE_4": {
        id: 4,
        clue: "Our song always makes me think of you. Whenever I hear it, I smile and remember all our special moments together.",
        nextHint: "For your final clue, check where I left you a note last Valentine's Day..."
    },
    "QR_CODE_5": {
        id: 5,
        clue: "You mean everything to me. Every day with you is a blessing, and I can't wait to create more memories together.",
        nextHint: "You've found all the clues! Now for your treasure..."
    }
};

// Where the treasure (gift) is hidden - customize this!
const treasureLocation = "Look inside the bottom drawer of your dresser!";

// Create QR code directory if it doesn't exist
const qrDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
}

// Generate QR codes for each clue
async function generateQRCodes() {
    try {
        for (const [key, value] of Object.entries(qrCodesConfig)) {
            const qrPath = path.join(qrDir, `${key}.png`);
            await qrcode.toFile(qrPath, key, {
                color: {
                    dark: '#ff4d8d',  // Pink color for dots
                    light: '#FFFFFF'  // White background
                },
                width: 300,
                margin: 1
            });
            console.log(`Generated QR code for ${key}`);
        }
    } catch (err) {
        console.error('Error generating QR codes:', err);
    }
}

// API endpoint to verify QR code and get clue
app.post('/api/verify-qr', (req, res) => {
    const { qrValue } = req.body;
    
    if (qrCodesConfig[qrValue]) {
        res.json({
            success: true,
            ...qrCodesConfig[qrValue]
        });
    } else {
        res.json({
            success: false,
            message: "This doesn't seem to be one of the treasure hunt QR codes."
        });
    }
});

// API endpoint to get treasure location (only after finding all QR codes)
app.post('/api/get-treasure', (req, res) => {
    const { foundCodes } = req.body;
    
    // Verify all QR codes have been found
    if (foundCodes && foundCodes.length === 5) {
        res.json({
            success: true,
            location: treasureLocation
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'You must find all QR codes first!'
        });
    }
});

// Route to download individual QR codes
app.get('/api/download-qr/:id', (req, res) => {
    const qrId = req.params.id;
    const qrPath = path.join(qrDir, `QR_CODE_${qrId}.png`);
    
    if (fs.existsSync(qrPath)) {
        res.download(qrPath);
    } else {
        res.status(404).send('QR code not found');
    }
});

// The main route returns the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and generate QR codes
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    
    // Generate QR codes on server start
    await generateQRCodes();
    console.log('QR codes generated successfully!');
    console.log(`Access them at http://localhost:${PORT}/qrcodes/ or print them from the admin page`);
});

/*
Setup Instructions:

1. Create a new directory for your project
2. Save this file as 'server.js' in that directory
3. Create a 'public' subdirectory for your frontend files
4. Save the HTML file from the frontend artifact into 'public/index.html'
5. Initialize npm and install required packages:
   
   npm init -y
   npm install express qrcode
   
6. Start the server:
   
   node server.js
   
7. The server will generate 5 QR codes in the public/qrcodes directory
8. Print these QR codes and hide them according to the hints
9. Access the game at http://localhost:3000

Customization:
- Update the qrCodesConfig object with personalized clues and hints
- Update treasureLocation with where you've hidden the gift
*/