const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending emails using Nodemailer.
 * Falls back to console logging if configuration is missing.
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.from = process.env.EMAIL_FROM || '"BBP" <noreply@bbp.com>';
        this._init();
    }

    async _init() {
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-')) {
            console.warn('[EmailService] SMTP credentials missing or placeholder. Email sending will be logged to console only.');
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Prevent app-wide crashes on transport-level errors (like EAUTH during handshake)
            this.transporter.on('error', err => {
                console.error('[EmailService] Transporter error:', err.message);
                this.transporter = null; // Fallback to mock mode
            });

            console.log(`[EmailService] Initialized for ${process.env.EMAIL_USER}`);
        } catch (error) {
            console.error('[EmailService] Initialization failed:', error.message);
            this.transporter = null;
        }
    }

    async sendEmail(options) {
        if (!this.transporter) {
            console.log('--- MOCK EMAIL START ---');
            console.log(`To: ${options.to}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Body: ${options.html || options.text}`);
            console.log('--- MOCK EMAIL END ---');
            return { messageId: 'mock-id' };
        }
        try {
            return await this.transporter.sendMail({
                from: this.from,
                ...options
            });
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
            throw error; // Re-throw to allow caller to handle
        }
    }

    /**
     * Send a welcome email to a new user
     * @param {string} email 
     * @param {string} name 
     */
    async sendWelcomeEmail(email, name) {
        if (!this.transporter) {
            console.log(`[MOCK EMAIL] To: ${email} | Subject: Welcome to BBP | Content: Hi ${name}!`);
            return true;
        }

        try {
            await this.transporter.sendMail({
                from: this.from,
                to: email,
                subject: 'Welcome to Best Bike Paths! 🚲',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h1 style="color: #4CAF50;">Welcome aboard, ${name}!</h1>
                        <p>We're excited to have you in the <strong>Best Bike Paths</strong> community.</p>
                        <p>Start exploring optimal routes, recording your trips, and helping others find the best paths.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${process.env.FRONTEND_URL}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
                        </div>
                        <p style="color: #777; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                            Best Bike Paths Team
                        </p>
                    </div>
                `
            });
            return true;
        } catch (error) {
            console.error('[EmailService] Error sending welcome email:', error);
            return false;
        }
    }

    /**
     * Send a summary after a trip is finished
     * @param {string} email 
     * @param {Object} tripData 
     */
    async sendTripSummary(email, tripData) {
        if (!this.transporter) {
            console.log(`[MOCK EMAIL] To: ${email} | Subject: Trip Summary | Length: ${tripData.tripLength}m`);
            return true;
        }

        try {
            await this.transporter.sendMail({
                from: this.from,
                to: email,
                subject: 'Your BBP Trip Summary 🗺️',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2196F3;">Trip Summary</h2>
                        <p>Great ride! Here's a look at your recent trip:</p>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Date</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${new Date(tripData.tripDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Distance</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${(tripData.tripLength / 1000).toFixed(2)} km</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Average Temp</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${tripData.temperature || '--'} °C</td>
                            </tr>
                        </table>
                        <p>Keep riding and sharing your experiences!</p>
                        <p style="color: #777; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                            Best Bike Paths Team
                        </p>
                    </div>
                `
            });
            return true;
        } catch (error) {
            console.error('[EmailService] Error sending trip summary:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
