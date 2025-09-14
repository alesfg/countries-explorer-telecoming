import { t } from '../src/i18n';

describe('i18n translation', () => {
  it('returns English by default', () => {
    expect(t('app.title')).toBe('Countries Explorer');
  });
  it('returns fallback for missing key', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});
