/**
 * Computes the full name from firstName and lastName
 * This is a pure function that should NOT be persisted
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns {string} Full name
 */
export const computeFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};

/**
 * Computes the number of days since registration
 * This is a dynamic value that changes based on current date
 * @param {string} registeredDate - ISO date string (YYYY-MM-DD)
 * @returns {number} Days since registration
 */
export const computeDaysSinceRegistration = (registeredDate) => {
  if (!registeredDate) return 0;
  
  const registered = new Date(registeredDate);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  registered.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - registered;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Enriches raw data with computed fields
 * This demonstrates separating persisted data from computed values
 * @param {Array} rawData - Array of raw user records
 * @returns {Array} Array with computed fields added
 */
export const enrichDataWithComputedFields = (rawData) => {
  return rawData.map(row => ({
    ...row,
    // Computed fields are added here, not stored
    fullName: computeFullName(row.firstName, row.lastName),
    dsr: computeDaysSinceRegistration(row.registeredDate)
  }));
};

