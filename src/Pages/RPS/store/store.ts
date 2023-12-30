import { makeObservable, observable, computed, action } from "mobx";

export default class Store {
  isReady: boolean = false;

  error: string = "";

  constructor() {
    makeObservable(this, {
      isReady: observable,
      error: observable,
    });
  }

  setReady() {
    this.isReady = true;
  }

  setError(error: unknown) {
    this.error = typeof error === "string" ? error : (error as Error).message;
  }
}
