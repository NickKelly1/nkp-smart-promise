import { PromiseReject, PromiseResolve, SmartPromise } from '.';

describe('SmartPromise', () => {
  it('should allow normal promise resolution', async () => {
    let value: null | number = null;
    const promise: Promise<number> = new SmartPromise<number>((res) => {
      value = 5;
      res(5);
    });
    // expect the executor to be immediately called in the promsie constructor
    expect(value).toBe(5);
    const resolved = await promise;
    expect(resolved).toBe(5);
  });

  it('should allow normal promise rejection', async () => {
    let value: null | string = null;
    const promise: Promise<number> = new SmartPromise<number>((res, rej) => {
      value = 'reason';
      rej('reason');
    });
    // expect the executor to be immediately called in the promsie constructor
    expect(value).toBe('reason');
    let caught = false;
    const resolved = await promise.catch((reason) => {
      caught = true;
      return reason;
    });
    expect(caught).toEqual(true);
    expect(resolved).toBe('reason');
  });

  it('after resolution: should set isFulfilled, isResolved, isRejected, reason and value ', () => {
    let _res: PromiseResolve<number>;
    const promise: SmartPromise<number> = new SmartPromise<number>((res) => { _res = res; });
    expect(promise.value).toBeUndefined();
    expect(promise.reason).toBeUndefined();
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    _res!(5);
    expect(promise.value).toBe(5);
    expect(promise.reason).toBeUndefined();
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeTruthy();
    expect(promise.isRejected()).toBeFalsy();
  });

  it('after rejection: should set isFulfilled, isResolved, isRejected, reason and value ', () => {
    let _rej: PromiseReject;
    const promise: SmartPromise<number> = new SmartPromise<number>((_, rej) => { _rej = rej; });
    // catch to avoid process throwing an UNHANDLED_PROMISE_REJECTION
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    promise.catch(() => {});
    expect(promise.value).toBeUndefined();
    expect(promise.reason).toBeUndefined();
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    _rej!('fail');
    expect(promise.value).toBeUndefined();
    expect(promise.reason).toBe('fail');
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeTruthy();
  });

  it('should allow for resolution outside of the executor function', () => {
    const promise = new SmartPromise<number>();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.value).toBeUndefined();
    promise.resolve(5);
    expect(promise.isResolved()).toBeTruthy();
    expect(promise.value).toBe(5);
  });

  it('should allow for rejection outside of the executor function', () => {
    const promise = new SmartPromise<number>();
    // catch to avoid process throwing an UNHANDLED_PROMISE_REJECTION
    promise.catch(() => {});
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.reason).toBeUndefined();
    promise.reject('fail');
    expect(promise.isRejected()).toBeTruthy();
    expect(promise.reason).toBe('fail');
  });

  it('should resolve the inner value of a resolved resolving promise', async () => {
    const promise = new SmartPromise<number>();
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.value).toBe(undefined);
    const innerp = Promise.resolve(5);
    promise.resolve(innerp);
    await innerp;
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeTruthy();
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.value).toBe(5);
  });

  it('should reject the inner value of a resolved rejecting promise', async () => {
    const promise = new SmartPromise<number>();
    promise.catch(() => {});
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.value).toBe(undefined);
    const innerp = Promise.reject('reason');
    promise.resolve(innerp);
    await innerp.catch(() => {});
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeTruthy();
    expect(promise.reason).toBe('reason');
  });

  it('should reject the inner value of a rejected resolving promise', async () => {
    const promise = new SmartPromise<number>();
    promise.catch(() => {});
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.value).toBe(undefined);
    const innerp = Promise.resolve('reason');
    promise.reject(innerp);
    await innerp;
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeTruthy();
    expect(promise.reason).toBe('reason');
  });

  it('should reject the inner value of a rejected rejecting promise', async () => {
    const promise = new SmartPromise<number>();
    promise.catch(() => {});
    expect(promise.isFulfilled()).toBeFalsy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeFalsy();
    expect(promise.value).toBe(undefined);
    const innerp = Promise.reject('reason');
    promise.reject(innerp);
    await innerp.catch(() => {});
    expect(promise.isFulfilled()).toBeTruthy();
    expect(promise.isResolved()).toBeFalsy();
    expect(promise.isRejected()).toBeTruthy();
    expect(promise.reason).toBe('reason');
  });
});