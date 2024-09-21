import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
} from "reactstrap";
import { useLoaderData } from "react-router-dom";
import { db } from "../db/db";
import "../styles/form.css";
import "../styles/table.css";
import ExcelJS from "exceljs";
import FileSaver from "file-saver"; // To save files in browser
import { FaFileDownload, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  categoryOptions,
  getMissingCategoryConstants,
} from "../constant/Constants";

// Loader function to fetch expenses from IndexedDB expenses table
export const expenseLoader = async () => {
  const expenses = await db.expenses.toArray();
  const categoryConstants = await db.category_constants.toArray();
  return { expenses, categoryConstants };
};
const categories = [...categoryOptions];
categories.push({
  id: 12,
  name: "Per Booking",
  description: "Applicable for every booking",
});

export default function ExpenseManagement() {
  const { expenses: initialExpenses, categoryConstants } = useLoaderData();
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [newExpense, setNewExpense] = useState({
    expense_head: "",
    amount: "",
    categoryId: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false); // New state to track edit mode
  const [editExpenseId, setEditExpenseId] = useState(null); // Store the id of the expense being edited
  const [errors, setErrors] = useState({});
  const [missingCategories, setMissingCategories] = useState([]);

  useEffect(() => {
    // Fetch missing categories on component mount
    const fetchMissingCategories = async () => {
      const missingCategoriesData = await getMissingCategoryConstants();
      setMissingCategories(missingCategoriesData);
    };

    fetchMissingCategories();
  }, []);

  // Field-level validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "expense_head":
        if (!value.trim()) {
          error = "Please enter an expense head.";
        }
        break;
      case "amount":
        if (!validateAmount(value)) {
          error = "Please enter a valid amount.";
        } else if (value.length > 7) {
          error =
            "Amount should not exceed 7 digits, please enter a valid amount.";
        }
        break;
      case "categoryId":
        if (!value) {
          error = "Please select a category.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return error === ""; // Return whether the field is valid or not
  };

  // Handle field change and field-level validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Set the new value in state
    setNewExpense({ ...newExpense, [name]: value });

    // Validate the field
    validateField(name, value);
  };

  const validateAmount = (amount) => {
    return !isNaN(amount) && Number(amount) > 0;
  };

  // Full form validation function
  const validateForm = () => {
    let formIsValid = true;

    formIsValid &= validateField("expense_head", newExpense.expense_head);
    formIsValid &= validateField("amount", newExpense.amount);
    formIsValid &= validateField("categoryId", newExpense.categoryId);

    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newExpenseEntry = {
        ...newExpense,
        amount: Number(newExpense.amount),
        last_updated: new Date().toLocaleDateString(),
      };

      if (editMode) {
        // Update the existing expense in IndexedDB
        await db.expenses.update(editExpenseId, newExpenseEntry);
        toast.success(
          `"${newExpenseEntry.expense_head}" expense updated successfully!`,
          { position: "top-center" }
        );
        setEditMode(false);
        setEditExpenseId(null);
      } else {
        // Save the new expense to IndexedDB
        await db.expenses.add(newExpenseEntry);
        toast.success(
          `"${newExpenseEntry.expense_head}" expense added successfully!`,
          {
            position: "top-center",
          }
        );
      }

      // Fetch updated expenses from IndexedDB and update the state
      const updatedExpenses = await db.expenses.toArray();
      setExpenses(updatedExpenses);

      // Reset form fields
      setNewExpense({
        expense_head: "",
        amount: "",
        categoryId: "",
        description: "",
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    setNewExpense({
      expense_head: "",
      amount: "",
      categoryId: "",
      description: "",
    });
    setEditMode(false); // Set edit mode
    setErrors({});
  };

  const handleEdit = (expense) => {
    setNewExpense({
      expense_head: expense.expense_head,
      amount: expense.amount,
      categoryId: expense.categoryId,
      description: expense.description,
    });
    setEditMode(true); // Set edit mode
    setEditExpenseId(expense.id); // Store the id of the expense being edited
  };

  const handleDelete = async (expense) => {
    const confirmDelete = new Promise((resolve, reject) => {
      // Custom confirmation toast with buttons
      const toastId = toast.info(
        <div>
          <p>
            Are you sure you want to delete {expense.expense_head} expenses?
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
        await db.expenses.delete(expense.id);

        // Fetch updated expenses from IndexedDB and update the state
        const updatedExpenses = await db.expenses.toArray();
        toast.success("Expense deleted successfully!", {
          position: "top-center",
        });
        setExpenses(updatedExpenses);
      }
    } catch (error) {
      console.log("Delete cancelled for the expense");
    }
  };

  // Function to generate and download Excel file
  const handleDownloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ExpenseList");
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD
    const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, ""); // Get hhmmss
    const fileName = `ExpenseList${formattedDate}-${formattedTime}.xlsx`;

    // Remove gridlines
    worksheet.views = [{ showGridLines: false }];

    // Define column widths and headers
    const colWidths = [
      { header: "Expense Head", width: 32 },
      { header: "Amount", width: 15 },
      { header: "Category", width: 20 },
      { header: "Monthly Amount", width: 22 },
    ];

    worksheet.columns = colWidths;

    // Increase header row height
    worksheet.getRow(1).height = 25; // Set header row height

    // Merge cells in the first row for the header
    worksheet.mergeCells("A1:D1");

    // Set value for the merged cell
    const headerCell = worksheet.getCell("A1");
    headerCell.value = "Monthly Expenses";
    headerCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Apply styles to the merged cell
    headerCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00BF8F" }, // Background color
    };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

    // Add headers in the second row
    worksheet.addRow(["Expense Head", "Amount", "Category", "Monthly Amount"]);

    // Apply styles to the header row
    worksheet.getRow(2).eachCell((cell) => {
      cell.font = { bold: true, size: 14, color: { argb: "FF00BF8F" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" }, // Header background color
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };

      // Apply cell borders
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows
    const data = expenses.map((expense) => {
      const categoryConstant = categoryConstants.find(
        (categoryConstant) =>
          categoryConstant.categoryId === Number(expense.categoryId)
      );
      const categoryName =
        categories.find((cat) => cat.id === Number(expense.categoryId))?.name ||
        "N/A";
      const conversionConstant = categoryConstant?.monthly_conversion_constant;

      const monthlyAmount =
        conversionConstant && expense.amount
          ? parseFloat((conversionConstant * expense.amount).toFixed(2))
          : "N/A";

      return [
        expense.expense_head,
        parseFloat(expense.amount).toFixed(2), // Format Amount to 2 decimal places
        categoryName,
        monthlyAmount !== "N/A" ? monthlyAmount.toFixed(2) : "N/A", // Format Monthly Amount
      ];
    });

    // Append the data rows to the worksheet
    data.forEach((row) => {
      const addedRow = worksheet.addRow(row);

      // Apply left alignment for Amount and Monthly Amount
      addedRow.getCell(2).alignment = {
        horizontal: "right",
        vertical: "middle",
      }; // Amount column
      addedRow.getCell(4).alignment = {
        horizontal: "right",
        vertical: "middle",
      }; // Monthly Amount column

      // Apply cell borders for each data row
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generate the Excel file and trigger download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, fileName);
    });
  };

  return (
    <>
      <Container className="form-container">
        <Form onSubmit={handleSubmit} aria-label="Expense Management Form">
          <fieldset className="my-fieldset">
            <legend className="legend">Expense Management</legend>
            {/* Expense Head text field*/}
            <FormGroup>
              <Label for="expense_head">Expense Head</Label>
              <Input
                type="text"
                name="expense_head"
                id="expense_head"
                value={newExpense.expense_head}
                onChange={handleChange}
                invalid={!!errors.expense_head}
                aria-label="Expense Head"
              ></Input>
              <FormText>Enter the title or name for the expense.</FormText>
              <FormFeedback>{errors.expense_head}</FormFeedback>
            </FormGroup>

            {/* Amount Text field with number validation */}
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input
                type="text"
                name="amount"
                id="amount"
                value={newExpense.amount}
                onChange={handleChange}
                invalid={!!errors.amount}
                aria-label="Amount"
              ></Input>
              <FormText>Specify the amount for the expense.</FormText>
              <FormFeedback>{errors.amount}</FormFeedback>
            </FormGroup>

            {/* Expense Category Dropdown */}
            <FormGroup>
              <Label for="categoryId">Category</Label>
              <Input
                type="select"
                name="categoryId"
                id="categoryId"
                value={newExpense.categoryId}
                onChange={handleChange}
                invalid={!!errors.categoryId}
                aria-label="Category"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.description}
                  </option>
                ))}
              </Input>
              <FormText>
                Select the frequency of the expense from the dropdown.
              </FormText>
              <FormFeedback>{errors.categoryId}</FormFeedback>
            </FormGroup>

            {/* Expense category description text field */}
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={newExpense.description}
                onChange={handleChange}
                aria-label="Description"
              ></Input>
              <FormText>
                Provide a detailed description of the expense, including the
                purpose and any additional relevant information.
              </FormText>
            </FormGroup>

            {/* Add expense and Cancel Buttons */}
            <FormGroup className="text-center">
              <Button
                type="submit"
                aria-label="Add Expense"
                className="custom-button"
              >
                Save Expense
              </Button>
              <Button
                type="button"
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
                ? "Please contact the Franchisor, the following monthly conversion constant is not available:"
                : "Please contact the Franchisor, the following monthly conversion constants are not available:"}
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
      {/* Render the table only if there are expenses */}
      {expenses.length > 0 && (
        <Container>
          <Table hover responsive aria-label="Expense Table">
            <thead>
              <tr>
                <th colSpan="5" className="text-center table-header">
                  Monthly Expenses
                  <FaFileDownload
                    size={20}
                    onClick={handleDownloadExcel}
                    aria-label="Download expenses Excel"
                    style={{ marginLeft: "10px" }}
                  />
                </th>
              </tr>
              <tr>
                <th>Expense Head</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Monthly Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.expense_head}</td>
                  <td>{expense.amount.toFixed(2)}</td>
                  <td>
                    {
                      categories.find(
                        (cat) => cat.id === Number(expense.categoryId)
                      )?.name
                    }
                  </td>
                  <td>
                    {categoryConstants.find(
                      (categoryConstant) =>
                        categoryConstant.categoryId ===
                        Number(expense.categoryId)
                    )
                      ? (
                          categoryConstants.find(
                            (categoryConstant) =>
                              categoryConstant.categoryId ===
                              Number(expense.categoryId)
                          ).monthly_conversion_constant * expense.amount
                        ).toFixed(2)
                      : "N/A"}
                  </td>
                  <td>
                    <FaEdit
                      style={{
                        cursor: "pointer",
                        marginRight: "20px",
                      }}
                      onClick={() => handleEdit(expense)}
                      aria-label="Edit Expense"
                    />
                    <FaTrash
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleDelete(expense)}
                      aria-label="Delete Expense"
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
