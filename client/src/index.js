import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto";
import "./styles/index.css";

ReactDOM.render(  
    <AuthProvider>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>,
  document.getElementById("root")
);
