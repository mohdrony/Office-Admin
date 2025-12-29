import { Outlet } from "react-router-dom";
import "./authLayout.scss";

export default function AuthLayout() {
  return (
    <div className="authLayout">
      <div className="authCard">
        <Outlet />
      </div>
    </div>
  );
}
