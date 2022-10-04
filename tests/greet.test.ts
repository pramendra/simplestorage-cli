import greet from '../src/greet';

describe('greet', (): void => {
  test('should say hello to Pram.', (): void => {
    const response: string = greet('Pram');
    expect(response).toBe('Hello, Pram!');
  });
});
