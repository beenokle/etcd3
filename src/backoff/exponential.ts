import { IBackoffStrategy } from './backoff';

/**
 * IExponentialOptions are passed into the ExponentialBackoff constructor. The
 * backoff equation is, in general, min(max, initial ^ n), where `n` is
 * an incremented backoff factor. The result of the equation is a delay
 * given in milliseconds.
 */
export interface IExponentialOptions {
  /**
   * The initial delay passed to the equation.
   */
  initial: number;

  /**
   * Random factor to subtract from the `n` count.
   */
  random: number;

  /**
   * max is the maximum value of the delay.
   */
  max: number;
}

/**
 * @see https://en.wikipedia.org/wiki/Exponential_backoff
 */
export class ExponentialBackoff implements IBackoffStrategy {
  private counter: number;

  constructor(protected options: IExponentialOptions) {
    this.counter = 0;
  }

  /**
   * @inheritDoc
   */
  public getDelay(): number {
    const count = this.counter - Math.round(Math.random() * this.options.random);
    return Math.min(this.options.max, this.options.initial * 2 ** Math.max(count, 0));
  }

  /**
   * @inheritDoc
   */
  public next(): IBackoffStrategy {
    const next = new ExponentialBackoff(this.options);
    next.counter = this.counter + 1;
    return next;
  }

  /**
   * @inheritDoc
   */
  public reset(): IBackoffStrategy {
    return new ExponentialBackoff(this.options);
  }
}
