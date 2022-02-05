import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { API_URL } from "../globalConstants";
import { useHistory } from "react-router-dom";

export function SendMail() {
  // TO GIVE ERROR FOR MAIL VALIDATION FAILED:
  const [mailfailed, setMailFailed] = useState(false);

  // TO HIDE THE POPUP:
  const [popup, setPopup] = useState(false);

  const successStyles = {
    height: popup ? "75px" : "0px",
  };

  const FailureStyles = {
    height: mailfailed ? "75px" : "0px",
  };

  const LoginStyles = {
    margin: popup || mailfailed ? "40px 0px" : "0px 0px",
  };

  const history = useHistory();

  async function userLogin(userInfo) {
    const response = await fetch(`${API_URL}/send-mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    if (!data.Access) {
      setMailFailed(true);
      setTimeout(() => {
        setMailFailed(false);
      }, 3000);
      return;
    }

    setPopup(true);
    setTimeout(() => setPopup(false), 5000);
    setTimeout(() => history.push("/"), 5700);
  }

  // VALIDATIONS
  const formValidationSchema = yup.object({
    email: yup
      .string()
      .required("Please provide your E-mail")
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email pattern doesn't match"
      ),
  });

  const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        email: "ragavinrap@gmail.com",
      },
      validationSchema: formValidationSchema,

      onSubmit: (userInfo) => {
        userLogin(userInfo);
      },
    });

  return (
    <section className="mainContainer">
      <article style={successStyles} className="rstPwdPopUpCtnr">
        {popup ? (
          <p className="rstPwdPopUp">
            CHECk YOUR E-MAIL FOR PASSWORD RESET LINK. YOU WILL NOW BE
            REDIRECTED TO LOGIN PAGE
          </p>
        ) : (
          ""
        )}
      </article>

      <article style={FailureStyles} className="rstPwdPopUpCtnr">
        {mailfailed ? (
          <p className="rstPwdPopUp">
            CHECK YOUR E-MAIL, USER DOESN'T EXIST WITH THAT E-MAIL
          </p>
        ) : (
          ""
        )}
      </article>

      <section style={LoginStyles} className="login">
        <article>
          <img
            src="https://image.shutterstock.com/z/stock-vector-concept-sign-in-page-on-mobile-screen-desktop-computer-with-login-form-and-sign-in-button-for-web-1145292776.jpg"
            alt="send mail page"
          />
          <form onSubmit={handleSubmit}>
            <TextField
              className="input"
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              type={"text"}
              value={values.email}
              label="email"
              variant="outlined"
              placeholder="Enter your E-mail"
              helperText={errors.email && touched.email && errors.email}
              error={errors.email && touched.email}
            />

            <Button type="submit" variant="contained">
              RESET PASSWORD
            </Button>
          </form>
        </article>
      </section>
    </section>
  );
}
