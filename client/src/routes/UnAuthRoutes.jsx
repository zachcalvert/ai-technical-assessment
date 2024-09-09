import React from "react";
import { Route } from "react-router-dom";
import UnAuthGuard from "../guards/UnAuthGuard";
import Login from "../pages/Login";

const UnAuthRoutes = [
    <Route key="Login" path="/login" element={<UnAuthGuard component={<Login />} />} ></Route>,
]

export default UnAuthRoutes;
