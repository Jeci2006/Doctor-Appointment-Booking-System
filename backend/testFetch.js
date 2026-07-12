async function test() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Fetch Test Patient',
                email: 'fetch@test.com',
                password: 'password123',
                age: 22,
                gender: 'Female',
                phone: '1112223334',
                address: 'Fetch Street'
            })
        });
        const data = await response.json();
        console.log('Response:', JSON.stringify(data));
        process.exit(0);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}
test();
