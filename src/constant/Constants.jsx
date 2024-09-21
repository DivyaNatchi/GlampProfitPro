// src/constants/constants.js
import { db } from "../db/db"; // Import your IndexedDB database instance

// Category options constant
export const categoryOptions = [
  { id: 1, name: "Daily", description: "Occurs every day" },
  { id: 2, name: "Weekly", description: "Occurs every week" },
  { id: 3, name: "Bi-Weekly", description: "Occurs once every two weeks" },
  { id: 4, name: "Semi-Monthly", description: "Occurs twice a month" },
  { id: 5, name: "Monthly", description: "Occurs once a month" },
  { id: 6, name: "Bi-Monthly", description: "Occurs once every two months" },
  { id: 7, name: "Quarterly", description: "Occurs once every three months" },
  { id: 8, name: "Tri-Annual", description: "Occurs three times a year" },
  { id: 9, name: "Bi-Annual", description: "Occurs twice a year" },
  { id: 10, name: "Yearly", description: "Occurs once a year" },
  { id: 11, name: "Biennial", description: "Occurs once every two years" },
];

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Async function to calculate missing category constants
export const getMissingCategoryConstants = async () => {
  // Step 1: Get all category constants from IndexedDB
  const categoryConstants = await db.category_constants.toArray();
  const existingCategoryIds = categoryConstants.map((c) => c.categoryId);

  // Step 2: Filter the categoryOptions to find those not in the category_constants table
  const missingCategoryConstant = categoryOptions.filter(
    (option) => !existingCategoryIds.includes(option.id)
  );

  return missingCategoryConstant;
};

export const wigwamLogo =
  "data:image/jpeg;base64,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";
