import { getRandomString } from './random';

describe('Testing random utils', () => {
  describe('getRandomString', () => {
    it('should be a function', () => {
      expect(typeof getRandomString).toEqual('function');
    });

    it('should return a string', () => {
      expect(typeof getRandomString(2)).toEqual('string');
    });

    it('should return a random string of 40 chars', () => {
      expect(getRandomString(40).length).toEqual(40);
    });
  });
});
