import {Injectable} from '@angular/core';
import *  as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class LocalService {
    key = "eZdWJMJ4vPqJUdbsSEIoaZ4FOrKufumF";

    constructor() {
    }

    public set(key: string, value: any, encrypt = true) {
        value = encrypt ? this.encrypt(JSON.stringify(value)) : JSON.stringify(value);
        localStorage.setItem(key, value);
    }

    public get(key: string, decrypt = true, defaultValue:any = false) {
        const data = localStorage.getItem(key) || false;
        if (data) {
            if (decrypt) {
                return JSON.parse(this.decrypt(data));
            }
            return JSON.parse(data);
        }

        return defaultValue;
    }

    public remove(key: string) {
        localStorage.removeItem(key);
    }

    public clear() {
        localStorage.clear();
    }

    private encrypt(txt: string): string {
        return CryptoJS.AES.encrypt(txt, this.key).toString();
    }

    private decrypt(txtToDecrypt: string) {
        return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
    }
}
