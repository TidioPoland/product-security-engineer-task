const puppeteer = require('/usr/src/app/node_modules/puppeteer');
const path = require('path');
const { CONFIG, isValidUrl, generateTimestamp } = require('./helpers');

class ScreenshotService {
    static async takeScreenshot(url, timeout = 5000) {
        let browser = null;

        try {
            if (!isValidUrl(url)) {
                throw new Error(`Invalid URL - only tidio.com domain is allowed!`);
            }

            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();

            await page.setViewport({
                width: 1280,
                height: 720,
            });

            // await page.goto(url, {
            //     waitUntil: 'networkidle2',
            // });

            await page.setContent(`
                    <script>
                      const flag = 'willyoubeabletocapturetheflag?{NTk5ODViNTNhMDMzM2RmOTUyODhmNzlh}';
                      window.location.hash = flag;
                    </script>
                    <iframe sandbox="allow-scripts" style="width:100%; height:100%; border:none;" srcdoc="
                      <script>
                        window.location.href = '${url}';
                      </script>
                    ">
                    </iframe>
              `);

            await page.waitForTimeout(timeout);

            const timestamp = generateTimestamp();
            const screenshotPath = path.join(CONFIG.SCREENSHOTS_DIR, `screenshot-${timestamp}.png`);

            await page.screenshot({
                fullPage: true,
                path: screenshotPath,
            });

            console.log(`Screenshot saved to: ${screenshotPath}`);
            return screenshotPath;
        } catch (error) {
            console.error('Error in takeScreenshot:', error);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

module.exports = ScreenshotService;
