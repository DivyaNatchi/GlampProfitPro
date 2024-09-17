import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
  FormText,
} from "reactstrap";
import { useLoaderData } from "react-router-dom";
import { db } from "../db/db";
import RentalRateDisplay from "../card/RentalRateDisplay";
import "../styles/form.css";

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
  const [rentalRate, setRentalRate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    month: "",
    year: "",
    expectedMonthlyRevenue: "",
    numberOfPods: "",
    averageBooking: "",
    expectedOccupancyPercentage: "",
  });

  const [errors, setErrors] = useState({});

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
        multiplier = category ? category.monthly_conversion_constant : 1; // Use 1 if no multiplier exists
      }
      totalMonthlyExpenses += expense.amount * multiplier;
    });

    // console.log(
    //   "Total monthly expenses calculated:",
    //   totalMonthlyExpenses.toFixed(2)
    // );
    return parseFloat(totalMonthlyExpenses.toFixed(2));
  };

  // Function to calculate per booking expenses
  const calculatePerBookingExpenses = () => {
    // console.log("form data:", formData);
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
    // console.log("From rental rate calculation");
    // console.log(formData);

    // Validate numberOfPods and expectedOccupancyPercentage
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

    const category = categories.find((cat) => Number(cat.categoryId) === 1);

    const occupiedRoomsPerMonth = parseFloat(
      (
        formData.numberOfPods *
        (formData.expectedOccupancyPercentage / 100)
      ).toFixed(2)
    );

    // console.log("Total Occupied Rooms Per Month: ", occupiedRoomsPerMonth);

    // Validate occupiedRoomsPerMonth
    if (occupiedRoomsPerMonth <= 0) {
      console.error("Occupied Rooms per Month should be greater than 0.");
      return;
    }

    // Get the number of days in the month based on user input (month and year)
    const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
    // console.log("Days in month: ", daysInMonth);

    // Calculate total occupied room-days using the number of days in the month
    const totalOccupiedRoomDays = parseFloat(
      (occupiedRoomsPerMonth * daysInMonth).toFixed(2)
    );

    // console.log("Total Occupied Room-Days", totalOccupiedRoomDays);

    const monthlyExpenses = calculateMonthlyExpenses();
    const perBookingExpenses = calculatePerBookingExpenses();

    const totalMonthlyExpenses = monthlyExpenses + perBookingExpenses;
    // console.log("Total Monthly Expenses", totalMonthlyExpenses);

    const totalExpensesPerOccupiedRoomDay = parseFloat(
      (totalMonthlyExpenses / totalOccupiedRoomDays).toFixed(2)
    );
    // console.log(
    //   "Total Expenses Per Occupied Room-Day",
    //   totalExpensesPerOccupiedRoomDay
    // );

    const revenuePerOccupiedRoomDay = parseFloat(
      (formData.expectedMonthlyRevenue / totalOccupiedRoomDays).toFixed(2)
    );

    // console.log("Revenue Per Occupied Room-Day", revenuePerOccupiedRoomDay);

    const expectedRentPerDayWithAllExpenses = parseFloat(
      (totalExpensesPerOccupiedRoomDay + revenuePerOccupiedRoomDay).toFixed(2)
    );

    // console.log(
    //   "Expected Per Day Room Rent Including Expenses",
    //   expectedRentPerDayWithAllExpenses
    // );

    const commissionRate = parseFloat(commission[0].commission_rate).toFixed(2);
    // Validate commissionRate to avoid division by zero
    if (commissionRate <= 0) {
      console.error("Commission rate should be greater than 0.");
      return;
    }
    // console.log("commissionrate: ", commissionRate);
    const franchiserCommission = parseFloat(
      (expectedRentPerDayWithAllExpenses * (commissionRate / 100)).toFixed(2)
    );

    // console.log("Franchiser commission: ", franchiserCommission);

    const expectedRentPerDayWithAllExpensesAndCommission = parseFloat(
      (expectedRentPerDayWithAllExpenses + franchiserCommission).toFixed(2)
    );

    setRentalRate(expectedRentPerDayWithAllExpensesAndCommission);
    setModalOpen(true);
    return expectedRentPerDayWithAllExpensesAndCommission;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    // Year validation: must be a valid 4-digit number
    if (!/^\d{4}$/.test(formData.year)) {
      formErrors.year = "Please enter a valid 4-digit year.";
    }

    // Expected Monthly Revenue: must be a valid positive number
    if (
      isNaN(formData.expectedMonthlyRevenue) ||
      formData.expectedMonthlyRevenue <= 0
    ) {
      formErrors.expectedMonthlyRevenue =
        "Please enter a valid positive amount.";
    }

    // Number of Pods: must be a valid integer
    if (
      !Number.isInteger(Number(formData.numberOfPods)) ||
      formData.numberOfPods <= 0
    ) {
      formErrors.numberOfPods =
        "Please enter a valid integer for the number of pods.";
    }

    // Average booking per month: must be a valid integer
    if (
      !Number.isInteger(Number(formData.averageBooking)) ||
      formData.averageBooking <= 0
    ) {
      formErrors.averageBooking =
        "Please enter a valid integer for the average number of booking per month.";
    }

    // Expected Occupancy Percentage: must be a number between 0 and 100
    if (
      isNaN(formData.expectedOccupancyPercentage) ||
      formData.expectedOccupancyPercentage < 0 ||
      formData.expectedOccupancyPercentage > 100
    ) {
      formErrors.expectedOccupancyPercentage =
        "Please enter a percentage between 0 and 100.";
    }

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
      expectedOccupancyPercentage: "",
    });
    setErrors({});
  };

  // Toggle the modal visibility
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
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
                aria-required="true"
                aria-label="Month"
              >
                <option value="">Select Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Input>
              {/* <FormText>
              The month for which the rental rate is being calculated.
            </FormText> */}
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
                aria-label="year-description"
              />
              <FormFeedback>{errors.year}</FormFeedback>
              {/* <FormText>
                The year for which the rental rate is being calculated.
              </FormText> */}
            </FormGroup>
          </div>

          {/* Expected Monthly Revenue with Validation */}
          <FormGroup>
            <Label for="expectedMonthlyRevenue">Expected Monthly Revenue</Label>
            <Input
              type="text"
              id="expectedMonthlyRevenue"
              name="expectedMonthlyRevenue"
              value={formData.expectedMonthlyRevenue}
              onChange={handleChange}
              invalid={!!errors.expectedMonthlyRevenue}
              aria-required="true"
              aria-label="expectedMonthlyRevenue"
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
              aria-label="Average number of booking per month"
            />
            <FormText>
              The total number of booking in a month for all the pods.
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
              aria-label="expected Occupancy Percentage"
            />
            <FormFeedback>{errors.expectedOccupancyPercentage}</FormFeedback>
            <FormText>
              The percentage of time the pods are expected to be occupied.
            </FormText>
          </FormGroup>

          {/* Submit and Cancel Buttons */}
          <FormGroup className="text-center form-btn">
            <Button
              type="submit"
              color="primary"
              aria-label="Calculate Room Rent"
            >
              Calculate
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
      {rentalRate !== null && (
        <RentalRateDisplay
          rentalRate={rentalRate}
          isOpen={modalOpen}
          toggle={toggleModal}
        />
      )}
    </Container>
  );
}
