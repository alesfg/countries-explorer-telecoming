import { Country } from '../types';
import { API_BASE_URL } from '../constants';

export interface ApiResponse {
  success: boolean;
  data?: Country[];
  error?: string;
}

class CountriesApiService {
  private baseUrl = API_BASE_URL;

  /**
   * Fetch all countries from the API
   */
  async getAllCountries(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/all?fields=name,flags,capital,population,region,cca3`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to match our Country interface
      const countries: Country[] = data.map((country: any) => ({
        name: {
          common: country.name?.common || 'Unknown',
          official: country.name?.official || 'Unknown',
        },
        flags: {
          png: country.flags?.png || '',
          svg: country.flags?.svg || '',
        },
        capital: country.capital || [],
        population: country.population || 0,
        region: country.region || 'Unknown',
        cca3: country.cca3 || '',
      }));

      return {
        success: true,
        data: countries,
      };
    } catch (error) {
      console.error('Error fetching all countries:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Fetch a single country by name
   */
  async getCountryByName(name: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/name/${encodeURIComponent(name)}?fields=name,flags,capital,population,region,cca3`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Country not found',
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API returns an array even for single country
      const countries: Country[] = data.map((country: any) => ({
        name: {
          common: country.name?.common || 'Unknown',
          official: country.name?.official || 'Unknown',
        },
        flags: {
          png: country.flags?.png || '',
          svg: country.flags?.svg || '',
        },
        capital: country.capital || [],
        population: country.population || 0,
        region: country.region || 'Unknown',
        cca3: country.cca3 || '',
      }));

      return {
        success: true,
        data: countries,
      };
    } catch (error) {
      console.error('Error fetching country by name:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Fetch a single country by code (cca3)
   */
  async getCountryByCode(code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/alpha/${code}?fields=name,flags,capital,population,region,cca3`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Country not found',
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const country = await response.json();
      
      const transformedCountry: Country = {
        name: {
          common: country.name?.common || 'Unknown',
          official: country.name?.official || 'Unknown',
        },
        flags: {
          png: country.flags?.png || '',
          svg: country.flags?.svg || '',
        },
        capital: country.capital || [],
        population: country.population || 0,
        region: country.region || 'Unknown',
        cca3: country.cca3 || '',
      };

      return {
        success: true,
        data: [transformedCountry],
      };
    } catch (error) {
      console.error('Error fetching country by code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
export const countriesApi = new CountriesApiService();