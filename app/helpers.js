const path = require('path');
const fs = require('fs');

const CONFIG = {
    PORT: 80,
    SCREENSHOTS_DIR: path.join(__dirname, 'screenshots'),
};

const ensureScreenshotsDir = () => {
    if (!fs.existsSync(CONFIG.SCREENSHOTS_DIR)) {
        fs.mkdirSync(CONFIG.SCREENSHOTS_DIR, { recursive: true });
    }
};

const isValidUrl = url => {
    if (!url.includes('tidio.com')) {
        return false;
    }

    return true;
};

const generateTimestamp = () => {
    return new Date().toISOString().replace(/[:.]/g, '-');
};

module.exports = {
    CONFIG,
    ensureScreenshotsDir,
    isValidUrl,
    generateTimestamp,
};
