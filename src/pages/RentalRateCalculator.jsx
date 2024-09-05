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

export default function RentalRateCalculator() {
  const [formData, setFormData] = useState({
    month: "",
    year: "",
    expectedMonthlyRevenue: "",
    numberOfPods: "",
    expectedOccupancyPercentage: "",
  });

  const [errors, setErrors] = useState({});

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
      console.log("Form Data Submitted: ", formData);
      // Perform the rental rate calculation logic here
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

  return (
    <Container>
      <Form onSubmit={handleSubmit} aria-label="Calculate Rental Rate Form">
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
          <FormText>
            The month for which the rental rate is being calculated.
          </FormText>
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
          <FormText>
            The year for which the rental rate is being calculated.
          </FormText>
        </FormGroup>

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
        <FormGroup>
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
      </Form>
    </Container>
  );
}
