import { t, setLocale } from '../i18n';

describe('i18n translations', () => {
  test('returns english strings by default', () => {
    setLocale('en');
    expect(t('search.placeholder')).toBe('Search countries...');
    expect(t('country.population')).toBe('Population');
  });

  test('returns spanish strings when locale set to es', () => {
    setLocale('es');
    expect(t('search.placeholder')).toBe('Buscar países...');
    expect(t('country.population')).toBe('Población');
  });
});
