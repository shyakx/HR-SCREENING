const { default: fetch } = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing quiz start API...');
    
    const response = await fetch('http://localhost:3001/api/quiz/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: '69eceb4aa75a8fe17d73e892',
        applicantId: '69eceb4aa75a8fe17d73e895'
      })
    });
    
    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
