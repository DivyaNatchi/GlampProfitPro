import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
  FormText,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useLoaderData } from "react-router-dom";
import { db } from "../db/db";
import "../styles/form.css";
import { getMissingCategoryConstants, monthNames } from "../constant/Constants";
import "../fontRegistration";
import PdfExportButton from "../components/PdfExportButton";

// Loader function defined here to fetch data
export async function rentalRateCalculatorLoader() {
  // Fetch all expenses
  const expenses = await db.expenses.toArray();

  // Fetch all categories with their conversion constants
  const categories = await db.category_constants.toArray();

  // Fetch commission
  const commission = await db.commissions.toArray();
  return { expenses, categories, commission };
}

export default function RentalRateCalculator() {
  // Use useLoaderData to access preloaded data
  const { expenses, categories, commission } = useLoaderData();
  const [formData, setFormData] = useState({
    month: "",
    year: "",
    expectedMonthlyRevenue: "",
    numberOfPods: "",
    averageBooking: "",
    expectedOccupancyPercentage: "",
  });

  const [errors, setErrors] = useState({});
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [reverseCalculationResults, setreverseCalculationResults] =
    useState(null);
  const [missingCategories, setMissingCategories] = useState([]);
  const commissionRate = parseFloat(commission[0].commission_rate).toFixed(2);

  useEffect(() => {
    // Fetch missing categories on component mount
    const fetchMissingCategories = async () => {
      const missingCategoriesData = await getMissingCategoryConstants();
      setMissingCategories(missingCategoriesData);
    };

    fetchMissingCategories();
  }, []);

  // Function to calculate total monthly expenses
  const calculateMonthlyExpenses = () => {
    let totalMonthlyExpenses = 0;

    expenses.forEach((expense) => {
      let multiplier;

      if (Number(expense.categoryId) === 12) {
        multiplier = 0;
      } else {
        const category = categories.find(
          (cat) => Number(cat.categoryId) === Number(expense.categoryId)
        );
        multiplier = category?.monthly_conversion_constant;
      }
      totalMonthlyExpenses += expense.amount * multiplier;
    });

    return parseFloat(totalMonthlyExpenses.toFixed(2));
  };

  // Function to calculate per booking expenses
  const calculatePerBookingExpenses = () => {
    const filteredExpenses = expenses.filter(
      (expense) => Number(expense.categoryId) === 12
    );
    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const expensesPerBookingPerMonth = totalExpenses * formData.averageBooking;
    return parseFloat(expensesPerBookingPerMonth.toFixed(2));
  };

  // Function to calculate Rental rate
  const calculateRentalRate = (formData) => {
    if (formData.numberOfPods <= 0) {
      console.error("Number of Pods should be greater than 0.");
      return;
    }
    if (
      formData.expectedOccupancyPercentage <= 0 ||
      formData.expectedOccupancyPercentage > 100
    ) {
      console.error(
        "Expected Occupancy Percentage should be between 0 and 100."
      );
      return;
    }

    // const category = categories.find((cat) => Number(cat.categoryId) === 1);

    const occupiedRoomsPerMonth = parseFloat(
      (
        formData.numberOfPods *
        (formData.expectedOccupancyPercentage / 100)
      ).toFixed(2)
    );

    if (occupiedRoomsPerMonth <= 0) {
      console.error("Occupied Rooms per Month should be greater than 0.");
      return;
    }

    const daysInMonth = new Date(formData.year, formData.month, 0).getDate();

    const totalOccupiedRoomDays = parseFloat(
      (occupiedRoomsPerMonth * daysInMonth).toFixed(2)
    );

    const monthlyExpenses = calculateMonthlyExpenses();
    const perBookingExpenses = calculatePerBookingExpenses();

    const totalMonthlyExpenses = monthlyExpenses + perBookingExpenses;

    const totalExpensesPerOccupiedRoomDay = parseFloat(
      (totalMonthlyExpenses / totalOccupiedRoomDays).toFixed(2)
    );

    const revenuePerOccupiedRoomDay = parseFloat(
      (formData.expectedMonthlyRevenue / totalOccupiedRoomDays).toFixed(2)
    );

    const expectedRentPerDayWithAllExpenses = parseFloat(
      (totalExpensesPerOccupiedRoomDay + revenuePerOccupiedRoomDay).toFixed(2)
    );

    if (commissionRate <= 0) {
      console.error("Commission rate should be greater than 0.");
      return;
    }
    const commissionPercentage = parseFloat((commissionRate / 100).toFixed(2));

    const franchiserCommission = parseFloat(
      (expectedRentPerDayWithAllExpenses * commissionPercentage).toFixed(2)
    );

    const expectedRentPerDayWithAllExpensesAndCommission = parseFloat(
      (expectedRentPerDayWithAllExpenses + franchiserCommission).toFixed(2)
    );

    setCalculatedResults({
      occupiedRoomsPerMonth,
      totalOccupiedRoomDays,
      totalMonthlyExpenses,
      totalExpensesPerOccupiedRoomDay,
      revenuePerOccupiedRoomDay,
      expectedRentPerDayWithAllExpenses,
      franchiserCommission,
      expectedRentPerDayWithAllExpensesAndCommission,
    });

    const amountFromCustomer = parseFloat(
      (
        expectedRentPerDayWithAllExpensesAndCommission * totalOccupiedRoomDays
      ).toFixed(2)
    );

    const balanceAfterExpenses = parseFloat(
      (amountFromCustomer - totalMonthlyExpenses).toFixed(2)
    );
    const temp = parseFloat(
      (amountFromCustomer / (1 + commissionPercentage)).toFixed(2)
    );
    const reverseFranchisorCommission = parseFloat(
      (amountFromCustomer - temp).toFixed(2)
    );
    const balanceAfterCommission = parseFloat(
      (balanceAfterExpenses - reverseFranchisorCommission).toFixed(2)
    );
    setreverseCalculationResults({
      expectedRentPerDayWithAllExpensesAndCommission,
      amountFromCustomer,
      totalMonthlyExpenses,
      reverseFranchisorCommission,
      balanceAfterCommission,
    });
    return expectedRentPerDayWithAllExpensesAndCommission;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let fieldError = "";
    switch (name) {
      case "month":
        if (!value) {
          fieldError = "Please select a valid month.";
        }
        break;
      case "year":
        if (!/^\d{4}$/.test(value)) {
          fieldError = "Please enter a valid 4-digit year.";
        }
        break;
      case "expectedMonthlyRevenue":
        if (isNaN(value) || value <= 0) {
          fieldError = "Please enter a valid positive amount.";
        } else if (value.length > 7) {
          fieldError =
            "Amount should not exceed 7 digits, please enter a valid amount.";
        }
        break;
      case "numberOfPods":
        if (!Number.isInteger(Number(value)) || value <= 0) {
          fieldError = "Please enter a valid integer for the number of pods.";
        }
        break;
      case "averageBooking":
        if (!Number.isInteger(Number(value)) || value <= 0) {
          fieldError =
            "Please enter a valid integer for the average number of bookings per month.";
        }
        break;
      case "expectedOccupancyPercentage":
        if (
          value === "" ||
          isNaN(Number(value)) ||
          value < 0 ||
          value > 100 ||
          value.length > 5
        ) {
          fieldError =
            "Please enter a percentage between 0 and 100, and it should not exceed 5 digits.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
    return fieldError;
  };

  const validateForm = () => {
    let formErrors = {};

    Object.keys(formData).forEach((field) => {
      const fieldValue = formData[field];
      const fieldError = validateField(field, fieldValue);
      if (fieldError) {
        formErrors[field] = fieldError;
      }
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      calculateRentalRate(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      month: "",
      year: "",
      expectedMonthlyRevenue: "",
      numberOfPods: "",
      averageBooking: "",
      expectedOccupancyPercentage: "",
    });
    setErrors({});
    setCalculatedResults(null);
  };

  return (
    <>
      <Container className="form-container">
        <Form onSubmit={handleSubmit} aria-label="Calculate Rental Rate Form">
          <fieldset className="my-fieldset">
            <legend className="legend">Rental Calculator</legend>
            <div className="form-row">
              {/* Month Dropdown */}
              <FormGroup>
                <Label for="month">Month</Label>
                <Input
                  type="select"
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  invalid={!!errors.month}
                  aria-required="true"
                  aria-label="Month"
                >
                  <option value="">Select Month</option>
                  {monthNames.slice(1).map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{errors.month}</FormFeedback>
              </FormGroup>

              {/* Year with Validation */}
              <FormGroup>
                <Label for="year">Year</Label>
                <Input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  invalid={!!errors.year}
                  aria-required="true"
                  aria-label="Year"
                />
                <FormFeedback>{errors.year}</FormFeedback>
              </FormGroup>
            </div>

            {/* Expected Monthly Revenue with Validation */}
            <FormGroup>
              <Label for="expectedMonthlyRevenue">
                Expected Monthly Revenue
              </Label>
              <Input
                type="text"
                id="expectedMonthlyRevenue"
                name="expectedMonthlyRevenue"
                value={formData.expectedMonthlyRevenue}
                onChange={handleChange}
                invalid={!!errors.expectedMonthlyRevenue}
                aria-required="true"
                aria-label="Expected Monthly Revenue"
              />
              <FormFeedback>{errors.expectedMonthlyRevenue}</FormFeedback>
              <FormText>The desired revenue to achieve in a month.</FormText>
            </FormGroup>

            {/* Number of Pods with Validation */}
            <FormGroup>
              <Label for="numberOfPods">Number of Pods</Label>
              <Input
                type="text"
                id="numberOfPods"
                name="numberOfPods"
                value={formData.numberOfPods}
                onChange={handleChange}
                invalid={!!errors.numberOfPods}
                aria-required="true"
                aria-label="Number of Pods"
              />
              <FormFeedback>{errors.numberOfPods}</FormFeedback>
              <FormText>
                The total number of rental pods available for booking.
              </FormText>
            </FormGroup>

            {/* Average number of booking per month with Validation */}
            <FormGroup>
              <Label for="averageBooking">
                Average Number of booking per month
              </Label>
              <Input
                type="text"
                id="averageBooking"
                name="averageBooking"
                value={formData.averageBooking}
                onChange={handleChange}
                invalid={!!errors.averageBooking}
                aria-required="true"
                aria-label="Average Number of Booking per Month"
              />
              <FormText>
                The total number of bookings in a month for all the pods.
              </FormText>
              <FormFeedback>{errors.averageBooking}</FormFeedback>
            </FormGroup>

            {/* Expected Occupancy Percentage with Validation */}
            <FormGroup>
              <Label for="expectedOccupancyPercentage">
                Expected Occupancy Percentage
              </Label>
              <Input
                type="text"
                id="expectedOccupancyPercentage"
                name="expectedOccupancyPercentage"
                value={formData.expectedOccupancyPercentage}
                onChange={handleChange}
                invalid={!!errors.expectedOccupancyPercentage}
                aria-required="true"
                aria-label="Expected Occupancy Percentage"
              />
              <FormFeedback>{errors.expectedOccupancyPercentage}</FormFeedback>
              <FormText>
                The percentage of time the pods are expected to be occupied (%).
              </FormText>
            </FormGroup>

            {/* Submit and Cancel Buttons */}
            <FormGroup className="text-center">
              <Button
                type="submit"
                aria-label="Calculate Room Rent"
                className="custom-button"
                disabled={missingCategories.length > 0}
              >
                Calculate
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="custom-button"
                aria-label="Cancel"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </FormGroup>
          </fieldset>
        </Form>
        {missingCategories.length > 0 && (
          <div className="missingCategory-container">
            <div className="missingCategory-title">Important Notice</div>
            <p>
              {missingCategories.length === 1
                ? "Please contact the Franchisor, the following monthly conversion constant is not available for Rental Calculation:"
                : "Please contact the Franchisor, the following monthly conversion constants are not available for Rental Calculation:"}
            </p>
            <ul className="missingCategory-list">
              {missingCategories.map((missingCategory) => (
                <li key={missingCategory.id}>{missingCategory.name}</li>
              ))}
            </ul>
          </div>
        )}
      </Container>

      {/* Display Calculated Results in a Table */}
      {calculatedResults && (
        <>
          <Container className="text-center">
            {calculatedResults && reverseCalculationResults && (
              <PdfExportButton
                calculatedResults={calculatedResults}
                reverseCalculationResults={reverseCalculationResults}
                formData={formData}
                commission={commissionRate}
                expenses={expenses}
                categories={categories}
              />
            )}
          </Container>
          <Container>
            <Row>
              {/* First Table */}
              <Col lg="6" md="6" sm="12">
                <Table
                  hover
                  responsive
                  aria-label="Per Pod Rent Per Day Calcualtion Table"
                >
                  <thead>
                    <tr>
                      <th colSpan="2" className="text-center table-header">
                        Per Pod Rent Per Day Calcualtion
                      </th>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Occupied Pods Per Month considering occupancy rate
                        (Estimated)
                      </td>
                      <td>
                        {calculatedResults.occupiedRoomsPerMonth.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>Total Pod Occupied Days</td>
                      <td>
                        {calculatedResults.totalOccupiedRoomDays.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>Total Monthly Expenses</td>
                      <td>
                        {calculatedResults.totalMonthlyExpenses.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>Expenses per Occupied Pod</td>
                      <td>
                        {calculatedResults.totalExpensesPerOccupiedRoomDay.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Revenue per Occupied Pod</td>
                      <td>
                        {calculatedResults.revenuePerOccupiedRoomDay.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>Expected Daily Rent (with Expenses)</td>
                      <td>
                        {calculatedResults.expectedRentPerDayWithAllExpenses.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Franchisor Commission</td>
                      <td>
                        {calculatedResults.franchiserCommission.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">Per Pod Rent Per Day</td>
                      <td className="table-header">
                        {calculatedResults.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>

              {/* Second Table */}
              <Col lg="6" md="6" sm="12">
                <Table hover responsive aria-label="Monthly Summary Table">
                  <thead>
                    <tr>
                      <th colSpan="2" className="text-center table-header">
                        Monthly Summary
                      </th>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pod Rent Per Day</td>
                      <td>
                        {reverseCalculationResults.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Total Monthly Income (at{" "}
                        {formData.expectedOccupancyPercentage}% Occupancy)
                      </td>
                      <td>
                        {reverseCalculationResults.amountFromCustomer.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Total Monthly Expensesh</td>
                      <td>
                        {reverseCalculationResults.totalMonthlyExpenses.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Franchisor Commission</td>
                      <td>
                        {reverseCalculationResults.reverseFranchisorCommission.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Net Franchisee Income (Before Tax)</td>
                      <td>
                        {reverseCalculationResults.balanceAfterCommission.toFixed(
                          2
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}
