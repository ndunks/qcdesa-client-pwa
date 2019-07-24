import { encode } from 'querystring';
import { VueConstructor } from 'vue';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export class Api {

    /**
     * Default Api end point
     * 
     * You can extends via .env file (dont forget to restart build process)
     * `Vue.use(Api, {url: process.ENV.VUE_APP_API_URL})`
     */
    url: string = `${location.protocol}//${location.host}/api`;

    /** Valid passcode to access */
    passcode: string | null

    /** Default header that will appended on each request */
    defaultHeaders: { [$key: string]: string } = {}

    /** Hook before execute api request */
    beforeFetch: Function[] = [];

    /** Hook after execute api request */
    afterFetch: Function[] = [];

    /** Login state, null mean unchecked */
    private _isLogin: boolean | null = null;

    /** Extend any propery via config */
    constructor(options?: { [field in keyof Api]: any }) {
        options && Object.keys(options).forEach(
            k => (this as any)[k] = options[k]
        );
        // Auto display loading bar when fetching data
        this.beforeFetch.push(() => loading.counter++)
        this.afterFetch.push(() => loading.counter--)
    }

    /**
     * Vue Plugin install
     */
    static install(Vue: VueConstructor, options: { [field in keyof Api]: any }): Api {
        return Vue.prototype.$api = window.$api = new Api(options);
    }
    /**
     * Get list of quick count
     */
    listQuickcount(){
        return this.sendGet('/list');
    }

    adminListQuickcount() {
        return this.sendGet('/admin/quickcount')
    }

    adminAddQuickcount(data) {
        return this.send('PUT', '/admin/quickcount', data);
    }

    adminPatchQuickcount(index, data) {
        return this.send('PATCH', `/admin/quickcount/${index}`, data);
    }

    /**
     * Upload file to server
     * @param file Input file to upload
     */
    adminUpload(file: File): Promise<{ size: number, url: string }> {
        return this.send('PUT', `admin/upload/${file.name}`, file);
    }

    /**
     * Check login state
     */
    async isLogin(): Promise<boolean> {
        if (typeof (this._isLogin) != 'boolean') {
            console.log('Login Check');
            if (typeof (localStorage.passcode) != undefined) {
                return this.adminLogin(localStorage.passcode);
            } else {
                console.log('No passcode to check');
                return this._isLogin = false;
            }
        } else return this._isLogin;
    }

    /**
     * Login admin using passcode
     * @param passcode @type {String}
     */
    adminLogin(passcode: string): Promise<boolean> {
        return this.send('POST', 'admin', { passcode }).then(
            res => {
                if (res && res.valid) {
                    // Set passcode
                    this.passcode = localStorage.passcode = passcode;
                    return this._isLogin = true;
                } else {
                    localStorage.removeItem('passcode');
                    this.passcode = null;
                    return this._isLogin = false;
                }
            }
        )
    }

    /**
     * Shorthand for GET requet
     */
    sendGet<TDATA = any>(path: string, query?: any, headers?: HeadersInit): Promise<TDATA> {
        return this.send('GET', path, null, query, headers)
    }

    /**
     * Low level API Request
     */
    send<TDATA = any>(method: HttpMethod, path: string, body?: any, query?: any, headers?: HeadersInit): Promise<TDATA> {
        if (!this.url) {
            return Promise.reject('No API URL');
        }
        if (!path) {
            return Promise.reject('No path');
        }

        let requestUrl = `${this.url}/${path.replace(/^\/+/, '')}`;

        headers = new Headers(headers ? { ...this.defaultHeaders, ...headers } : this.defaultHeaders)

        const init: RequestInit = {
            method: method.toUpperCase(),
            headers: headers
        };
        this.beforeFetch.forEach(v => v());
        if (body && typeof (body) == 'object') {
            if (method == 'GET' || method == 'HEAD' || method == 'OPTIONS') {
                if (query) {
                    return Promise.reject('Cannot use booth body and query params!');
                }
                query = body;
                body = null;
            } else {
                if (body instanceof File) {
                    headers.append('Content-Type', body.type)
                    init.body = body;
                } else {
                    init.body = JSON.stringify(body)
                    headers.append('Content-Type', 'application/json')
                }
            }
        }

        // check must not empty
        if (query && Object.values(query).filter(v => v)) {
            requestUrl += '?' + encode(query);
        }

        if (this.passcode) {
            headers.append('Authorization', `Passcode ${this.passcode}`)
        }

        return fetch(requestUrl, init).finally(() => this.afterFetch.forEach(v => v())).then(
            res => {
                if ((res.headers.get('content-type') || '').match(/json/i)) {
                    const json = res.json() as any;
                    if (json.error) {
                        return Promise.reject(json)
                    } else {
                        return json;
                    }
                } else {
                    return Promise.reject({ message: 'Response is not JSON!' });
                }
            }
        );
    }
}