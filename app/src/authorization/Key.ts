import { generateKeyPairSync } from 'crypto';
import { APP_PRIVATE_KEY } from '../config/env.config';

/**
 * Class to generate an asymmetric key
 */
export class Key {
    private privateKey: string;
    private publicKey: string;
    private passphrase: string;

    constructor(){
        // this.passphrase = process.env.PASSPHRASE;
        this.generateKey();
    }

    /**
     * Generates an asymmetric key pair
     */
    private generateKey(): void{
        try {
            const { publicKey, privateKey } = generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                  type: 'spki',
                  format: 'pem'
                },
                privateKeyEncoding: {
                  type: 'pkcs8',
                  format: 'pem',
                  cipher: 'aes-256-cbc',
                  passphrase: APP_PRIVATE_KEY
                }
              });

              this.privateKey = privateKey;
              this.publicKey = publicKey;
        } catch (error) {
            // Hier noch einen Error werfen
        }
    }

    /**
     * Returns the private key of the key pair
     * @returns string, The private key
     */
    public getPrivateKey(): string {
        return this.privateKey;
    }

    /**
     * Returns the public key of the key pair
     * @returns string, The public key
     */
    public getPublicKey(): string {
        return this.publicKey;
    }

    /**
     * Returns the passphrase of the key pair
     * @returns string, The Passphrase
     */
    public getPassphrase(): string {
        return this.passphrase;
    }
}
