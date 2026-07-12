import axios from 'axios';

const testLogin = async () => {
    try {
        console.log('Attempting login with: admin@clinic.com / admin123 / admin');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@clinic.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Login Success:', res.data);
    } catch (error) {
        console.error('Login Failed Status:', error.response?.status);
        console.error('Login Failed Data:', error.response?.data);
    }
};

testLogin();
