import http from 'http';

const data = JSON.stringify({
  email: 'admin@clinic.com',
  password: 'admin123',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

req.write(data);
req.end();
