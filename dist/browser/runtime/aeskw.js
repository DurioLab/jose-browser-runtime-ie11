import bogusWebCrypto from './bogus.js';
import crypto, { isCryptoKey, transformOperation } from './webcrypto.js';
function checkKeySize(key, alg) {
    if (key.algorithm.length !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
function getCryptoKey(key, usage) {
    if (isCryptoKey(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        return transformOperation(crypto.subtle.importKey('raw', key, 'AES-KW', true, [usage]));
    }
    throw new TypeError('invalid key input');
}
export const wrap = async (alg, key, cek) => {
    const cryptoKey = await getCryptoKey(key, 'wrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await transformOperation(crypto.subtle.importKey('raw', cek, ...bogusWebCrypto));
    return new Uint8Array(await transformOperation(crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW')));
};
export const unwrap = async (alg, key, encryptedKey) => {
    const cryptoKey = await getCryptoKey(key, 'unwrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await transformOperation(crypto.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', ...bogusWebCrypto));
    return new Uint8Array(await transformOperation(crypto.subtle.exportKey('raw', cryptoKeyCek)));
};
