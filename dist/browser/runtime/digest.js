import crypto, { transformOperation } from './webcrypto.js';
const digest = async (algorithm, data) => {
    const subtleDigest = `SHA-${algorithm.substr(-3)}`;
    return new Uint8Array(await transformOperation(crypto.subtle.digest(subtleDigest, data)));
};
export default digest;
