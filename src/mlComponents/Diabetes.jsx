import React from 'react'
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import url from '../utility/url'
import TokenCheck from '../utility/tokenCheck';
import Spinner from 'react-spinner-material';
import "./dstyles.css";
import predict from '../utility/apicall';
// import url from '../utility/url'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer } from 'react-toastify';
import { toastSuccess } from '../utility/toaster';


export default function Diabetes() {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [result, setResult] = React.useState("undecided");
	const dform = {
		gender: 1,
		age: 1,
		hypertension: '0',
		smoking: '0',
		heart_disease: '0',
		bmi: 0,//<=0
		HbA1c_level: 0,//<=0
		blood_glucose_level: 0 //
	}
	async function getData(values) {
		setLoading(true);
		const res = await predict(values, `/auth/diabetes`);
		console.log("res123",res);
		if (res) {
			setResult(res.data.message);
			console.log("abc:",res.data.message)
			toastSuccess(res.data.message ? "You have a chance of diabetes disease" : "You don't have a chance of diabetes disease");
		}
		setLoading(false);

	}
	React.useEffect(() => {
		if (!TokenCheck()) {
			navigate("/")
		}
		if (!window.location.hash) {
			window.location = window.location + '#landingpage';
			window.location.reload();
		}
		document.title = "Predict Diabetes"
	})
	return (
		<>
			<Formik
				initialValues={dform}
				className="dform"
				validate={(values) => {
					const errors = {};
					if (values.age === '') errors.age = "This field is required"
					else if (values.age < 1) errors.age = "Invalid input"
					if (values.bmi === '') errors.bmi = 'This field is required'
					else if (values.bmi <=0) errors.bmi = 'Invalid input'
					if (values.HbA1c_level === '') errors.HbA1c_level = 'This field is required';
					else if (values.HbA1c_level <=0) errors.HbA1c_level = "Invalid input"
					if (values.blood_glucose_level === '') errors.blood_glucose_level = 'This field is required';
					else if (values.blood_glucose_level <=0) errors.blood_glucose_level = 'Invalid input';
					// if (!values.email.trim()) errors.email = "This field is required";
					// if (!values.password.trim()) errors.password = "This field is required";
					console.log("erros:", errors);
					console.log("values:", values);
					return errors;

				}}
				onSubmit={(values) => {
					let json={...values};
					json.gender=Number(values.gender)
					json.hypertension = Number(values.hypertension)
					json.smoking = Number(values.smoking)
					json.heart_disease = Number(values.heart_disease)
					console.log("The submitted values are:", values)
					getData(json);
				}}
			>
				{({ errors, touched, values }) =>
					<>
						<Form noValidate>
							<label htmlFor="gender">Gender:</label>
							<Field name="gender" component="select" id="gender">
								<option value={1}>Male</option>
								<option value={0}>Female</option>
							</Field>
							<ErrorMessage
								component="span"
								className="text-danger"
								name="gender"
							/>
							<br /><br />
							<label htmlFor="age">Age:</label>
							<Field type="number" id="age" name="age" placeholder="Enter age" />
							<ErrorMessage
								component="span"
								name="age"
								className="text-danger"
							/><br /><br />
							<label htmlFor="hypertension">Hypertension:</label>
							<Field type="radio" name="hypertension" id="hypertension" value="1" />Yes<Field type="radio" name="hypertension" id="hypertension" value="0" />No<br /><br />
							<label htmlFor="smoking">Smoking:</label>
							<Field type="radio" name="smoking" id="smoking" value="1" />Yes<Field type="radio" name="smoking" id="smoking" value="0" />No<br /><br />
							<label htmlFor="heart_disease">Heart Disease:</label>
							<Field type="radio" name="heart_disease" id="heart_disease" value="1" />Yes<Field type="radio" name="heart_disease" id="heart_disease" value="0" />No<br /><br />
							<label htmlFor="bmi">BMI:</label>
							<Field type="number" id="bmi" name="bmi" step="0.01"/><br />
							<span> <button type='button' onClick={()=>window.open('https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm')}>
								click here to calculate BMI
							</button></span><br/>
							<ErrorMessage
								component="span"
								name="bmi"
								className="text-danger"
							/>
							<br /><br />
							<label htmlFor="HbA1c_level">HbA1c Level:</label>
							<Field type="number" id="HbA1c_level" name="HbA1c_level" step="0.01" /><br />
							<ErrorMessage
								component="span"
								name="HbA1c_level"
								className="text-danger"
							/>
							<br /><br />
							<label htmlFor="blood_glucose_level">Blood Glucose Level:</label>
							<Field type="number" id="blood_glucose_level" name="blood_glucose_level" step="0.01" /><br />
							<ErrorMessage
								component="span"
								name="blood_glucose_level"
								className="text-danger"
							/>
							<br /><br />
							<button type="submit" id="submit" disabled={loading ? true : false}>{loading ? <Spinner /> : "Predict"}</button>
						</Form>
						{result !== "undecided" && <p>{result ? "You have a chance of having diabetes" : "You don't have a chance of having diabetes"}</p>}
						<ToastContainer />
					</>
				}
			</Formik>
		</>
	)
}
