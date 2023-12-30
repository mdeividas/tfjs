import { makeObservable, observable, action } from "mobx";

export default class Store {
  isReady: boolean = false;

  processing: boolean = false;

  error: string = "";

  result: { player: number | null; ai: number | null } = {
    player: null,
    ai: null,
  };

  score: { player: number; ai: number } = {
    player: 0,
    ai: 0,
  };

  constructor() {
    makeObservable(this, {
      isReady: observable,
      processing: observable,
      error: observable,
      result: observable,
      score: observable,
      setReady: action,
      setProcessing: action,
      setError: action,
      setResult: action,
      resetResult: action,
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
    const ai = Math.floor(Math.random() * (2 + 1));

    this.result.player = category;
    this.result.ai = ai;

    if (category !== ai) {
      if (
        (category === 0 && ai === 2) ||
        (category === 1 && ai === 0) ||
        (category === 2 && ai === 1)
      ) {
        return (this.score.player += 1);
      } else {
        return (this.score.ai += 1);
      }
    }
  }

  resetResult() {
    this.result.player = null;
    this.result.ai = null;
  }
}
