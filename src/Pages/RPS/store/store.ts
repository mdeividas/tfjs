import { makeObservable, observable, action } from "mobx";

export default class Store {
  isReady: boolean = false;

  processing: boolean = false;

  error: string = "";

  result: { player: number | null; ai: number | null } = {
    player: null,
    ai: null,
  };

  constructor() {
    makeObservable(this, {
      isReady: observable,
      processing: observable,
      error: observable,
      result: observable,
      setReady: action,
      setProcessing: action,
      setError: action,
      setResult: action,
    });
  }

  setReady() {
    this.isReady = true;
  }

  setProcessing(flag: boolean) {
    this.processing = flag;

    if (flag) {
      this.result.ai = null;
      this.result.player = null;
    }
  }

  setError(error: unknown) {
    this.error = typeof error === "string" ? error : (error as Error).message;
  }

  setResult(category: number) {
    this.result.player = category;
    this.result.ai = Math.floor(Math.random() * (2 + 1));
  }
}
