import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import { useNavigate } from 'react-router-dom';
// import { TokenCheck } from '../TokenCheck';
import { NavLink } from 'react-router-dom';
// import url from '../utility/url';
import { ToastContainer} from 'react-toastify';
import {toastError} from '../utility/toaster'
import 'react-toastify/dist/ReactToastify.css';
import TokenCheck from '../utility/tokenCheck';

// import dotenv from 'dotenv';

// dotenv.config();

function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
       if(TokenCheck())
            navigate('/diabetes')
    }, [])
    const userForm = {
        email: '',
        password: '',
    }
    async function authUser(values) {
        try {
            setLoading(true);
            const data = await axios.get(`/nonauth/check?email=${values.email}&password=${values.password}`);
            localStorage.setItem("token", data.data.auth_key);
            console.log("data res",data);
            navigate("/diabetes");
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            try{
                console.log(e);
            toastError(e.response.data.message);
            }
            catch (e) {
                alert("Something went wrong")
            }
        }
    }
    return (
        <>
            <Formik
                initialValues={
                    userForm
                }
                onSubmit={(values) => {
                    // console.log("1",values);
                    console.log(values);
                    authUser(values);

                }}
                validate={(values) => {
                    const errors = {};
                    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (!values.email.trim()) errors.email = "This field is required";
                    else if (!values.email.match(mailformat)) errors.email = "Enter valid email";
                    if (!values.password.trim()) errors.password = "This field is required";
                    return errors;

                }}
            >
                {({ values, touched, errors }) =>
                    <div className="form">
                        <Form className="row g-3 mx-auto" noValidate>
                            <div className="col-12">
                                <label For="email" className="form-label">Email:</label>
                                <Field type="text" className={"form-control" + (touched.email && errors.email ? " is-invalid" : "")} id="email" placeholder="Enter email" name="email" required />
                                <ErrorMessage
                                    component="span"
                                    name="email"
                                    className="text-danger"
                                />
                            </div>
                            <div className="col-12">
                                <label For="password" className="form-label">Password:</label>
                                <Field type="password" className={"form-control" + (touched.password && errors.password ? " is-invalid" : "")} placeholder="Enter password" name="password" id="password" required />
                                <ErrorMessage
                                    component="span"
                                    name="password"
                                    className="text-danger"
                                />
                            </div>
                            <div className="col-12">
                                {!loading && <button className="btn btn-primary" type="submit">Login</button>}
                                {loading && <button className="btn btn-primary" disabled>
                                    <Spinner />
                                </button>}
                            </div>
                        </Form>
                        <NavLink to="/register">
                            <span style={{ color: "blue" }}>Not a user?Register</span>
                        </NavLink>
                        <ToastContainer />
                    </div>
                }
            </Formik>
        </>

    )
}

export default Login
