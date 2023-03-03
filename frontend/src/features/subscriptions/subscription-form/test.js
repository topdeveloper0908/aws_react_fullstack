import React, { useState, useEffect } from "react";

const Design1 = () => {
  const initialvalues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialvalues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues,'tayayayyayayayayyayayyayayayayyayayaya');
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regexp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{4,12}$/;
    const regexe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regexe.test(values.email)) {
      errors.email = "This is not Valid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (!regexp.test(values.password)) {
      errors.password =
        "passsword must contain atleast one uppercase,lowercase,number,special character";
    } else if (values.password.length < 4) {
      errors.password = "Password must me more than 4 characters";
    } else if (values.password.length > 6) {
      errors.password = "Password cannot be more than 6 characters";
    }
    return errors;
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="yourmail@example.com"
                  name="email"
                  type="text"
                  value={formValues.email}
                  onChange={handleChange}
                />
                {/* //this is the part I have used the error message */}
                <p>{formErrors.email}</p>
              </div>

              <button className="btn btn-lg btn-success" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Design1;
// So what i want is basically the input field itself should show the error according to the regex instead of using a state and displaying the erro
