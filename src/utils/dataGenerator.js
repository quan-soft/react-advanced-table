import { faker } from '@faker-js/faker';

/**
 * Generates a single user record with all required fields
 * @returns {Object} User record
 */
export const generateUser = () => {
  // Generate a random date within the last 3 years
  const registeredDate = faker.date.between({
    from: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    city: faker.location.city(),
    registeredDate: registeredDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
  };
};

/**
 * Generates multiple user records
 * @param {number} count - Number of records to generate
 * @returns {Array} Array of user records
 */
export const generateUsers = (count = 500) => {
  return Array.from({ length: count }, generateUser);
};

/**
 * Loads data from localStorage or generates new data if none exists
 * @param {number} count - Number of records to generate if none exist
 * @returns {Array} Array of user records
 */
export const loadOrGenerateData = (count = 500) => {
  const STORAGE_KEY = 'tableData';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} records from localStorage`);
        return data;
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  // Generate new data if none exists
  console.log(`Generating ${count} new records...`);
  const data = generateUsers(count);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Data saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  return data;
};

/**
 * Clears stored data from localStorage
 */
export const clearStoredData = () => {
  localStorage.removeItem('tableData');
  console.log('Stored data cleared');
};

