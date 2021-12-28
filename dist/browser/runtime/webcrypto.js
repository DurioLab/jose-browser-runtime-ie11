import globalThis from './global.js';

export default globalThis.crypto || globalThis.msCrypto

export function isCryptoKey(key) {
    if (typeof globalThis.CryptoKey === 'undefined') {
        return false;
    }
    return key != null && key instanceof globalThis.CryptoKey;
}

export function transformOperation(returnValue) {
    if(isPromise(returnValue)){
        return returnValue
    }
    return new Promise(function(resolve, reject) {
        digestOp.oncomplete = function(e){
          resolve(e.target.result)
        }
        digestOp.onerror = function(e) {
          reject(e.error)
        }
        digestOp.onabort = function(){
          reject('The digest operation was aborted')
        }
    })
}

function isObject(val){
    return val !== null && typeof val === 'object'
}

function isFunction(val){
    return typeof val === 'function'
}

function isPromise(val){
    return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
