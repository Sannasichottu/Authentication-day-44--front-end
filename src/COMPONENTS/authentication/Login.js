import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { API_URL } from "../globalConstants";

export function Login() {
  const history = useHistory();

  // TO GIVE ERROR WHEN CREDENTIALS IS INVALID:
  const [loginError, setLoginError] = useState(false);

  // TO SHOW ANIMATION UNTIL AUTHENTICATION PROCESS IS COMPLETED IN THE BACK END:
  const [anim, setAnim] = useState(false);

  // TO GIVE ERROR FOR TOKEN EXPIRATION:
  const isTokenExpired = localStorage.getItem("IsTokenExpired");
  const [tknExp, setTknExp] = useState(isTokenExpired);

  useEffect(() => {
    if (tknExp) {
      setTimeout(() => {
        localStorage.removeItem("IsTokenExpired");
        setTknExp(false);
      }, 3000);
    }
  });

  // CHECKING THE SERVER STORAGE TO VERIFY THE CREDENTIALS
  async function userLogin(userInfo) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    const data = await response.json();

    if (data.Access) {
      localStorage.setItem("Token", data.token);
      history.push("/home");
      return;
    }
    setLoginError(true);
  }

  // VALIDATIONS
  const formValidationSchema = yup.object({
    username: yup.string().required("Please give your username"),
    password: yup.string().required("Please provide password"),
  });

  const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        username: "Ragav1196",
        password: "Ragav123@",
      },
      validationSchema: formValidationSchema,

      onSubmit: (userInfo) => {
        userLogin(userInfo);
        setAnim(true);
      },
    });

  return (
    <section onClick={() => setLoginError(false)}>
      <div className="tokenExpPopupCntr">
        {tknExp ? (
          <p className="tokenExpPopup">SESSION EXPIRED. RETRY PASSWORD RESET</p>
        ) : (
          ""
        )}
      </div>

      <section className="login">
        {!anim ? (
          <article>
            <img
              src="https://image.shutterstock.com/z/stock-vector-concept-sign-in-page-on-mobile-screen-desktop-computer-with-login-form-and-sign-in-button-for-web-1145292776.jpg"
              alt="Login page"
            />
            <form onSubmit={handleSubmit}>
              {loginError ? (
                <p className="signInError">INVALID CREDENTIALS</p>
              ) : (
                ""
              )}
              <TextField
                className="input"
                onChange={handleChange}
                onBlur={handleBlur}
                name="username"
                type={"text"}
                value={values.username}
                label="userName"
                variant="outlined"
                placeholder="Enter your username"
                helperText={
                  errors.username && touched.username && errors.username
                }
                error={errors.username && touched.username}
              />
              <br />
              <TextField
                className="input"
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                type={"password"}
                value={values.password}
                label="Password"
                variant="outlined"
                placeholder="Enter your password"
                helperText={
                  errors.password && touched.password && errors.password
                }
                error={errors.password && touched.password}
              />
              <p
                onClick={() => history.push("/send-mail")}
                className="forgotPwd"
              >
                Forgot password ?
              </p>
              <Button type="submit" variant="contained">
                SIGN IN
              </Button>

              <div className="signUpCntr">
                <p className="signUp">
                  Dont have an account?{" "}
                  <span onClick={() => history.push("/register")}>Sign up</span>
                </p>
              </div>
            </form>
          </article>
        ) : (
          <img
            className="loading"
            src="https://thumbs.gfycat.com/UnhappyEnchantedBellsnake.webp"
            alt="loading"
          />
        )}
      </section>
    </section>
  );
}
