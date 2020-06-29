import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

// Convert scrypt callback based function to
// a promise based function
const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`
    }

    static async compare(hashedPassword: string, suppliedPassword: string) {
        const [storedPassword, salt] = hashedPassword.split('.');
        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buffer.toString('hex') === storedPassword;
    }
}