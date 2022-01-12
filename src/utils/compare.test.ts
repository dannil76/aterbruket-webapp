import compare from './compare';

describe('Compare helper', () => {
  test('returns true', () => {
    expect(compare(1, '<', 2)).toBeTruthy();
  });
  test('returns false', () => {
    expect(compare('foo', '==', 'bar')).toBeFalsy();
  });
  test('returns false', () => {
    expect(compare('1', '==', 1)).toBeTruthy();
  });
  test('returns false', () => {
    expect(compare('1', '===', 1)).toBeFalsy();
  });
});
