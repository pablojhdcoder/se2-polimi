require('dotenv').config();
const emailService = require('./src/services/external/emailService');

async function testEmail() {
    console.log('--- Email Service Verification ---');

    // Test Welcome Email
    console.log('\nTesting Welcome Email...');
    await emailService.sendWelcomeEmail('test@user.com', 'Test Cyclist');

    // Test Trip Summary
    console.log('\nTesting Trip Summary...');
    const mockTrip = {
        tripDate: new Date(),
        tripLength: 5200,
        temperature: 24
    };
    await emailService.sendTripSummary('test@user.com', mockTrip);

    console.log('\n--- Verification Finished ---');
}

testEmail();
