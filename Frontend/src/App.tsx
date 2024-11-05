import { ThemeProvider, createTheme } from "@mui/material";

import { useEffect } from 'react';

import "./index.css";
import { Provider, useDispatch  } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/slices";

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import PipelineComposer from "./routes/PipeLineComposer";
import UserPage from "./routes/OverviewPage";
import AdminPage from "./routes/AdminOverviewPage";
import AuthPage from "./components/LogIn/AuthPage";
import { loadState, saveState } from "./redux/browser-storage";
import { clearTickets } from "./redux/slices/currentSessionTicketSlice";

// Configure redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: loadState(),
})

// here we subscribe to the store changes
store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  () => saveState(store.getState())
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



const router = createBrowserRouter([
  {
    path: "/",  // Route for the AuthPage
    element: <AuthPage />,
  },
  {
    path: "/user",
    element: <UserPage/>,
  },
  {
    path: "/admin",
    element: <AdminPage/>,
  },
  {
    path: "/pipeline",
    element: <PipelineComposer/>,
  },
  
]);

function ClearTicketsOnLoad() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearTickets());  // Clear tickets on initial load
  }, [dispatch]);

  return null;
}

export default function App() {

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
