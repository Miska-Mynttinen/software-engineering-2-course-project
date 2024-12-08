import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect } from "react";
import "./index.css";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/slices";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import PipelineComposer from "./routes/PipeLineComposer";
import UserPage from "./routes/OverviewPage";
import AuthPage from "./components/LogIn/AuthPage";
import { loadState, saveState } from "./redux/browser-storage";
import { clearTickets } from "./redux/slices/currentSessionTicketSlice";
import AdminDashboard from "./components/AdminPages/AdminDashboard";
import UnauthorizedPage from "./components/UnauthorizedPage";

// Unauthorized Page Component
function Unauthorized() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/">Go to Home</a>
    </div>
  );
}

// Configure redux-persist
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: loadState(),
});

// Subscribe to save the store state periodically
store.subscribe(() => saveState(store.getState()));

// Helper function to check for the token in localStorage
const checkToken = () => {
  const token = localStorage.getItem("token");
  return !!token; // Return true if token exists, otherwise false
};

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: JSX.Element;
  allowedRole: string[];
}) => {
  const isAuthenticated = checkToken();
  const userType = localStorage.getItem("userType");

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login
  }

  if (!allowedRole.includes(userType || "")) {
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized page
  }

  return children;
};


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define Routes
const router = createBrowserRouter([
  {
    path: "/", // Route for the AuthPage
    element: <AuthPage />,
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRole={["user"]}>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRole={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pipeline",
    element: (
      <ProtectedRoute allowedRole={["user"]}>
        <PipelineComposer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/unauthorized", // Route for unauthorized access
    element: <UnauthorizedPage />,
  },
  {
    path: "*", // Catch-all route
    element: (
      <div>
        <h1>404 - Not Found</h1>
        <a href="/">Go to Home</a>
      </div>
    ),
  },
]);

// Component to clear tickets on app load
function ClearTicketsOnLoad() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearTickets()); // Clear tickets on initial load
  }, [dispatch]);

  return null;
}

// Main App Component
export default function App() {
  useEffect(() => {
    const isAuthenticated = checkToken();
    if (!isAuthenticated) {
      router.navigate("/"); // Redirect to login if no token
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Provider store={store}>
          <ClearTicketsOnLoad /> {/* Dispatch the action after the store is initialized */}
          <RouterProvider router={router} />
        </Provider>
      </div>
    </ThemeProvider>
  );
}
