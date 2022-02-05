import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { API_URL } from "../globalConstants";
import { useHistory, useParams } from "react-router-dom";

export function ResetPassword() {
  const history = useHistory();

  // TO HIDE THE POPUP:
  const [popup, setPopup] = useState(false);
  const styles = { height: popup ? "56px" : "0px" };
  const LoginStyles = {
    margin: popup ? "40px 0px" : "0px 0px",
  };
  const { token, id } = useParams();

  useEffect(() => {
    async function VerifyToken() {
      const IsVerified = await fetch(
        `${API_URL}/reset-password/${id}/${token}`
      );
      const data = await IsVerified.json();

      if (!data.Access) {
        localStorage.setItem("IsTokenExpired", true);
        history.push("/");
        return;
      }
    }
    VerifyToken();
  }, [id, history, token]);

  async function userLogin(userInfo) {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    const data = await response.json();

    if (!data.Access) {
      localStorage.setItem("IsTokenExpired", true);
      return history.push("/");
    }

    setPopup(true);
    setTimeout(() => setPopup(false), 4000);
    setTimeout(() => history.push("/"), 4700);
  }

  // VALIDATIONS
  const formValidationSchema = yup.object({
    password: yup
      .string()
      .required("Please provide password")
      .min(8, "Password must be longer")
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g,
        "Password pattern doesn't match"
      ),
  });

  const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        password: "",
      },
      validationSchema: formValidationSchema,

      onSubmit: (userInfo) => {
        userInfo.token = token;
        userInfo.id = id;
        userLogin(userInfo);
      },
    });

  return (
    <section className="mainContainer">
      <article style={styles} className="rstPwdPopUpCtnr">
        <p className="rstPwdPopUp">
          PASSWORD SUCCESSFULY UPDATED. YOU WILL BE REDIRECTED TO LOGIN PAGE
        </p>
      </article>
      <section style={LoginStyles} className="login">
        <article>
          <img
            src="https://image.shutterstock.com/z/stock-vector-concept-sign-in-page-on-mobile-screen-desktop-computer-with-login-form-and-sign-in-button-for-web-1145292776.jpg"
            alt="reset-password page"
          />
          <form onSubmit={handleSubmit}>
            <TextField
              className="input"
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              type="password"
              value={values.password}
              label="password"
              variant="outlined"
              placeholder="Enter your new password"
              helperText={
                errors.password && touched.password && errors.password
              }
              error={errors.password && touched.password}
            />
            <Button type="submit" variant="contained">
              UPDATE PASSWORD
            </Button>
          </form>
        </article>
      </section>
    </section>
  );
}
