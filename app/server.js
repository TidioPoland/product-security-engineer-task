const express = require('express');
const ScreenshotService = require('./screenshotService');
const { CONFIG, ensureScreenshotsDir } = require('./helpers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    });
});

app.get('/screenshot', async (req, res) => {
    try {
        let { url, timeout } = req.query;

        if (!url) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'URL parameter is required',
            });
        }

        if (timeout) {
          const parsedTimeout = parseInt(timeout);
          if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
            return res.status(400).json({
              error: 'Bad request',
              message: 'Timeout must be a valid positive integer',
            });
          }
          timeout = parsedTimeout;
        }

        const screenshotPath = await ScreenshotService.takeScreenshot(url);

        res.status(200).json({
            success: true,
            message: 'Screenshot taken successfully',
            data: {
                url,
                path: screenshotPath,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error in screenshot endpoint:', error);

        const statusCode = error.message.includes('Invalid URL') ? 400 : 500;
        res.status(statusCode).json({
            error: statusCode === 400 ? 'Bad request' : 'Internal server error',
            message: error.message,
        });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'screenshot-service',
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

const startServer = () => {
    ensureScreenshotsDir();

    app.listen(CONFIG.PORT, () => {
        console.log(`Screenshot service is running on port ${CONFIG.PORT}`);
        console.log(`Screenshots directory: ${CONFIG.SCREENSHOTS_DIR}`);
    });
};

startServer();

module.exports = app;
