import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
} from "reactstrap";
import { useLoaderData } from "react-router-dom";
import { db } from "../db/db";

// Loader function to fetch expenses from IndexedDB expenses table
export const expenseLoader = async () => {
  const expenses = await db.expenses.toArray();
  return { expenses };
};

//Define the expense categroy dropdown
const categories = [
  { id: 1, name: "Daily", multiplier: 30.44 }, // 30 days in a month
  { id: 2, name: "Weekly", multiplier: 4.345 }, // Approx 4.33 weeks in a month
  { id: 3, name: "Bi-Weekly", multiplier: 2.17 }, // Approx 2.17 bi-weekly periods in a month
  { id: 4, name: "Semi-Monthly", multiplier: 2 }, // 2 periods in a month
  { id: 5, name: "Monthly", multiplier: 1 }, // Already monthly
  { id: 6, name: "Bi-Monthly", multiplier: 0.5 }, // Half of the expense per month
  { id: 7, name: "Quarterly", multiplier: 0.33 }, // One-third of the expense per month
  { id: 8, name: "Tri-Annual", multiplier: 0.25 }, // Approx one-ninth of the expense per month
  { id: 9, name: "Bi-Annual", multiplier: 0.17 }, // One-sixth of the expense per month
  { id: 10, name: "Yearly", multiplier: 0.083 }, // One-twelfth of the expense per month
  { id: 11, name: "Biennial", multiplier: 0.042 }, // One-twenty-fourth per month
  { id: 12, name: "Per Booking", multiplier: 1 }, // Not regular
];

export default function ExpenseManagement() {
  const { expenses: initialExpenses } = useLoaderData();
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [newExpense, setNewExpense] = useState({
    expense_head: "",
    amount: "",
    categoryId: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  // const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);

  // useEffect(() => {
  //   calculateTotalMonthlyExpenses(expenses); // Calculate total monthly expenses on component mount
  // }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  //validation for amount field
  const validateAmount = (amount) => {
    return !isNaN(amount) && Number(amount) > 0;
  };

  //formvalidation
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

  // Handle save action
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

      calculateTotalMonthlyExpenses(updatedExpenses); // Recalculate monthly total after adding expense

      // Reset the form fields
      setNewExpense({
        expense_head: "",
        amount: "",
        categoryId: "",
        description: "",
      });
      setErrors({});
    }
  };

  //Handle cancel action
  const handleCancel = () => {
    setNewExpense({
      expense_head: "",
      amount: "",
      categoryId: "",
      description: "",
    });
    setErrors({});
  };

  //monthly expense calculation
  // const calculateTotalMonthlyExpenses = (expenses) => {
  //   const total = expenses.reduce((sum, expense) => {
  //     const category = categories.find(
  //       (cat) => cat.id === Number(expense.categoryId)
  //     );
  //     if (category && category.multiplier) {
  //       // Multiply the amount based on category's monthly conversion factor
  //       return sum + expense.amount * category.multiplier;
  //     }
  //     return sum;
  //   }, 0);
  //   setTotalMonthlyExpenses(total);
  // };

  return (
    <Container>
      <Form onSubmit={handleSubmit} aria-label="Expense Management Form">
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
          />
          <FormFeedback>{errors.expense_head}</FormFeedback>
        </FormGroup>

        <FormGroup>
          {/* Amount Text field with number validation */}
          <Label for="amount">Amount</Label>
          <Input
            type="text"
            name="amount"
            id="amount"
            value={newExpense.amount}
            onChange={handleChange}
            invalid={!!errors.amount}
            aria-label="Amount"
          />
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
          />
        </FormGroup>
        {/* Add expense and Cancel Buttons */}
        <FormGroup>
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
      </Form>

      {/* <h3>Total Monthly Expenses: ${totalMonthlyExpenses.toFixed(2)}</h3> */}

      {/* <Table
        hover
        responsive
        aria-label="Expense Table"
        style={{ marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Expense Head</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.expense_head}</td>
              <td>{expense.amount}</td>
              <td>
                {categories.find(
                  (category) => category.id === Number(expense.categoryId)
                )?.name || "N/A"}
              </td>
              <td>{expense.description}</td>
              <td>{expense.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </Container>
  );
}
