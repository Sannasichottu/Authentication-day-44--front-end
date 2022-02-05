import { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { API_URL } from "./globalConstants";

export const ProtectedRoute = (props) => {
  const token = localStorage.getItem("Token");

  const history = useHistory();

  const [verify, setVerify] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/verify-login-token`, {
      method: "POST",
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.Access) {
          return history.push("/");
        }
        setVerify(true);
      });
  }, [history, token]);

  if (verify) {
    return <Route {...props} />;
  }
  return <></>;
};
