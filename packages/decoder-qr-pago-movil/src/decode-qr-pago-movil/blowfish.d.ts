declare module 'blowfish' {
  interface BlowfishInstance {
    encrypt(plaintext: string): string;
    decrypt(ciphertext: string): string;
  }
  interface BlowfishConstructor {
    new(key: string): BlowfishInstance;
  }
  const Blowfish: BlowfishConstructor;
  export = Blowfish;
}
