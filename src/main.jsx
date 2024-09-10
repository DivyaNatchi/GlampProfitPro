import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

//import pages
import ErrorPage from "./error-page";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FranchiseeDashboard from "./pages/FranchiseeDashboard";
import FranchisorDashboard from "./pages/FranchisorDashboard";
import CommissionManagement, {
  commissionLoader,
} from "./pages/CommissionManagement";
import RentalRateCalculator, {
  rentalRateCalculatorLoader,
} from "./pages/RentalRateCalculator";
import ExpenseManagement, { expenseLoader } from "./pages/ExpenseManagement";
import ExpenseCategoryManagement, {
  expenseCategoryLoader,
} from "./pages/ExpenseCategoryManagement";
import "./styles/index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/franchisee",
          element: <FranchiseeDashboard />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <RentalRateCalculator />,
              loader: rentalRateCalculatorLoader,
            },
            {
              path: "calculate-rental-rate",
              element: <RentalRateCalculator />,
              loader: rentalRateCalculatorLoader,
            },
            {
              path: "expense-management",
              element: <ExpenseManagement />,
              loader: expenseLoader,
            },
          ],
        },
        {
          path: "/franchisor",
          element: <FranchisorDashboard />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <CommissionManagement />,
              loader: commissionLoader,
            },
            {
              path: "commission-management",
              element: <CommissionManagement />,
              loader: commissionLoader,
            },
            {
              path: "Expense-Category-management",
              element: <ExpenseCategoryManagement />,
              loader: expenseCategoryLoader,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: "/GlampProfitPro",
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
