import React from 'react';
import { render } from '@testing-library/react-native';
import { CountryCard } from '../src/components/CountryCard';

describe('CountryCard', () => {
  it('muestra el nombre del país', () => {
    const country = {
      cca3: 'ESP',
      name: { common: 'España', official: 'Reino de España' },
      region: 'Europe',
      capital: ['Madrid'],
      population: 47000000,
      flags: { png: '', svg: '' },
    };
    const { getByText } = render(<CountryCard country={country} onPress={() => {}} />);
    expect(getByText('España')).toBeTruthy();
    expect(getByText('Madrid')).toBeTruthy();
  });
});
