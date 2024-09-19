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
