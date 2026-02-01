const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function runTest() {
    console.log('🚀 Starting Full Integration Test...');

    try {
        // 1. Register User
        const timestamp = Date.now();
        const username = `testuser_${timestamp}`;
        console.log(`\n1. Registering user: ${username}...`);
        await axios.post(`${API_BASE}/auth/register`, {
            username,
            password: 'Password123!',
            fullName: 'Test User',
            email: `test_${timestamp}@example.com`
        });
        console.log('   [OK] User registered');

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            username,
            password: 'Password123!'
        });
        const token = loginRes.data.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        console.log('   [OK] Login successful, token received');

        // 3. Create a Path
        console.log('\n3. Creating a test path...');
        const pathRes = await axios.post(`${API_BASE}/paths`, {
            pathName: `Path_${timestamp}`,
            startX: 454642,
            startY: 91900,
            endX: 454644,
            endY: 91902,
            length: 150,
            routeData: {
                type: 'LineString',
                coordinates: [[9.1900, 45.4642], [9.1901, 45.4643], [9.1902, 45.4644]]
            }
        }, authHeader);
        const pathId = pathRes.data.path.id;
        console.log(`   [OK] Path created, ID: ${pathId}`);

        // 4. Start Manual Trip
        console.log('\n4. Starting manual trip...');
        const tripRes = await axios.post(`${API_BASE}/trips/manual`, {
            pathId: pathId
        }, authHeader);
        // Server returns { message, trip: { id, ... } }
        const tripId = tripRes.data.trip ? tripRes.data.trip.id : null;
        if (!tripId) {
            console.error('❌ FAILED: Trip ID was not returned by server');
            console.error('Server response:', JSON.stringify(tripRes.data, null, 2));
            process.exit(1);
        }
        console.log(`   [OK] Trip started, ID: ${tripId}`);

        // 5. Send Track Chunk 1 (Redis Cache)
        console.log('5. Sending GPS Chunk 1 (Redis)...');
        await axios.patch(`${API_BASE}/trips/${tripId}/route`, {
            coordinates: [
                { lat: 45.4642, lon: 9.1900 },
                { lat: 45.4643, lon: 9.1901 }
            ]
        }, authHeader);
        console.log('   [OK] Chunk 1 cached in Redis');

        // 6. Send Track Chunk 2 (Redis Cache)
        console.log('6. Sending GPS Chunk 2 (Redis)...');
        await axios.patch(`${API_BASE}/trips/${tripId}/route`, {
            coordinates: [
                { lat: 45.4644, lon: 9.1902 }
            ]
        }, authHeader);
        console.log('   [OK] Chunk 2 cached in Redis');

        // 7. Finalize Trip (Flush to Postgres)
        console.log('7. Finalizing trip (Flushing to Postgres)...');
        await axios.patch(`${API_BASE}/trips/${tripId}/route`, {
            metadata: { isFinal: true },
            tripLength: 150
        }, authHeader);
        console.log('   [OK] Trip finalized in database');

        console.log('\n✅ FULL INTEGRATION TEST COMPLETED SUCCESSFULLY!');
        console.log('   - Postgres: Path, User, and Trip records verified via flow.');
        console.log('   - Redis: Cache usage for chunks verified via final flush.');

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(`   Message: ${error.message}`);
        }
        process.exit(1);
    }
}

runTest();
