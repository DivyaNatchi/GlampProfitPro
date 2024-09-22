// PdfExportButton.js
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { monthNames, wigwamLogo } from "../constant/Constants.jsx";

// Define styles for the PDF content
const styles = StyleSheet.create({
  page: {
    padding: 20, // This applies 40 to all sides (top, right, bottom, left)
    // paddingHorizontal: 30, // This applies 30 to left and right
    fontSize: 10,
    fontFamily: "Open Sans",
  },
  section: {
    alignItems: "center",
  },
  header: {
    backgroundColor: "#00bf8f",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #000",
  },
  logo: {
    width: 40,
    height: 40,
    textAlign: "center",
    marginBottom: 2,
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 11.5,
    fontWeight: "700",
  },
  tableHeader: {
    backgroundColor: "#00bf8f", // Background color
    padding: 2,
    alignItems: "center",
    borderTop: "1px solid #000",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    color: "#fff",
    fontSize: 11.5,
    fontWeight: 700,
    textAlign: "center",
  },
  dateSection: {
    textAlign: "right",
    marginTop: 5,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid #000",
  },
  description: {
    width: "55%",
    padding: 1,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
  },
  value: {
    width: "45%",
    padding: 1,
    borderRight: "1px solid #000",
    textAlign: "right",
  },
  tableExpensesRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    alignItems: "center",
  },
  expenses: {
    width: "40%",
    padding: 1,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
  },
  amount: {
    width: "15%",
    padding: 1,
    borderRight: "1px solid #000",
    textAlign: "right",
  },
  category: {
    width: "15%",
    padding: 1,
    borderRight: "1px solid #000",
  },
  constant: {
    width: "15%",
    padding: 1,
    borderRight: "1px solid #000",
    textAlign: "right",
  },
  monthlyAmount: {
    width: "15%",
    padding: 1,
    borderRight: "1px solid #000",
    textAlign: "right",
  },
  totalExpensesRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid #000",
    color: "#00bf8f",
  },
  totalMonthlyExpenses: {
    width: "85%",
    padding: 2,
    textAlign: "right",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
});

// Create a function to render the PDF document
const PdfDocument = ({
  calculatedResults,
  reverseCalculationResults,
  formData,
  commission,
  expenses,
  categories,
}) => {
  // Function to get formatted date and time
  const getFormattedDateTime = (date) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()].slice(0, 3); // Get the first three letters of the month
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { formattedDate, formattedTime };
  };
  // Get current date and time
  const { formattedDate, formattedTime } = getFormattedDateTime(new Date());

  const getCategoryConstant = (categoryId) => {
    const category = categories.find(
      (cat) => Number(cat.categoryId) === Number(categoryId)
    );
    return Number(category?.monthly_conversion_constant);
  };

  const getConstantName = (categoryId) => {
    return categories.find(
      (cat) => Number(cat.categoryId) === Number(categoryId)
    )?.name;
  };

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Image src={wigwamLogo} style={styles.logo} />
        </View>
        <Text style={styles.tableHeader}>Pod Rent Calculation</Text>
        <View>
          <Text style={styles.dateSection}>
            Date: {formattedDate} | Time: {formattedTime}
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
              <Text
                style={[
                  styles.value,
                  { borderTop: "1px solid #000", textAlign: "left" },
                ]}
              >
                {monthNames[formData?.month]} {formData?.year}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Expected Monthly Revenue
              </Text>
              <Text style={[styles.value, { textAlign: "left" }]}>
                {formData?.expectedMonthlyRevenue}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Average Booking Per Month
              </Text>
              <Text style={[styles.value, { textAlign: "left" }]}>
                {formData?.averageBooking}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Number of Pods
              </Text>
              <Text style={[styles.value, { textAlign: "left" }]}>
                {formData?.numberOfPods}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Expected Occupancy Rate (%)
              </Text>
              <Text style={[styles.value, { textAlign: "left" }]}>
                {Number(formData?.expectedOccupancyPercentage).toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.description, { color: "#00bf8f" }]}>
                Franchisor Commission Rate (%)
              </Text>
              <Text style={[styles.value, { textAlign: "left" }]}>
                {commission}
              </Text>
            </View>
          </View>
          {/* Monthly Expenses Table data*/}
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Monthly Expenses</Text>
            <View>
              <View style={styles.tableExpensesRow}>
                <Text
                  style={[
                    styles.expenses,
                    {
                      padding: 15,
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#00bf8f",
                    },
                  ]}
                >
                  Expenses
                </Text>
                <Text
                  style={[
                    styles.amount,
                    {
                      padding: 15,
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#00bf8f",
                    },
                  ]}
                >
                  Amount
                </Text>
                <Text
                  style={[
                    styles.category,
                    {
                      padding: 15,
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#00bf8f",
                    },
                  ]}
                >
                  Category
                </Text>
                <Text
                  style={[
                    styles.constant,
                    {
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#00bf8f",
                    },
                  ]}
                >
                  Monthly{"\n"}Conversion{"\n"}Constant
                </Text>
                <Text
                  style={[
                    styles.monthlyAmount,
                    {
                      textAlign: "center",
                      fontWeight: "700",
                      padding: 8,
                      color: "#00bf8f",
                    },
                  ]}
                >
                  Monthly{"\n"}Equivalent
                </Text>
              </View>
              {expenses.map((expense, index) => {
                const { expense_head, amount, categoryId } = expense;

                let ConstantName, conversionConstant;
                if (categoryId === "12") {
                  ConstantName = "Per Booking";
                  conversionConstant = Number(formData.averageBooking); // Assuming formData contains the averageBooking value
                  console.log(
                    "formData.averageBooking",
                    formData.averageBooking
                  );
                } else {
                  ConstantName = getConstantName(categoryId);
                  conversionConstant = getCategoryConstant(categoryId);
                }
                const monthlyEquivalent = amount * conversionConstant;

                return (
                  <View key={index} style={styles.tableExpensesRow}>
                    <Text style={styles.expenses}>
                      {expense_head.length > 80
                        ? `${expense_head.slice(0, 75)}...`
                        : expense_head}
                    </Text>
                    <Text
                      style={[
                        styles.amount,
                        expense_head.length > 40 && {
                          paddingTop: 9,
                          paddingBottom: 9,
                        },
                      ]}
                    >
                      {amount.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.category,
                        expense_head.length > 40 && {
                          paddingTop: 9,
                          paddingBottom: 9,
                        },
                      ]}
                    >
                      {ConstantName}
                    </Text>
                    <Text
                      style={[
                        styles.constant,
                        expense_head.length > 40 && {
                          paddingTop: 9,
                          paddingBottom: 9,
                        },
                      ]}
                    >
                      {conversionConstant.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.monthlyAmount,
                        expense_head.length > 40 && {
                          paddingTop: 9,
                          paddingBottom: 9,
                        },
                      ]}
                    >
                      {monthlyEquivalent.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
              <View
                style={[
                  styles.totalExpensesRow,
                  {
                    fontWeight: 700,
                  },
                ]}
              >
                <Text style={styles.totalMonthlyExpenses}>
                  Total Monthly Expenses
                </Text>
                <Text style={styles.monthlyAmount}>
                  {calculatedResults?.totalMonthlyExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Pod rent table data*/}
          <View style={styles.table}>
            <Text
              style={[styles.tableHeader, { borderBottom: "1px solid #000" }]}
            >
              Per Pod Rent Per Day Calculation
            </Text>
            <View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Occupied Pods Per Month considering occupancy rate {"\n"}
                  (Estimated)
                </Text>
                <Text
                  style={[styles.value, { paddingTop: 8, paddingBottom: 8 }]}
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
                <Text
                  style={[
                    styles.description,
                    { backgroundColor: "#00bf8f", color: "#fff" },
                  ]}
                >
                  Per Pod Rent Per Day
                </Text>
                <Text
                  style={[
                    styles.value,
                    { backgroundColor: "#00bf8f", color: "#fff" },
                  ]}
                >
                  {calculatedResults?.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                    2
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly summary table data */}
          <View style={styles.table}>
            <Text
              style={[styles.tableHeader, { borderBottom: "1px solid #000" }]}
            >
              Monthly Summary
            </Text>
            <View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>Pod Rent Per Day</Text>
                <Text style={styles.value}>
                  {reverseCalculationResults?.expectedRentPerDayWithAllExpensesAndCommission.toFixed(
                    2
                  )}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.description}>
                  Total Monthly Income (at{" "}
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
  expenses,
  categories,
}) {
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD
  const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, ""); // Get hhmmss
  const fileName = `PodRentPerDayReport${formattedDate}-${formattedTime}.xlsx`;

  return (
    <PDFDownloadLink
      document={
        <PdfDocument
          calculatedResults={calculatedResults}
          reverseCalculationResults={reverseCalculationResults}
          formData={formData}
          commission={commission}
          expenses={expenses}
          categories={categories}
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
