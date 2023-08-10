import CryptoJS from 'crypto-js';

/**
 * Given a string, returns the string formatted to get
 * full support by query params.
 * @param {string} value to get format
 * @returns {string} value fully supported by query format
 */
export function getQueryFormat(value) {
  const urlSearchParams = new URLSearchParams();

  urlSearchParams.append('key', value);

  return urlSearchParams.toString().split('=')[1];
}

/**
 * Given a string and a key, returns its value encrypted by AES
 * @param {string} valueToEncrypt
 * @param {string} key, used to encode with AES
 * @returns {string} encrypted AES token result
 */
export function getAESEncryption(valueToEncrypt, key) {
  const AES = CryptoJS.AES.encrypt(valueToEncrypt, key).toString();

  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(AES));
}

export function encryptDataBeforeSent(data) {
  return getAESEncryption(JSON.stringify(data), process.env.CSR_ENCRYPT_SECRET);
}
