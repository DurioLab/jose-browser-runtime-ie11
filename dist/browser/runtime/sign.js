import subtleAlgorithm from './subtle_dsa.js';
import crypto, { transformOperation } from './webcrypto.js';
import checkKeyLength from './check_key_length.js';
import getSignKey from './get_sign_verify_key.js';
const sign = async (alg, key, data) => {
    const cryptoKey = await getSignKey(alg, key, 'sign');
    checkKeyLength(alg, cryptoKey);
    const signature = await transformOperation(crypto.subtle.sign(subtleAlgorithm(alg), cryptoKey, data));
    return new Uint8Array(signature);
};
export default sign;
