// PdfExportButton.js
import React, { useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { db } from "../db/db";
import { monthNames, wigwamLogo } from "../constant/Constants.jsx";

// Define styles for the PDF content
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    backgroundColor: "#00bf8f", // Background color
    padding: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #000",
  },
  logo: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#00bf8f", // Background color
    padding: 5,
    alignItems: "center",
    borderTop: "1px solid #000",
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  dateSection: {
    textAlign: "right",
    marginTop: 10,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "50%",
    padding: 2,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  value: {
    width: "50%",
    padding: 2,
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    textAlign: "right",
  },
  tableExpensesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenses: {
    width: "35%",
    padding: 2,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  amount: {
    width: "10%",
    padding: 2,
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  category: {
    width: "15%",
    padding: 2,
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  constant: {
    width: "25%",
    padding: 2,
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  monthlyAmount: {
    width: "15%",
    padding: 2,
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
  },
});

// Create a function to render the PDF document
const PdfDocument = ({
  calculatedResults,
  reverseCalculationResults,
  formData,
  commission,
}) => {
  formData;
  console.log("formData", formData);
  // Set current date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image src={wigwamLogo} style={styles.logo} />
          <Text style={styles.title}>Pod Rent Calculation</Text>
        </View>
        <View>
          <Text style={styles.dateSection}>
            Date: {currentDate} | Time: {currentTime}
          </Text>
        </View>
        <View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.description,
                  { color: "#00bf8f", borderTop: "1px solid #000" },
                ]}
              >
                Month
              </Text>
              <Text style={[styles.value, { borderTop: "1px solid #000" }]}>
                {monthNames[formData?.month]} {formData?.year}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Expected Monthly Revenue
              </Text>
              <Text style={styles.value}>
                {formData?.expectedMonthlyRevenue}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Average Booking Per Month
              </Text>
              <Text style={styles.value}>{formData?.averageBooking}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Number of Pods
              </Text>
              <Text style={styles.value}>{formData?.numberOfPods}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Expected Occupancy Rate (%)
              </Text>
              <Text style={styles.value}>
                {formData?.expectedOccupancyPercentage}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Franchisor Commission Rate (%)
              </Text>
              <Text style={styles.value}>{commission}</Text>
            </View>
          </View>
          <Text style={styles.title}>Pod Rent Calculation Report</Text>
          {/* Monthly Expenses Table data*/}
          <View style={styles.section}>
            <Text style={styles.tableHeader}>Monthly Expenses</Text>
            <View style={styles.table}>
              <View
                style={[
                  styles.tableExpensesRow,
                  { borderTop: "1px solid #000" },
                ]}
              >
                <Text
                  style={[
                    styles.expenses,
                    { borderTop: "1px solid #000", padding: 8.5 },
                  ]}
                >
                  Expenses
                </Text>
                <Text
                  style={[
                    styles.amount,
                    { padding: 8.5, borderTop: "1px solid #000" },
                  ]}
                >
                  Amount
                </Text>
                <Text
                  style={[
                    styles.category,
                    { padding: 8.5, borderTop: "1px solid #000" },
                  ]}
                >
                  Category
                </Text>
                <Text
                  style={[styles.constant, { borderTop: "1px solid #000" }]}
                >
                  Monthly Conversion Constant
                </Text>
                <Text
                  style={[
                    styles.monthlyAmount,
                    { borderTop: "1px solid #000" },
                  ]}
                >
                  Monthly Equivalent
                </Text>
              </View>
              <View style={styles.tableExpensesRow}>
                <Text style={styles.expenses}></Text>
                <Text style={styles.amount}></Text>
                <Text style={styles.category}></Text>
                <Text style={styles.constant}></Text>
                <Text style={styles.monthlyAmount}></Text>
              </View>
            </View>
          </View>
          {/* Pod rent table data*/}
          <View>
            <Text style={styles.tableHeader}>
              Per Pod Rent Per Day Calculation
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text
                  style={[styles.description, { borderTop: "1px solid #000" }]}
                >
                  Occupied Pods Per Month considering occupancy rate (Estimated)
                </Text>
                <Text
                  style={[
                    styles.value,
                    { padding: 8.5, borderTop: "1px solid #000" },
                  ]}
                >
                  {calculatedResults?.occupiedRoomsPerMonth.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Total Pod Occupied Days</Text>
                <Text style={styles.value}>
                  {calculatedResults?.totalOccupiedRoomDays.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Total Monthly Expenses</Text>
                <Text style={styles.value}>
                  {calculatedResults?.totalMonthlyExpenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Expenses per Occupied Pods
                </Text>
                <Text style={styles.value}>
                  {calculatedResults?.totalExpensesPerOccupiedRoomDay.toFixed(
                    2
                  )}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Revenue per Occupied Pod</Text>
                <Text style={styles.value}>
                  {calculatedResults?.revenuePerOccupiedRoomDay.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Expected Daily Rent (with Expenses)
                </Text>
                <Text style={styles.value}>
                  {calculatedResults?.expectedRentPerDayWithAllExpenses.toFixed(
                    2
                  )}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Franchisor Commission</Text>
                <Text style={styles.value}>
                  {calculatedResults?.franchiserCommission.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.tableRow, { backgroundColor: "#00bf8f" }]}>
                <Text style={styles.description}>Per Pod Rent Per Day</Text>
                <Text style={styles.value}>
                  {calculatedResults?.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                    2
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly summary table data */}
          <View>
            <Text style={styles.tableHeader}>Monthly Summary</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text
                  style={[styles.description, { borderTop: "1px solid #000" }]}
                >
                  Pod Rent Per Day
                </Text>
                <Text style={[styles.value, { borderTop: "1px solid #000" }]}>
                  {reverseCalculationResults?.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                    2
                  )}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Total Monthly Income (at
                  {formData?.expectedOccupancyPercentage}% Occupancy)
                </Text>
                <Text style={styles.value}>
                  {reverseCalculationResults?.amountFromCustomer.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Total Monthly Expenses</Text>
                <Text style={styles.value}>
                  {reverseCalculationResults?.totalMonthlyExpenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Franchisor Commission</Text>
                <Text style={styles.value}>
                  {reverseCalculationResults?.reverseFranchisorCommission.toFixed(
                    2
                  )}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Net Franchisee Income (Before Tax)
                </Text>
                <Text style={styles.value}>
                  {reverseCalculationResults?.balanceAfterCommission.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// PdfExportButton component to trigger download
export default function PdfExportButton({
  calculatedResults,
  reverseCalculationResults,
  formData,
  commission,
}) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD
  const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, ""); // Get hhmmss
  const fileName = `PodRentPerDayReport${formattedDate}-${formattedTime}.xlsx`;

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all expenses
      const fetchedExpenses = await db.expenses.toArray();
      setExpenses(fetchedExpenses);

      // Fetch all categories with their conversion constants
      const fetchedCategories = await db.category_constants.toArray();
      setCategories(fetchedCategories);
    };

    fetchData();
  }, []);
  console.log("expenses", expenses);
  console.log("categories:", categories);
  return (
    <PDFDownloadLink
      document={
        <PdfDocument
          calculatedResults={calculatedResults}
          reverseCalculationResults={reverseCalculationResults}
          formData={formData}
          commission={commission}
        />
      }
      fileName={fileName}
    >
      {({ loading }) =>
        loading ? (
          "Preparing PDF..."
        ) : (
          <button className="custom-button">Download PDF</button>
        )
      }
    </PDFDownloadLink>
  );
}
