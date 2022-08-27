import CryptoJS from "crypto-js";

const { REACT_APP_SECRET_KEY } = process.env;

export function encryptData(data: string): string {
  const encodedData = CryptoJS.AES.encrypt(
    data,
    REACT_APP_SECRET_KEY as string
  );
  return encodedData.toString();
}

export function decryptData(encrypted: string): string {
  const decrypted = CryptoJS.AES.decrypt(
    encrypted.toString(),
    REACT_APP_SECRET_KEY as string
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
