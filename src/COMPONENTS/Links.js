import { Switch, Route } from "react-router-dom";
import { Register } from "./authentication/Register";
import { Login } from "./authentication/Login";
import { SendMail } from "./authentication/SendMail";
import { Home } from "./Home";
import { ResetPassword } from "./authentication/ResetPassword";
import { ProtectedRoute } from "./ProtectedRoutes";

export function Links() {
  return (
    <Switch>
      {/* REGISTER */}
      <Route path="/register">
        <Register />
      </Route>

      {/* RESET PASSWORD */}
      <Route path="/send-mail">
        <SendMail />
      </Route>

      <Route exact path="/reset-password/:id/:token">
        <ResetPassword />
      </Route>

      {/* HOME */}
      <ProtectedRoute path="/home">
        <Home />
      </ProtectedRoute>

      {/* LOGIN */}
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  );
}
