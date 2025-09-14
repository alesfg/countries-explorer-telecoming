import en from './en';
import es from './es';

const translations: Record<string, any> = {
	en,
	es,
};

let locale = 'en';

const getNested = (obj: any, path: string) => {
	return path.split('.').reduce((acc: any, part: string) => {
		if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
			return acc[part];
		}
		return undefined;
	}, obj);
};

export const t = (key: string, _opts?: Record<string, any>) => {
	const val = getNested(translations[locale], key);
	if (val === undefined) return key;
	return val;
};

export const setLocale = (l: string) => {
	if (translations[l]) locale = l;
};

export default { t, setLocale };
