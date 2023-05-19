import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinner-material';
// import url from '../utility/url';
import {toastError,toastSuccess} from '../utility/toaster'
import { ToastContainer} from 'react-toastify';
import TokenCheck from '../utility/tokenCheck';


export default function Register() {
    const obj = {
        email:'',
        username: '',
        password: '',
    }
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        if(TokenCheck())
             navigate('/diabetes')
     }, [])
    async function registerUser(values) {
        var data;
        try {
            setLoading(true);
            data = await axios.post(`/nonauth/create`, values);
            if (data.status === 201) {
                setLoading(false);
                toastSuccess("Registartion success...please wait redirecting to login page");
                setTimeout(() => {
                    navigate("/");
                }, 2000)

            }
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            try {
                if(e.response.status===422)
                    toastError("Some fields might be missing");
                else
                    toastError(e.response.data.message)
            }
            catch (e) {
                alert('something went wrong..please refresh the page');
            }
        }
    }

    return (
        <Formik
            initialValues={obj}
            onSubmit={(values) => {
                // console.log(values);
                registerUser(values);

            }}
            validate={(values) => {
                const errors = {};
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!values.email) errors.email = "This field is required";
                else if (!values.email.match(mailformat)) errors.email = "Enter valid email";
                if (!values.username.trim()) errors.username = "This field is required";
                else if (values.username.trim().length < 3) errors.username = "Username should be at least 3 characters";
                if (!values.password.trim()) errors.password = "This field is required";
                return errors;
            }}
        >
            {({ values, errors, touched }) =>
                <div className="form">
                    <Form className="row g-3" noValidate>
                    <div className="col-12">
                            <label For="email" className="form-label">Email:</label>
                            <Field type="text" className={"form-control" + (touched.email && errors.email ? " is-invalid" : "")} id="email" name="email" placeholder="Enter Email"></Field>
                            <ErrorMessage
                                component="span"
                                name="email"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <label For="username" className="form-label">Username:</label>
                            <Field type="text" className={"form-control" + (touched.username && errors.username ? " is-invalid" : "")} id="username" name="username" placeholder="Enter Username"></Field>
                            <ErrorMessage
                                component="span"
                                name="username"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            <label For="password" className="form-label">Password:</label>
                            <Field type="password" className={"form-control" + (touched.password && errors.password ? " is-invalid" : "")} id="password" name="password" placeholder="Enter password"></Field>
                            <ErrorMessage
                                component="span"
                                name="password"
                                className="text-danger"
                            />
                        </div>
                        <div className="col-12">
                            {!loading && <button className="btn btn-primary" type="submit">Register</button>}
                            {loading && <button className="btn btn-primary" disabled>
                                <Spinner />
                            </button>}
                        </div>
                    </Form>
                    <ToastContainer />
                </div>
            }
        </Formik>
    )
}
