import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
} from "reactstrap";
import { db } from "../db/db";

// Loader function to fetch categories from IndexedDB category constant table
export async function expenseCategoryLoader() {
  const categoriesFromDB = await db.category_constants.toArray();
  return categoriesFromDB;
}

export default function ExpenseCategoryManagement() {
  // Use data fetched by the loader
  const data = useLoaderData();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [monthlyConstant, setMonthlyConstant] = useState("");
  const [errors, setErrors] = useState("");

  // Predefined category options (name + description)
  const categoryOptions = [
    { id: 1, name: "Daily", description: "Occurs every day" },
    { id: 2, name: "Weekly", description: "Occurs every week" },
    { id: 3, name: "Bi-Weekly", description: "Occurs once every two weeks" },
    {
      id: 4,
      name: "Semi-Monthly",
      description: "Occurs twice a month (e.g., 1st and 15th)",
    },
    { id: 5, name: "Monthly", description: "Occurs once a month" },
    { id: 6, name: "Bi-Monthly", description: "Occurs once every two months" },
    { id: 7, name: "Quarterly", description: "Occurs once every three months" },
    { id: 8, name: "Tri-Annual", description: "Occurs three times a year" },
    { id: 9, name: "Bi-Annual", description: "Occurs twice a year" },
    { id: 10, name: "Yearly", description: "Occurs once a year" },
    { id: 11, name: "Biennial", description: "Occurs once every two years" },
  ];

  // Validate monthly constant. it should be integer or float value
  const validateMonthlyConstant = (value) => {
    return !isNaN(value) && (parseFloat(value) || parseFloat(value) === 0);
  };

  // Handle saving the selected category with monthly constant
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !monthlyConstant) {
      setErrors("Please select a category and enter a monthly constant.");
      return;
    }

    if (!validateMonthlyConstant(monthlyConstant)) {
      setErrors("Please enter a valid number for the monthly constant.");
      return;
    }

    setErrors(""); // Clear previous errors

    // Find the selected category based on the selectedCategory ID
    const category = categoryOptions.find(
      (c) => c.id === Number(selectedCategory)
    );

    // Check if the category already exists in IndexedDB based on categoryId
    const existingCategory = await db.category_constants
      .where("categoryId")
      .equals(category.id) // Using categoryId for lookup
      .first();

    if (existingCategory) {
      // If the category exists, update the monthly_conversion_constant using categoryId
      await db.category_constants.update(existingCategory.categoryId, {
        monthly_conversion_constant: parseFloat(monthlyConstant), // Update constant
        last_updated: new Date().toISOString().split("T")[0], // Update the last_updated field
      });

      alert(`Category "${category.name}" updated successfully!`);
    } else {
      // If the category does not exist, create a new entry with categoryId as the primary key
      await db.category_constants.put({
        categoryId: category.id, // Use categoryId as the primary key
        name: category.name,
        description: category.description,
        monthly_conversion_constant: parseFloat(monthlyConstant), // Save new constant
        last_updated: new Date().toISOString().split("T")[0], // Store the date when it was last updated
      });

      alert(`Category "${category.name}" added successfully!`);
    }

    // Clear the form after saving
    setSelectedCategory("");
    setMonthlyConstant("");
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedCategory("");
    setMonthlyConstant("");
    setErrors(""); // Clear errors on cancel
  };

  return (
    <Container aria-labelledby="expense-category-management">
      <h2 id="expense-category-management">Manage Expense Categories</h2>
      <Form
        onSubmit={handleSubmit}
        aria-live="polite"
        aria-describedby="form-description"
      >
        <p id="form-description">
          Please select a category and enter the monthly conversion constant.
        </p>

        {/* Category Dropdown */}
        <FormGroup>
          <Label for="categorySelect">Select Category</Label>
          <Input
            type="select"
            name="categorySelect"
            id="categorySelect"
            value={selectedCategory}
            aria-label="Select Category"
            aria-required="true"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} - {category.description}
              </option>
            ))}
          </Input>
        </FormGroup>

        {/* Monthly Conversion Constant */}
        <FormGroup>
          <Label for="monthlyConstant">Monthly Conversion Constant</Label>
          <Input
            type="text"
            name="monthlyConstant"
            id="monthlyConstant"
            placeholder="Enter Monthly Conversion Constant"
            value={monthlyConstant}
            aria-label="Monthly Conversion Constant"
            aria-required="true"
            onChange={(e) => setMonthlyConstant(e.target.value)}
            invalid={!!errors}
          />
          {errors && <FormFeedback>{errors}</FormFeedback>}
        </FormGroup>

        {/* Save and Cancel Buttons */}
        <FormGroup>
          <Button type="submit" color="primary" aria-label="Save Category">
            Save
          </Button>{" "}
          <Button color="secondary" onClick={handleCancel} aria-label="Cancel">
            Cancel
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
}
