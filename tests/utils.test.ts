import { paginateArray } from '../src/utils/pagination';

describe('paginateArray', () => {
  it('devuelve la página correcta', () => {
    const arr = [1,2,3,4,5,6,7,8,9,10];
    const page = paginateArray(arr, 2, 3);
    expect(page.data).toEqual([4,5,6]);
  });
  it('devuelve vacío si la página no existe', () => {
    const arr = [1,2,3];
    const page = paginateArray(arr, 2, 5);
    expect(page.data).toEqual([]);
  });
});
