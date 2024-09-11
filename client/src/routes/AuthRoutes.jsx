import { Route } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import FieldList from "../pages/FieldList";
import FieldDetail from "../pages/FieldDetail";
import Profile from "../pages/Profile";

const AuthRoutes = [
    <Route key="field-list" path="/" element={<AuthGuard component={<FieldList />} />} />,
    <Route key="field-detail" path="/field/:id" element={<AuthGuard component={<FieldDetail />} />} />,
    <Route key="profile" path="/profile" element={<AuthGuard component={<Profile />} />} />,
]

export default AuthRoutes;
