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
  Table,
} from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { db } from "../db/db";
import "../styles/form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Loader function to fetch categories from IndexedDB category constant table
export async function expenseCategoryLoader() {
  const categoriesFromDB = await db.category_constants.toArray();
  return categoriesFromDB;
}

export default function ExpenseCategoryManagement() {
  // Use data fetched by the loader
  const initialConstants = useLoaderData();

  // State for the constants, form inputs, and errors
  const [constants, setConstants] = useState(initialConstants || []);
  const [newConstant, setNewConstant] = useState({
    name: "",
    categoryId: "",
    monthlyConversionConstant: "",
  });
  const [editingId, setEditingId] = useState(null);
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

  // Validate monthly constant to ensure it's a number
  const validateMonthlyConstant = (value) => {
    return !isNaN(value) && (parseFloat(value) || parseFloat(value) === 0);
  };

  // Handle saving/updating the category with the monthly constant
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { categoryId, monthlyConversionConstant } = newConstant;

    if (!categoryId || !monthlyConversionConstant) {
      setErrors("Please select a category and enter a monthly constant.");
      return;
    }

    if (!validateMonthlyConstant(monthlyConversionConstant)) {
      setErrors("Please enter a valid number for the monthly constant.");
      return;
    }

    setErrors(""); // Clear previous errors

    const selectedCategory = categoryOptions.find(
      (c) => c.id === Number(categoryId)
    );

    if (editingId) {
      // Update existing constant
      await db.category_constants.update(editingId, {
        monthly_conversion_constant: parseFloat(monthlyConversionConstant),
        last_updated: new Date().toISOString().split("T")[0],
      });

      toast.success(
        `Category "${selectedCategory.name}" updated successfully!`,
        {
          position: "top-center",
        }
      );
    } else {
      // Check if the category already exists based on categoryId
      const existingCategory = await db.category_constants
        .where("categoryId")
        .equals(selectedCategory.id)
        .first();

      if (existingCategory) {
        // Update the existing category if found
        await db.category_constants.update(existingCategory.id, {
          monthly_conversion_constant: parseFloat(monthlyConversionConstant),
          last_updated: new Date().toISOString().split("T")[0],
        });
        toast.success(
          `Category "${selectedCategory.name}" updated successfully!`,
          {
            position: "top-center",
          }
        );
      } else {
        // Add new constant if no existing category is found
        const newCategory = {
          categoryId: selectedCategory.id,
          name: selectedCategory.name,
          description: selectedCategory.description,
          monthly_conversion_constant: parseFloat(monthlyConversionConstant),
          last_updated: new Date().toISOString().split("T")[0],
        };

        await db.category_constants.put(newCategory);
        toast.success(
          `Category "${selectedCategory.name}" added successfully!`,
          {
            position: "top-center",
          }
        );
      }
    }

    // Reload constants after save or update
    const updatedConstants = await db.category_constants.toArray();
    setConstants(updatedConstants);

    // Clear the form after saving
    setNewConstant({ name: "", categoryId: "", monthlyConversionConstant: "" });
    setEditingId(null);
  };

  // Handle editing a category constant
  const handleEdit = (categoryConstant) => {
    setNewConstant({
      categoryId: categoryConstant.categoryId,
      monthlyConversionConstant: categoryConstant.monthly_conversion_constant,
    });
    setEditingId(categoryConstant.id);
  };

  // Handle deleting a category constant
  const handleDelete = async (categoryId) => {
    const confirmDelete = new Promise((resolve, reject) => {
      // Custom confirmation toast with buttons
      const toastId = toast.info(
        <div>
          <p>Are you sure you want to delete this category?</p>
          <button
            className="custom-button"
            onClick={() => {
              toast.dismiss(toastId); // Close the toast when "Confirm" is clicked
              resolve(true);
            }}
          >
            Confirm
          </button>
          <button
            className="custom-button"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              toast.dismiss(toastId); // Close the toast when "Cancel" is clicked
              reject(false);
            }}
          >
            Cancel
          </button>
        </div>,
        { position: "top-center", autoClose: false, closeOnClick: false }
      );
    });
    try {
      const isConfirmed = await confirmDelete;
      if (isConfirmed) {
        await db.category_constants.delete(categoryId);
        toast.success("Category deleted successfully!", {
          position: "top-center",
        });

        const updatedConstants = await db.category_constants.toArray();
        setConstants(updatedConstants); // Update state with remaining constants
      }
    } catch {
      console.log("Delete cancelled");
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setNewConstant({ name: "", categoryId: "", monthlyConversionConstant: "" });
    setErrors(""); // Clear errors on cancel
    setEditingId(null); // Clear editing mode
  };

  return (
    <>
      <Container className="form-container">
        <Form
          onSubmit={handleSubmit}
          aria-live="polite"
          aria-label="Expense Category Management"
        >
          <fieldset className="my-fieldset">
            <legend className="legend">Expense Category Management</legend>

            {/* Category Dropdown */}
            <FormGroup>
              <Label for="categorySelect">Select Category</Label>
              <Input
                type="select"
                name="categorySelect"
                id="categorySelect"
                value={newConstant.categoryId}
                aria-label="Select Category"
                aria-required="true"
                onChange={(e) =>
                  setNewConstant({
                    ...newConstant,
                    categoryId: e.target.value,
                  })
                }
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
                value={newConstant.monthlyConversionConstant}
                aria-label="Monthly Conversion Constant"
                aria-required="true"
                onChange={(e) =>
                  setNewConstant({
                    ...newConstant,
                    monthlyConversionConstant: e.target.value,
                  })
                }
                invalid={!!errors}
              />
              {errors && <FormFeedback>{errors}</FormFeedback>}
            </FormGroup>

            {/* Save and Cancel Buttons */}
            <FormGroup className="text-center">
              <Button
                type="submit"
                aria-label="Save Category"
                className="custom-button"
              >
                {editingId ? "Update" : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                aria-label="Cancel"
                className="custom-button"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </FormGroup>
          </fieldset>
        </Form>
      </Container>

      {/* Render the table only if there are constants */}
      {constants.length > 0 && (
        <Container>
          <Table
            hover
            responsive
            aria-label="Monthly Conversion Constant Table"
          >
            <thead>
              <tr>
                <th colSpan="5" className="text-center monthly-expense-header">
                  Monthly Conversion Constant
                </th>
              </tr>
              <tr>
                <th>Category</th>
                <th>Monthly Conversion Constant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {constants.map((constant) => (
                <tr key={constant.id}>
                  <td>{constant.name}</td>
                  <td>{constant.monthly_conversion_constant}</td>
                  <td>
                    <FaEdit
                      style={{
                        cursor: "pointer",
                        marginRight: "20px",
                      }}
                      onClick={() => handleEdit(constant)}
                      aria-label="Edit Monthly Conversion Constant"
                    />
                    <FaTrash
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleDelete(constant.id)}
                      aria-label="Delete Monthly Conversion Constant"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}
