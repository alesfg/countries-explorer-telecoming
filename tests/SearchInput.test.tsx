import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchInput } from '../src/components/SearchInput';

describe('SearchInput', () => {
  it('muestra el placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={() => {}} onClear={() => {}} />
    );
    expect(getByPlaceholderText(/search/i)).toBeTruthy();
  });

  it('llama a onChangeText al escribir', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={onChangeText} onClear={() => {}} />
    );
    fireEvent.changeText(getByPlaceholderText(/search/i), 'spain');
    expect(onChangeText).toHaveBeenCalledWith('spain');
  });
});
