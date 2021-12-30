import { subtract } from './subtract';

describe('subtract', () => {
  it('subtracts two numbers', () => {
    expect(subtract(1, 2)).toBe(-1);
  });
});
