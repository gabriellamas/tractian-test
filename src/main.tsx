import "./Reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AssetsPage } from "./routes/AssetsPage";
import Home from "./routes/HomePage";
import ErrorPage from "./routes/ErrorPage/Error";
import UsersPage from "./routes/UsersPage";
import UnitsPage from "./routes/UnitsPage";
import CompaniesPages from "./routes/CompaniesPage";
import OrdersPage from "./routes/OrdersPage";
import { LoadingContextProvider } from "./context/LoadingContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/ativos",
        element: <AssetsPage />,
      },
      {
        path: "/usuarios",
        element: <UsersPage />,
      },
      {
        path: "/unidades",
        element: <UnitsPage />,
      },
      {
        path: "/empresas",
        element: <CompaniesPages />,
      },
      {
        path: "/ordens",
        element: <OrdersPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <React.StrictMode>
      <LoadingContextProvider>
        <RouterProvider router={router} />
      </LoadingContextProvider>
    </React.StrictMode>
  </React.StrictMode>
);
