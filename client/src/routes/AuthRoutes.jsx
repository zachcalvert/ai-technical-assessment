import { Route } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import FieldList from "../pages/FieldList";
import FieldDetail from "../pages/FieldDetail";

const AuthRoutes = [
    <Route key="field-list" path="/" element={<AuthGuard component={<FieldList />} />} />,
    <Route key="field-detail" path="/fields/:id" element={<AuthGuard component={<FieldDetail />} />} />,
]

export default AuthRoutes;
