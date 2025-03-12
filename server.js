const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const fs = require('fs').promises;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// QR Code configuration - customize these clues and hints for your partner
const qrCodesConfig = {
    "QR_CODE_1": {
        id: 1,
        clue: "Our first date was so special to me. I remember how nervous I was when we met? We ordered drinks and talked for hours and played games together.",
        nextHint: "For your next clue, go to work and search your office... something is a bit strange..."
    },
    "QR_CODE_2": {
        id: 2,
        clue: "Remember our first trip together? We went to a beautiful city and stayed the night. We took many pictures together!",
        nextHint: "For the next clue... look somewhere unexpected..."
    },
    "QR_CODE_3": {
        id: 3,
        clue: "And the next trip we went on was incredible! We took even more pictures together and created amazing memories.",
        nextHint: "You took me with you this morning. 'I carry everything you need for the day'"
    },
    "QR_CODE_4": {
        id: 4,
        clue: "Remember that adventurous day we went on a special journey together? I took so many pictures of you!",
        nextHint: "Check a place with a secret compartment you know..."
    },
    "QR_CODE_5": {
        id: 5,
        clue: "Then we went on an incredible journey across different places! And we took SO MANY PICTURES!",
        nextHint: "Look in a place that reminds you of our travels..."
    }
};

// Customize this with the actual location of the gift
const treasureLocation = "Look inside a special place that means something to both of us!";

// Enhanced security middleware
app.use(helmet());

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Secure headers and CORS configuration
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // More restrictive CORS
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware to parse JSON requests
app.use(express.json({ 
    limit: '10kb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf.toString());
        } catch (e) {
            res.status(400).json({ error: 'Invalid JSON' });
            throw new Error('Invalid JSON');
        }
    }
}));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'public')));

// Create QR code directory if it doesn't exist
const qrDir = path.join(__dirname, 'public', 'qrcodes');

// Generate QR codes for each clue
async function generateQRCodes() {
    try {
        await fs.mkdir(qrDir, { recursive: true });
        
        const generationPromises = Object.entries(qrCodesConfig).map(async ([key]) => {
            const qrPath = path.join(qrDir, `${key}.png`);
            
            try {
                await qrcode.toFile(qrPath, key, {
                    color: {
                        dark: '#ff4d8d',
                        light: '#FFFFFF'
                    },
                    width: 300,
                    margin: 1
                });
                console.log(`Generated QR code for ${key}`);
            } catch (qrError) {
                console.error(`Failed to generate QR code for ${key}:`, qrError);
            }
        });

        await Promise.allSettled(generationPromises);
    } catch (err) {
        console.error('Critical error generating QR codes:', err);
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

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start the server
const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    
    try {
        await generateQRCodes();
        console.log('QR codes generated successfully!');
    } catch (error) {
        console.error('Failed to generate QR codes:', error);
    }
});

module.exports = server;
