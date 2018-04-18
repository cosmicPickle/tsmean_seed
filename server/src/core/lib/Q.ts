export type Deferred = {
    resolve: (...args: any[]) => any,
    reject: (...args: any[]) => any,
    promise: Promise<any>
}

export class Q {

    defer<T>() : Deferred {
        let resolve: (...args: any[]) => any;
        let reject: (...args: any[]) => any;

        let promise: Promise<T> = new Promise<T>(function(){
            resolve = arguments[0];
            reject = arguments[1];
        })

        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        }
    }
}