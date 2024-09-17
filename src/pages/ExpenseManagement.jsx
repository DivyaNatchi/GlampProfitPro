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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useLoaderData } from "react-router-dom";
import { db } from "../db/db";
import "../styles/form.css";
import "../styles/table.css";
import * as XLSX from "node-xlsx"; // Import node-xlsx for Excel operations
import FileSaver from "file-saver"; // To save files in browser
import { FaFileDownload } from "react-icons/fa";

// Loader function to fetch expenses from IndexedDB expenses table
export const expenseLoader = async () => {
  const expenses = await db.expenses.toArray();
  const categoryConstants = await db.category_constants.toArray();
  return { expenses, categoryConstants };
};

const categories = [
  { id: 1, name: "Daily" },
  { id: 2, name: "Weekly" },
  { id: 3, name: "Bi-Weekly" },
  { id: 4, name: "Semi-Monthly" },
  { id: 5, name: "Monthly" },
  { id: 6, name: "Bi-Monthly" },
  { id: 7, name: "Quarterly" },
  { id: 8, name: "Tri-Annual" },
  { id: 9, name: "Bi-Annual" },
  { id: 10, name: "Yearly" },
  { id: 11, name: "Biennial" },
  { id: 12, name: "Per Booking" },
];

export default function ExpenseManagement() {
  const { expenses: initialExpenses, categoryConstants } = useLoaderData();
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [newExpense, setNewExpense] = useState({
    expense_head: "",
    amount: "",
    categoryId: "",
    description: "",
  });
  const [data, SetData] = useState([]);
  const [errors, setErrors] = useState({});
  // Modal state to show when a category constant is missing
  const [modal, setModal] = useState(false);
  const [missingCategories, setMissingCategories] = useState([]);

  useEffect(() => {
    checkForMissingCategoryConstants(expenses); // Perform the check on component mount
    prepareDate(expenses);
  }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const validateAmount = (amount) => {
    return !isNaN(amount) && Number(amount) > 0;
  };

  const validateForm = () => {
    let formIsValid = true;
    let validationErrors = {};

    if (!newExpense.expense_head.trim()) {
      formIsValid = false;
      validationErrors.expense_head = "Please enter an expense head.";
    }

    if (!validateAmount(newExpense.amount)) {
      formIsValid = false;
      validationErrors.amount = "Please enter a valid amount.";
    }

    if (!newExpense.categoryId) {
      formIsValid = false;
      validationErrors.categoryId = "Please select a category.";
    }

    setErrors(validationErrors);
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

      // Save the new expense to IndexedDB
      await db.expenses.add(newExpenseEntry);

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
    setErrors({});
  };

  // Prepare date to export in excel and display in table
  const prepareDate = (expenses) => {
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
        expense.amount,
        categoryName,
        monthlyAmount,
      ];
    });
    SetData(data);
  };

  // Check for all missing category constants and trigger the modal
  const checkForMissingCategoryConstants = (expenses) => {
    const missingCategoryList = new Set();

    expenses.forEach((expense) => {
      if (Number(expense.categoryId != 12)) {
        const categoryConstant = categoryConstants.find(
          (cat) => cat.categoryId === Number(expense.categoryId)
        );

        // If the category constant is missing, add to the missingCategoryList
        if (!categoryConstant) {
          const missingCategoryName = categories.find(
            (cat) => cat.id === Number(expense.categoryId)
          )?.name;
          if (missingCategoryName) {
            missingCategoryList.add(missingCategoryName);
          }
        }
      }
    });

    // If there are missing categories, set the modal to open
    if (missingCategoryList.size > 0) {
      setMissingCategories(missingCategoryList);
      setModal(true); // Open the modal
    }
  };

  // Generate and download the .xlsx file
  const handleDownloadExcel = () => {
    const header = ["Expense Head", "Amount", "Category", "Monthly Amount"];
    const worksheetData = [header, ...data]; // Combine header with data rows
    const worksheet = XLSX.build([{ name: "Expenses", data: worksheetData }]);

    // Create a Blob and trigger download using FileSaver
    const blob = new Blob([worksheet], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, "Expenses.xlsx");
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
                    {category.name}
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
            <FormGroup className="text-center form-btn">
              <Button type="submit" color="primary" aria-label="Add Expense">
                Add Expense
              </Button>
              <Button
                type="button"
                color="secondary"
                onClick={handleCancel}
                aria-label="Cancel"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </FormGroup>
          </fieldset>
        </Form>
      </Container>
      {/* Render the table only if there are expenses */}
      {expenses.length > 0 && (
        <Container>
          <Table hover responsive aria-label="Expense Table">
            <thead>
              <tr>
                <th colSpan="4" className="text-center monthly-expense-header">
                  Monthly Expenses
                  {/* Download icon */}
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
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index + 1}>
                  {row.map((element) => (
                    <td>{element || "N/A"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      )}

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          Missing Category Constants
        </ModalHeader>
        <ModalBody>
          <p>
            The following category constants are not available for monthly
            conversion:
          </p>
          <ul>
            {[...missingCategories].map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
          <p>Please contact the franchisor.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setModal(false)}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
