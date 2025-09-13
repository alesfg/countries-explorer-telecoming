export interface Country {
    name: {
      common: string;
      official: string;
    };
    flags: {
      png: string;
      svg?: string;
    };
    capital?: string[];
    population: number;
    region: string;
    cca3: string; // Código único de 3 letras
  }
  
  export interface CountrySearchResponse {
    countries: Country[];
    total: number;
  }