// Treasure Hunt Configuration

class TreasureHuntConfig {
    constructor() {
        this.version = '1.1.0';
        this.qrCodes = this.loadQRCodes();
        this.treasureLocation = this.loadTreasureLocation();
    }

    // Load QR Codes with validation
    loadQRCodes() {
        const defaultConfig = {
            "QR_CODE_1": {
                id: 1,
                found: false,
                clue: "Our first date. I remember how nervous I was when we met? We ordered drinks and talked for hours... we played mario-kart (and i won)",
                nextHint: "For your next clue, go to work and search your office for a QR code... something is a bit strange..."
            },
            "QR_CODE_2": {
                id: 2,
                found: false,
                clue: "Remember our first trip together? We went to Stockholm old town and stayed the night. We took many pictures together!",
                nextHint: "For the next clue... look somewhere unexpected... (something smells fishy...)"
            },
            "QR_CODE_3": {
                id: 3,
                found: false,
                clue: "And the next trip we went on was incredible! Uppsala! We took even more pictures together and created amazing memories.",
                nextHint: "You took me with you this morning. 'I carry everything you need for the day'"
            },
            "QR_CODE_4": {
                id: 4,
                found: false,
                clue: "Remember that adventurous day we went on a special journey together? I took so many pictures of you! Europe! France! UK!!!",
                nextHint: "I require electricity.... my umbilical cord is yellow and i keep it in my trunk"
            },
            "QR_CODE_5": {
                id: 5,
                found: false,
                clue: "Then we went on an incredible journey across different places! And we took SO MANY PICTURES! Paris baby",
                nextHint: "The glovebox"
            }
        };

        try {
            const storedConfig = localStorage.getItem('qrCodesConfig');
            if (storedConfig) {
                const parsedConfig = JSON.parse(storedConfig);
                return this.validateQRCodesConfig(parsedConfig) ? parsedConfig : defaultConfig;
            }
            return defaultConfig;
        } catch (error) {
            console.error('Error loading QR codes config:', error);
            return defaultConfig;
        }
    }

    // Validate QR Codes configuration
    validateQRCodesConfig(config) {
        const requiredKeys = ['id', 'clue', 'nextHint', 'found'];
        return Object.values(config).every(qrCode => 
            requiredKeys.every(key => 
                qrCode.hasOwnProperty(key) && 
                (key === 'found' ? typeof qrCode[key] === 'boolean' : 
                 typeof qrCode[key] === 'string' && qrCode[key].trim().length > 0)
            )
        );
    }

    // Load treasure location with fallback
    loadTreasureLocation() {
        try {
            const storedLocation = localStorage.getItem('treasureLocation');
            return storedLocation || "Look inside a special place that means something to both of us!";
        } catch (error) {
            console.error('Error loading treasure location:', error);
            return "Look inside a special place that means something to both of us!";
        }
    }

    // Update configuration
    updateConfig(newConfig) {
        if (this.validateQRCodesConfig(newConfig.qrCodes)) {
            this.qrCodes = newConfig.qrCodes;
            this.treasureLocation = newConfig.treasureLocation || this.treasureLocation;
            try {
                localStorage.setItem('qrCodesConfig', JSON.stringify(this.qrCodes));
                localStorage.setItem('treasureLocation', this.treasureLocation);
            } catch (error) {
                console.error('Could not save configuration:', error);
            }
            window.dispatchEvent(new CustomEvent('treasureHuntConfigUpdate', { 
                detail: { config: this } 
            }));
        } else {
            console.error('Invalid configuration provided');
        }
    }

    // Reset progress
    resetProgress() {
        Object.values(this.qrCodes).forEach(qrCode => {
            qrCode.found = false;
        });
        localStorage.removeItem('treasureHuntProgress');
        localStorage.setItem('qrCodesConfig', JSON.stringify(this.qrCodes));
        window.dispatchEvent(new CustomEvent('treasureHuntProgressReset'));
    }
}

const qrCodes = new TreasureHuntConfig().qrCodes;
const treasureLocation = new TreasureHuntConfig().treasureLocation;

window.qrCodes = qrCodes;
window.treasureLocation = treasureLocation;
