// src/components/CommissionManagement.jsx
import React, { useState, useEffect } from "react";
import {
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const commissionLoader = async () => {
  const existingCommission = await db.commissions.get(1); //The record always has id = 1
  return existingCommission ? existingCommission : null;
};

export default function CommissionManagement() {
  const commissionData = useLoaderData();
  const [commissionRateInput, setCommissionRateInput] = useState("");
  const [commissionRateDisplay, setCommissionRateDisplay] = useState(
    commissionData ? commissionData.commission_rate : "0.00"
  );
  const [errors, setErrors] = useState("");
  // const [lastUpdated, setLastUpdated] = useState(
  //   commissionData ? commissionData.last_updated : ""
  // );

  // Use useEffect to set commissionRateInput when commissionRateDisplay is available
  useEffect(() => {
    if (commissionRateDisplay) {
      setCommissionRateInput(commissionRateDisplay);
    }
  }, [commissionRateDisplay]);

  // Validation: Ensure value is a percentage (between 0 and 100) and length is greater than 5
  const validateCommission = (rate) => {
    // Check if the input is empty
    if (rate === "") {
      return {
        isValid: false,
        errorMessage: "Please enter the commission rate.",
      };
    }

    // Validate if it's a number and within the valid range (0-100)
    const parsedRate = parseFloat(rate);
    if (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 100) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid percentage between 0 and 100.",
      };
    }

    // Check if the input length is greater than 5
    if (rate.length > 5) {
      return {
        isValid: false,
        errorMessage: "Allowed length is only 5 digits.",
      };
    }

    // If all validations pass
    return { isValid: true, errorMessage: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCommission(commissionRateInput);

    if (!validation.isValid) {
      setErrors(validation.errorMessage); // Set the appropriate error message based on validation
      return;
    }

    // Reset error state and set last updated date
    setErrors("");
    const now = new Date().toISOString().split("T")[0]; // Optional: Keep track of the last update
    // setLastUpdated(now);

    // Check if a commission record exists
    const existingCommission = await db.commissions.get(1);

    if (existingCommission) {
      // If record exists, update the existing record
      await db.commissions.update(1, {
        commission_rate: Number(commissionRateInput),
        last_updated: now,
      });
      toast.success("Commission rate updated successfully!", {
        position: "top-center",
      });
    } else {
      // If no record exists, add a new one with id = 1
      await db.commissions.add({
        id: 1, // Ensure that the id is always 1
        commission_rate: Number(commissionRateInput),
        last_updated: now,
      });
      toast.success("Commission rate added successfully!", {
        position: "top-center",
      });
    }

    // Update display state with the new commission rate
    setCommissionRateDisplay(commissionRateInput);
    setCommissionRateInput(""); // reset input field
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCommissionRateInput(value);

    // Perform validation
    const validation = validateCommission(value);
    setErrors(validation.errorMessage);
  };

  return (
    <Container className="form-container">
      <Form onSubmit={handleSubmit} aria-label="Commission Management Form">
        <fieldset className="my-fieldset">
          <legend className="legend">Commission Management</legend>
          <FormGroup>
            <Label for="commission_rate">Commission Rate</Label>
            <Input
              type="text"
              name="commission_rate"
              id="commission_rate"
              value={commissionRateInput}
              onChange={handleChange}
              invalid={!!errors}
              aria-label="Commission Rate Input"
              aria-describedby="commission-rate-error"
            ></Input>
            <FormText>Enter the commission rate as a percentage (%)</FormText>
            {errors && (
              <FormFeedback id="commission-rate-error">{errors}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup className="text-center">
            <Button
              type="submit"
              className="custom-button "
              aria-label="Save Commission Rate"
            >
              Save
            </Button>
          </FormGroup>
        </fieldset>
      </Form>
      <ToastContainer />
      {/* {lastUpdated && (
        <p className="mt-3">
          Last Updated Commission Rate:{" "}
          <strong>{commissionRateDisplay}%</strong>
          <br />
          Last Updated Date: <strong>{lastUpdated}</strong>
        </p>
      )} */}
    </Container>
  );
}
