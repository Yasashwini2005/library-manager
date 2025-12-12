const mysql = require('mysql2');

// Try different password combinations
const passwords = [
    '',           // No password
    'root',       // Common default
    'password',   // Common default
    'admin',      // Common default
    // Add your suspected password here
];

async function testPasswords() {
    console.log('Testing MySQL connections...\n');
    
    for (const password of passwords) {
        console.log(`Trying password: "${password}"`);
        
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'book_library'
        });
        
        await new Promise((resolve) => {
            connection.connect((err) => {
                if (err) {
                    console.log(`❌ Failed: ${err.message}\n`);
                } else {
                    console.log(`✅ SUCCESS! Password is: "${password}"`);
                    console.log('Add this to your .env file:');
                    console.log(`DB_PASSWORD=${password}\n`);
                    connection.end();
                }
                resolve();
            });
        });
    }
}

testPasswords();