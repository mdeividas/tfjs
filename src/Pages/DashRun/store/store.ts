import { makeObservable, observable, action } from 'mobx';

export default class Store {
    isReady: boolean = false;

    error: string = '';

    results: { level: number } = {
        level: 1,
    };

    constructor() {
        makeObservable(this, {
            isReady: observable,
            error: observable,
            setReady: action,
        });
    }

    setReady() {
        this.isReady = true;
    }

    setError(error: unknown) {
        this.error = typeof error === 'string' ? error : (error as Error).message;
    }
}
