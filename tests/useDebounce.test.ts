import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '../src/utils/useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('debe devolver el valor inicial inmediatamente', () => {
    const { result } = renderHook((props: { value: string }) => useDebounce(props.value, 500), {
      initialProps: { value: 'hola' },
    });
    expect(result.current).toBe('hola');
  });

  it('debe actualizar el valor tras el delay', () => {
    const { result, rerender } = renderHook((props: { value: string }) => useDebounce(props.value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    expect(result.current).toBe('a');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('b');
  });
});
