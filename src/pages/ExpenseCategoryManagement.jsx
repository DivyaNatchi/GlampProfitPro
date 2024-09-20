import React, { useState, useEffect } from "react";
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
import {
  categoryOptions,
  getMissingCategoryConstants,
} from "../constant/Constants";

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
    categoryId: "",
    monthlyConversionConstant: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({
    categoryId: "",
    monthlyConversionConstant: "",
  });
  const [missingCategories, setMissingCategories] = useState([]);

  useEffect(() => {
    // Fetch missing categories on component mount
    const fetchMissingCategories = async () => {
      const missingCategoriesData = await getMissingCategoryConstants();
      setMissingCategories(missingCategoriesData);
    };

    fetchMissingCategories();
  }, [constants]);

  // Validate if the input is a valid number or zero
  const validateMonthlyConstant = (value) => {
    return !isNaN(value) && (parseFloat(value) || parseFloat(value) === 0);
  };

  // Centralized validation logic for each field
  const validateField = (field, value) => {
    let error = "";

    if (field === "categoryId") {
      if (!value) {
        error = "Please select a category.";
      }
    } else if (field === "monthlyConversionConstant") {
      if (!value) {
        error = "Please enter a monthly constant.";
      } else if (value.length > 5) {
        error = "Monthly constant should not exceed 5 characters.";
      } else if (!validateMonthlyConstant(value)) {
        error = "Please enter a valid number.";
      }
    }

    return error;
  };

  // Form validation
  const validateForm = () => {
    const formErrors = {};

    // Validate categoryId
    formErrors.categoryId = validateField("categoryId", newConstant.categoryId);

    // Validate monthlyConversionConstant
    formErrors.monthlyConversionConstant = validateField(
      "monthlyConversionConstant",
      newConstant.monthlyConversionConstant
    );

    // Filter out empty errors
    const hasErrors = Object.values(formErrors).some((error) => error);

    setErrors(formErrors);
    return !hasErrors;
  };

  // Handle field validation on input change
  const handleFieldValidation = (field, value) => {
    const error = validateField(field, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Example of how this can be used for onChange and onSubmit

  // Field-level validation on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConstant({
      ...newConstant,
      [name]: value,
    });
    handleFieldValidation(name, value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { categoryId, monthlyConversionConstant } = newConstant;
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
        `Category "${selectedCategory.name}" monthly convertion constant updated successfully!`,
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
        `Category "${selectedCategory.name}" monthly convertion constant added successfully!`,
        {
          position: "top-center",
        }
      );
    }

    // Reload constants after save or update
    const updatedConstants = await db.category_constants.toArray();
    setConstants(updatedConstants);

    // Clear the form after saving
    setNewConstant({ categoryId: "", monthlyConversionConstant: "" });
    setEditingId(null);
  };

  // Handle editing a category constant
  const handleEdit = (categoryConstant) => {
    console.log("inside edit: ", categoryConstant);
    setNewConstant({
      categoryId: categoryConstant.categoryId,
      monthlyConversionConstant: categoryConstant.monthly_conversion_constant,
    });
    setEditingId(categoryConstant.id);
  };

  // Handle deleting a category constant
  const handleDelete = async (categoryConstant) => {
    const confirmDelete = new Promise((resolve, reject) => {
      // Custom confirmation toast with buttons
      const toastId = toast.info(
        <div>
          <p>
            Are you sure you want to delete {categoryConstant.name} monthly
            conversion constant?
          </p>
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
        // Remove the expense from IndexedDB
        await db.category_constants.delete(categoryConstant.id);
        toast.success(
          `Category "${categoryConstant.name}" monthly convertion constant deleted successfully!`,
          {
            position: "top-center",
          }
        );

        const updatedConstants = await db.category_constants.toArray();
        setConstants(updatedConstants);
      }
    } catch (error) {
      console.log("Delete cancelled for Monthly conversion constant");
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setNewConstant({ categoryId: "", monthlyConversionConstant: "" });
    setErrors({}); // Clear errors on cancel
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
              <Label for="categoryId">Select Category</Label>
              <Input
                type="select"
                name="categoryId"
                id="categoryId"
                value={newConstant.categoryId}
                aria-label="Select Category"
                aria-required="true"
                onChange={handleChange}
                invalid={!!errors.categoryId}
              >
                <option value="">Select a Category</option>

                {/* When editing, include the selected category even if it's not in missingCategories */}
                {editingId && (
                  <option
                    key={newConstant.categoryId}
                    value={newConstant.categoryId}
                  >
                    {/* Find the name and description for the selected category */}
                    {
                      constants.find(
                        (c) => c.categoryId === newConstant.categoryId
                      )?.name
                    }{" "}
                    -{" "}
                    {
                      constants.find(
                        (c) => c.categoryId === newConstant.categoryId
                      )?.description
                    }
                  </option>
                )}

                {/* Render the missing categories */}
                {missingCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.description}
                  </option>
                ))}
              </Input>
              {errors.categoryId && (
                <FormFeedback>{errors.categoryId}</FormFeedback>
              )}
            </FormGroup>

            {/* Monthly Conversion Constant */}
            <FormGroup>
              <Label for="monthlyConversionConstant">
                Monthly Conversion Constant
              </Label>
              <Input
                type="text"
                name="monthlyConversionConstant"
                id="monthlyConversionConstant"
                value={newConstant.monthlyConversionConstant}
                aria-label="Monthly Conversion Constant"
                aria-required="true"
                onChange={handleChange}
                invalid={!!errors.monthlyConversionConstant}
              />
              {errors.monthlyConversionConstant && (
                <FormFeedback>{errors.monthlyConversionConstant}</FormFeedback>
              )}
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
        {missingCategories.length > 0 && (
          <div className="missingCategory">
            <h5>
              {missingCategories.length === 1
                ? "Please Provide the Monthly Conversion Constant for the Following Category:"
                : "Please Provide the Monthly Conversion Constants for the Following Categories:"}
            </h5>
            <ul className="missing-categories-list">
              {missingCategories.map((missingCategory) => (
                <li key={missingCategory.id} className="missing-category-item">
                  {missingCategory.name}
                </li>
              ))}
            </ul>
          </div>
        )}
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
                <th colSpan="5" className="text-center table-header">
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
                      onClick={() => handleDelete(constant)}
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
