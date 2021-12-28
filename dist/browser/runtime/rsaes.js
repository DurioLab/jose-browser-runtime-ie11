import subtleAlgorithm from './subtle_rsaes.js';
import bogusWebCrypto from './bogus.js';
import crypto, { isCryptoKey, transformOperation } from './webcrypto.js';
import checkKeyLength from './check_key_length.js';
export const encrypt = async (alg, key, cek) => {
    if (!isCryptoKey(key)) {
        throw new TypeError('invalid key input');
    }
    checkKeyLength(alg, key);
    if (key.usages.includes('encrypt')) {
        return new Uint8Array(await transformOperation(crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek)));
    }
    if (key.usages.includes('wrapKey')) {
        const cryptoKeyCek = await transformOperation(crypto.subtle.importKey('raw', cek, ...bogusWebCrypto));
        return new Uint8Array(await transformOperation(crypto.subtle.wrapKey('raw', cryptoKeyCek, key, subtleAlgorithm(alg))));
    }
    throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
};
export const decrypt = async (alg, key, encryptedKey) => {
    if (!isCryptoKey(key)) {
        throw new TypeError('invalid key input');
    }
    checkKeyLength(alg, key);
    if (key.usages.includes('decrypt')) {
        return new Uint8Array(await transformOperation(crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey)));
    }
    if (key.usages.includes('unwrapKey')) {
        const cryptoKeyCek = await transformOperation(crypto.subtle.unwrapKey('raw', encryptedKey, key, subtleAlgorithm(alg), ...bogusWebCrypto));
        return new Uint8Array(await transformOperation(crypto.subtle.exportKey('raw', cryptoKeyCek)));
    }
    throw new TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
};
