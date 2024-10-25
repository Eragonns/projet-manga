import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SharedLayout from "./layouts/SharedLayout";

import SingleError from "./components/SingleError";

import { Admin, ErrorPage, Home, Login, Register } from "./pages";

import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <SingleError />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <ErrorPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
