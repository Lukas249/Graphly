class HistoryState<T> {
  states: T[] = [];
  index: number = -1;

  reset() {
    this.states = [];
    this.index = -1;
  }

  push(state: T) {
    if (this.states.length !== this.index + 1) return;
    this.states.push(state);
    this.index++;
  }

  pop(): T | null {
    if (this.states.length !== this.index + 1) return null;
    this.index--;
    return this.states.pop() ?? null;
  }

  current(): T | null {
    if (this.index == -1) return null;
    return this.states[this.index];
  }

  goBack(): T | null {
    if (this.index <= 0) return null;
    return this.states[--this.index];
  }

  goForward(): T | null {
    if (this.index + 1 >= this.states.length) return null;
    return this.states[++this.index];
  }

  canGoBack(): boolean {
    return this.index > 0;
  }

  canGoForward(): boolean {
    return this.index + 1 < this.states.length;
  }
}

export default HistoryState;
