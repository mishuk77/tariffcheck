import countriesData from './countries.json';
import categoriesData from './categories.json';
import { Country, Category, CountriesData, CategoriesData } from '../types';

const typedCountriesData = countriesData as CountriesData;
const typedCategoriesData = categoriesData as CategoriesData;

export const countries: Country[] = typedCountriesData.countries;
export const categories: Category[] = typedCategoriesData.categories;
export const lastUpdated: string = typedCountriesData.last_updated;
