import React from 'react'
import { useNavigate } from 'react-router-dom';
import TokenCheck from '../utility/tokenCheck';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Spinner from 'react-spinner-material';
import { ToastContainer } from 'react-toastify';
import { toastSuccess } from '../utility/toaster';
import predict from '../utility/apicall';

export default function Diabetes() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState("undecided");
  const navigate = useNavigate();
  async function getData(values) {
		setLoading(true);
		const res = await predict(values, `/auth/heart`);
		console.log("res123",res);
		if (res) {
			setResult(res.data.message);
			console.log("abc:",res.data.message)
			toastSuccess(res.data.message ? "You have a chance of having heart disease" : "You dont' have a chance of having heart disease");
		}
		setLoading(false);

	}
  let hform = {
    gender: "0",
    age: 1,
    cp: 1,//on scale of 4
    trestbps: 50,//<50
    chol: 1,// <=0
    fbs: "0",
    restecg: 0,//0,1,2
    thalach: 1,//<=0
    exang: "0",
    oldpeak: 1,//<0
    slope: 1,//0,1,2
    ca: 1,//0,1,2,3
    thal: 1,//0,1,2
  }
  React.useEffect(() => {
    if (!TokenCheck()) {
      navigate("/")
    }
    document.title = "Predict Heart"
  }, [])
  return (
    <>
      <Formik initialValues={hform}
        validate={(values) => {
          const errors = {};
          if(values.age==="") errors.age="This field is required"
          else if(values.age<=0) errors.age="Invalid input"
          if(values.cp==="" ) errors.cp="This field is required"
          else if(!(values.cp in [0,1,2,3])) errors.cp="Invalid input"
          if(values.trestbps==="") errors.trestbps="This field is required"
          else if(values.trestbps<50) errors.trestbps="Invalid input"
          if(values.chol==="") errors.chol="This field is required"
          else if(values.chol<1) errors.chol="Invalid input"
          if(values.restecg==="") errors.restecg="This field is required"
          else if(!(values.restecg in [0,1,2])) errors.restecg="Invalid input"
          if(values.thalach==="") errors.thalach="This field is required"
          else if(values.thalach<1) errors.thalach="Invalid input"
          if(values.oldpeak==="") errors.oldpeak="This field is required"
          else if(values.oldpeak<0 || values.oldpeak>6.2) errors.oldpeak="Invalid input"
          if(values.slope==="" ) errors.slope="This field is required"
          else if(!(values.slope in [0,1,2])) errors.slope="Invalid input"
          if(values.ca==="") errors.ca="This field is required"
          else if(!(values.ca in [0,1,2,3])) errors.ca="Invalid input"
          if(values.thal==="")  errors.thal="This field is required"
          else if(!(values.thal in [0,1,2,3])) errors.thal="Invalid input"
          return errors;
        }}
        onSubmit={(values)=>{
          console.log(values)
          let json={...values}
          for(let [k,v] of Object.entries(json))
            json[k]=Number(v)
          console.log(values)
          console.log(json)
          getData(json)
        }}
      >
        {({ values }) => 
        <>
        <Form>
          <label htmlFor="gender">Gender:</label>
          <Field name="gender" component="select" id="gender">
            <option value="1">Male</option>
            <option value="0">Female</option>
          </Field>
          <br /><br />
          <label htmlFor="age">Age:</label>
          <Field type="number" id="age" name="age" placeholder="Enter age" />
          <ErrorMessage
            component="span"
            name="age"
            className="text-danger"
          /><br /><br />
          <label htmlFor="restecg">Rest ECG:</label>
          <Field type="number" id="restecg" name="restecg" value={values.restecg}/>
          <ErrorMessage
            component="span"
            name="restecg"
            className="text-danger"
          /><br /><br />
          {/* <label htmlFor="restecg">Rest ECG:</label>
          <Field type="radio" name="restecg" id="restecg" value="1" />Yes<Field type="radio" name="restecg" id="restecg" value="0" />No<br /><br /> */}

          <label htmlFor="exang">Eng Angio:</label>
          <Field type="radio" id="exang" name="exang" value="1" />Yes<Field type="radio" name="exang" id="exang" value="0" />No<br /><br />

          <label htmlFor="fbs">Fbs:</label>
          <Field type="radio" name="fbs" id="fbs" value="1" />Yes<Field type="radio" name="fbs" id="fbs" value="0" />No<br /><br /><br />
          <div class="two-col">
            <div class="col1">
              <label htmlFor="cp">CP:</label>
              <Field id="cp" name="cp" type="number" />
              <ErrorMessage
                component="span"
                name="cp"
                className="text-danger"
              />
            </div>

            <div class="col2">
              <label htmlFor="trestbps">Trestbps:</label>
              <Field id="trestbps" name="trestbps" type="number" />
              <ErrorMessage
                component="span"
                name="trestbps"
                className="text-danger"
              />
            </div>
          </div>
          <div class="two-col">
            <div class="col1">
              <label htmlFor="chol">Cholestrol:</label>
              <Field id="chol" name="chol" type="number" />
              <ErrorMessage
                component="span"
                name="chol"
                className="text-danger"
              />
            </div>

            <div class="col2">
              <label htmlFor="thalach">Thalach:</label>
              <Field id="thalach" name="thalach" type="number" />
              <ErrorMessage
                component="span"
                name="thalach"
                className="text-danger"
              />
            </div>
          </div>
          <div class="two-col">
            <div class="col1">
              <label htmlFor="oldpeak">oldpeak:</label>
              <Field id="oldpeak" name="oldpeak" type="number" />
              <ErrorMessage
                component="span"
                name="oldpeak"
                className="text-danger"
              />
            </div>

            <div class="col2">
              <label htmlFor="slope">slope:</label>
              <Field id="slope" name="slope" type="number" />
              <ErrorMessage
                component="span"
                name="slope"
                className="text-danger"
              />
            </div>
          </div>
          <div class="two-col">
            <div class="col1">
              <label htmlFor="ca">CA:</label>
              <Field id="ca" name="ca" type="number" />
              <ErrorMessage
                component="span"
                name="ca"
                className="text-danger"
              />
            </div>

            <div class="col2">
              <label htmlFor="thal">Thal:</label>
              <Field id="thal" name="thal" type="number" />
              <ErrorMessage
                component="span"
                name="thal"
                className="text-danger"
              />
            </div>
          </div>
          <button type="submit" id="submit" disabled={loading ? true : false}>{loading ? <Spinner /> : "Predict"}</button>
        </Form>
        {result !== "undecided" && <p>{result ? "You have a chance of having heart disease" : "You don't have a chance of having heart disease"}</p>}
        <ToastContainer />
        </>
        }
      </Formik>
    </>
  )
}
