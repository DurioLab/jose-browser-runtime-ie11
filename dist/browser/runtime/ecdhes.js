import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../lib/buffer_utils.js';
import crypto, { isCryptoKey, transformOperation } from './webcrypto.js';
import digest from './digest.js';
export const deriveKey = async (publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) => {
    if (!isCryptoKey(publicKey)) {
        throw new TypeError('invalid key input');
    }
    if (!isCryptoKey(privateKey)) {
        throw new TypeError('invalid key input');
    }
    const value = concat(lengthAndInput(encoder.encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength));
    if (!privateKey.usages.includes('deriveBits')) {
        throw new TypeError('ECDH-ES private key "usages" must include "deriveBits"');
    }
    const sharedSecret = new Uint8Array(await transformOperation(crypto.subtle.deriveBits({
        name: 'ECDH',
        public: publicKey,
    }, privateKey, Math.ceil(parseInt(privateKey.algorithm.namedCurve.substr(-3), 10) / 8) <<
        3)));
    return concatKdf(digest, sharedSecret, keyLength, value);
};
export const generateEpk = async (key) => {
    if (!isCryptoKey(key)) {
        throw new TypeError('invalid key input');
    }
    return (await transformOperation(crypto.subtle.generateKey({ name: 'ECDH', namedCurve: key.algorithm.namedCurve }, true, ['deriveBits']))).privateKey;
};
export const ecdhAllowed = (key) => {
    if (!isCryptoKey(key)) {
        throw new TypeError('invalid key input');
    }
    return ['P-256', 'P-384', 'P-521'].includes(key.algorithm.namedCurve);
};
