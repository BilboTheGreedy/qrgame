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
                clue: "I love bonbons! GODIS!",
                nextHint: "Under the lid"
            },
            "QR_CODE_2": {
                id: 2,
                found: false,
                clue: "Wooof Woof BonBon! Just like dad",
                nextHint: "The lid feels a few grams heavier..."
            },
            "QR_CODE_3": {
                id: 3,
                found: false,
                clue: "Its big and blue.",
                nextHint: "I require electricity.... my umbilical cord is yellow and i keep it in my trunk put it plugs in where?'"
            },
            "QR_CODE_4": {
                id: 4,
                found: false,
                clue: "Its nice riding shotgun in the car!",
                nextHint: "it can block the sun but it can also be a mirror (something attached to the roof)"
            },
            "QR_CODE_5": {
                id: 5,
                found: false,
                clue: "Its nice riding shotgun in the car!",
                nextHint: "it can block the sun but it can also be a mirror (something attached to the roof)"
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
            return storedLocation || "Look inside the glove box of the car";
        } catch (error) {
            console.error('Error loading treasure location:', error);
            return "Look inside the glove box of the car";
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
