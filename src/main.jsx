import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import ErrorPage from "./error-page";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import FranchiseeDashboard from "./pages/FranchiseeDashboard";
import FranchisorDashboard from "./pages/FranchisorDashboard";
import CommissionManagement from "./pages/CommissionManagement";
import RentalRateCalculator from "./pages/RentalRateCalculator";
import ExpenseManagement from "./pages/ExpenseManagement";

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
          children: [
            {
              path: "calculate-rental-rate",
              element: <RentalRateCalculator />,
            },
            {
              path: "expense-management",
              element: <ExpenseManagement />,
            },
          ],
        },
        {
          path: "/franchisor",
          element: <FranchisorDashboard />,
          children: [
            {
              path: "commission-management",
              element: <CommissionManagement />,
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
