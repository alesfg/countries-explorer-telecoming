// src/__tests__/sample.test.ts
describe('Sample Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test string operations', () => {
    const greeting = 'Hello Countries Explorer';
    expect(greeting).toContain('Countries');
  });
});
