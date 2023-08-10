import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

/**
 * Given a AES token and a key, returns its value descrypted by AES
 * @param {string} token, AES encrypted token
 * @param {string} key, used to decode token
 * @returns {string} decrypted result
 */
export function getAESDescryption(token, key) {
  const AESToken = CryptoJS.enc.Utf8.stringify(
    CryptoJS.enc.Base64.parse(token),
  );

  return CryptoJS.AES.decrypt(AESToken, key).toString(CryptoJS.enc.Utf8);
}

export function decodeJWT(token) {
  return jwt.decode(token);
}
