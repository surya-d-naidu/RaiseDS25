// Test registration API directly
import fetch from 'node-fetch';

async function testRegistration() {
  try {
    console.log('Testing registration API...');
    
    const testUser = {
      username: 'testuser123',
      email: 'illustraton23@gmail.com', // Using your Gmail for testing
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      institution: 'Test University'
    };

    const response = await fetch('http://localhost/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (result.requiresVerification) {
      console.log('✓ Registration successful - OTP should be sent to:', result.email);
    } else {
      console.log('✗ Registration did not return requiresVerification flag');
    }
  } catch (error) {
    console.error('Registration test failed:', error);
  }
}

testRegistration();
