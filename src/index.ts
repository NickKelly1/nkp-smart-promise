/**
 * Promise resolution function
 *
 * Resolves the promise with the given value
 */
export interface PromiseResolve<T> {
  (value: T | PromiseLike<T>): void;
}

/**
 * Promise rejection function
 *
 * Rejects the promise with the given reason
 */
export interface PromiseReject {
  (reason: unknown): void;
}

/**
 * Promise executor function
 *
 * Executes the promise and triggers resolution or rejection
 */
export interface PromiseExecutor<T> {
  (resolve: PromiseResolve<T>, reject: PromiseReject): void;
}

/**
 * SmartPromise that has been resolved
 */
export interface ResolvedPromise<T> extends SmartPromise<T> {
  readonly value: T | PromiseLike<T>;
  readonly reason: undefined;
}

/**
 * SmartPromise that has been rejected
 */
export interface RejectedPromsie<T> extends SmartPromise<T> {
  readonly value: undefined;
  readonly reason: unknown;
}

/**
 * SmartPromise is a Promise that can be resolved or rejected from outside
 * it's executor function.
 *
 * @see {@link Promise}
 */
export class SmartPromise<T> extends Promise<T> {
  /**
   * Is the promise-like value a promise?
   *
   * @param unknown value to check
   * @returns       whether the value is promise-like
   */
  static isPromise<U>(like: PromiseLike<U>): like is Promise<U> {
    // must have `catch`-like function
    if (typeof (like as any).catch !== 'function') return false;
    // success
    return true;
  }

  /**
   * Is the value promise-like?
   *
   * @param unknown value to check
   * @returns       whether the value is promise-like
   */
  static isPromiseLike(unknown: unknown): unknown is PromiseLike<unknown> {
    // must be defined
    if (!unknown) return false;
    // must be object
    if (typeof unknown !== 'object') return false;
    // must have `then`-like function
    if (typeof (unknown as any).then !== 'function') return false;
    // success
    return true;
  }


  /**
   * If the SmartPromise resolved, the value that the SmartPromise resolved with
   */
  get value(): undefined | T | PromiseLike<T> {
    return this._value;
  }

  /**
   * If the SmartPromsie rejected, the reason that the SmartPromise rejected
   * with
   */
  get reason(): undefined | unknown {
    return this._reason;
  }

  protected _value!: undefined | T | PromiseLike<T>;
  protected _reason!: undefined | unknown;
  protected _resolve!: PromiseResolve<T>;
  protected _reject!: PromiseReject;
  protected _isFulfilled: boolean;
  protected _isResolved: boolean;
  protected _isRejected: boolean;

  /**
   * Create a new SmartPromise
   *
   * @param executor  optional instantly called function that may resolve or
   *                  reject the promise
   *
   * @see {@link Promise}
   */
  constructor(executor?: PromiseExecutor<T>) {
    // temporarily store class instance properties to local variables so we
    // can bind them to the class instance after the promise executor called
    // called by the superclass resolves
    // note that we can't reference `this` within the promise executor
    // because `this` can only be called once the `super` call has completed
    let _resolve: PromiseResolve<T>;
    let _reject: PromiseReject;
    let superCallFinished = false;
    const _value: undefined | T = undefined;
    let _reason: undefined | unknown = undefined;
    let _isFulfilled = false;
    let _isResolved = false;
    let _isRejected = false;

    super((rawResolve, rawReject) => {
      // hijack the resolve and reject functions given to the promise executor
      // so we can bind them to the class instance and allow them to be called
      // from outside the executors context

      /**
       * Resolves the unwrapped value of the promise-like resolved value
       *
       * @param innerValue
       */
      const resolveInner = (innerValue: T) => {
        if (!superCallFinished) {
          // we can't reference `this` until super call completes
          // store local variables and bind to `this` after `super` call
          // completes
          _isFulfilled = true;
          _isResolved = true;
        } else {
          this._isFulfilled = true;
          this._isResolved = true;
          this._value = innerValue;
        }
        rawResolve(innerValue);
      };

      /**
       * Resolves the unwrapped value of the possibly promise-like resolved
       * value
       *
       * @param innerValue
       */
      const rejectInner = (innerReason: unknown) => {
        // ensure we don't call "this" until super call completes
        if (!superCallFinished) {
          _isFulfilled = true;
          _isRejected = true;
          _reason = innerReason;
        } else {
          this._isFulfilled = true;
          this._isRejected = true;
          this._reason = innerReason;
        }
        rawReject(innerReason);
      };

      _resolve = (value) => {
        if (SmartPromise.isPromiseLike(value)) {
          // promise
          if (SmartPromise.isPromise(value)) value
            .then(resolveInner)
            .catch(rejectInner);
          // promise-like but not promise
          else value.then(resolveInner);
        } else {
          // not promise-like
          resolveInner(value);
        }
      };

      _reject = (reason) => {
        if (SmartPromise.isPromiseLike(reason)) {
          // promise
          if (SmartPromise.isPromise(reason)) reason
            .then(rejectInner)
            .catch(rejectInner);
          // promise-like but not promise
          else reason.then(rejectInner);
        } else {
          // not promise-like
          rejectInner(reason);
        }
      };

      // allow normal execution (from the callees perspective) to run
      executor?.(_resolve, _reject);
    });

    superCallFinished = true;
    this._value = _value;
    this._reason = _reason;
    this._isFulfilled = _isFulfilled;
    this._isResolved = _isResolved;
    this._isRejected = _isRejected;
    this._resolve = _resolve!;
    this._reject = _reject!;
  }

  /**
   * Has the promise been resolved or rejected?
   */
  isFulfilled(): boolean { return this._isFulfilled; }

  /**
   * Has the promise resolved?
   */
  isResolved(): this is ResolvedPromise<T> { return this._isResolved; }

  /**
   * Has the promise rejected?
   */
  isRejected(): this is RejectedPromsie<T> { return this._isRejected; }

  /**
   * Resolve the promise
   *
   * @param value value to resolve
   */
  public resolve(value: T | PromiseLike<T>): void {
    return this._resolve(value);
  }

  /**
   * Reject the promise
   *
   * @param reason reason for rejection
   */
  public reject(reason?: unknown): void {
    return this._reject(reason);
  }
}
