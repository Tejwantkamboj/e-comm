import crypto from 'crypto';

// Define constants (use environment variables for production)
const SECRET_KEY = process.env.SECRET_KEY; // 32 characters for AES-256
const ALGORITHM = process.env.ALGORITHM;

// Function to encrypt data
export function encryptData(data) {
    const iv = crypto.randomBytes(16); // Generate a random Initialization Vector (IV)
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex'); // Encrypt the data
    encrypted += cipher.final('hex'); // Finalize the encryption process

    // Return the encrypted data and IV
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
    };
}

// Function to decrypt data (optional if you need decryption in Node.js)
export function decryptData(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8'); // Decrypt the data
    decrypted += decipher.final('utf8'); // Finalize the decryption process

    return JSON.parse(decrypted); // Parse the JSON string back to an object
}
