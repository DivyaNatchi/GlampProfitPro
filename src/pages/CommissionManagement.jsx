// src/components/CommissionManagement.jsx
import React, { useState } from "react";
import {
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

export const commissionLoader = async () => {
  const existingCommission = await db.commissions.get(1); //Tthe record always has id = 1
  return existingCommission ? existingCommission : null;
};

export default function CommissionManagement() {
  const commissionData = useLoaderData();
  const [commissionRateInput, setCommissionRateInput] = useState(
    commissionData ? commissionData.commission_rate : ""
  );
  const [commissionRateDisplay, setCommissionRateDisplay] = useState(
    commissionData ? commissionData.commission_rate : ""
  );
  const [errors, setErrors] = useState("");
  const [lastUpdated, setLastUpdated] = useState(
    commissionData ? commissionData.last_updated : ""
  );

  // Validation: Ensure value is a percentage (between 0 and 100)
  const validateCommission = (rate) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCommission(commissionRateInput)) {
      setErrors("Please enter a valid percentage between 0 and 100.");
      return;
    }

    // Reset error state and set last updated date
    setErrors("");
    const now = new Date().toISOString().split("T")[0]; // Optional: Keep track of the last update
    setLastUpdated(now);

    // Check if a commission record exists
    const existingCommission = await db.commissions.get(1);

    if (existingCommission) {
      // If record exists, update the existing record
      await db.commissions.update(1, {
        commission_rate: Number(commissionRateInput),
        last_updated: now,
      });
    } else {
      // If no record exists, add a new one with id = 1
      await db.commissions.add({
        id: 1, // Ensure that the id is always 1
        commission_rate: Number(commissionRateInput),
        last_updated: now,
      });
    }

    // Update display state with the new commission rate
    setCommissionRateDisplay(commissionRateInput);
    setCommissionRateInput(""); // reset input field
  };

  const handleChange = (e) => {
    setCommissionRateInput(e.target.value);
  };

  return (
    <Container>
      <h3>Commission Management</h3>
      <Form onSubmit={handleSubmit} aria-label="Commission Management Form">
        <FormGroup>
          <Label for="commission_rate">Commission Rate (%)</Label>
          <Input
            type="text"
            name="commission_rate"
            id="commission_rate"
            value={commissionRateInput}
            onChange={handleChange}
            invalid={!!errors}
            aria-label="Commission Rate Input"
            aria-describedby="commission-rate-error"
          />
          {errors && (
            <FormFeedback id="commission-rate-error">{errors}</FormFeedback>
          )}
        </FormGroup>
        <Button type="submit" color="primary" aria-label="Save Commission Rate">
          Save
        </Button>
      </Form>
      {lastUpdated && (
        <p>
          Last Updated Commission Rate:{" "}
          <strong>{commissionRateDisplay}%</strong>
          <br />
          Last Updated Date: <strong>{lastUpdated}</strong>
        </p>
      )}
    </Container>
  );
}
