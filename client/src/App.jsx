import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SharedLayout from "./layouts/SharedLayout";

import SingleError from "./components/SingleError";

import { Admin, ErrorPage, Home, Login, Register, Profil } from "./pages";

import { ProtectedRoute, MangaPage, ChapterPage } from "./components";

import { AuthRedirect, RoleRedirect } from "./contexts/AuthRedirect.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <AuthRedirect />,
        children: [
          {
            index: true,
            element: <Home />,
            errorElement: <SingleError />
          },

          {
            path: "profile",
            element: (
              <RoleRedirect disallowedRole="admin" redirectTo="/admin">
                <Profil />
              </RoleRedirect>
            )
          },
          {
            path: "/manga/:mangaId",
            element: <MangaPage />
          },
          {
            path: "/manga/:mangaId/chapter/:chapterId",
            element: <ChapterPage />
          },
          {
            path: "admin",
            element: (
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            )
          }
        ]
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
        path: "*",
        element: <ErrorPage />,
        loader: () => {
          throw new Response("Page non trouvée", { status: 404 });
        }
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
