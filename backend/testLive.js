import axios from 'axios';

const testLive = async () => {
    try {
        console.log('Testing registration on http://localhost:5001/api/auth/register');
        const res = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Live Test Patient',
            email: 'live_test@clinic.com',
            password: 'password123',
            age: 30,
            gender: 'Male',
            phone: '9998887776',
            address: '123 Live St'
        });
        console.log('Registration Success:', res.data.success);
        console.log('User ID:', res.data.user._id);
        
        // Wait a bit and check DB
        process.exit(0);
    } catch (error) {
        console.error('Registration Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

testLive();
