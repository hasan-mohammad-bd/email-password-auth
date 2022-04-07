import "./App.css";
import app from "./firebase.init";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  //this event handler will work when submit button is clicked.
  const handleFormSubmit = (event) => {
    //to show error for invalid email
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/.test(password)) {
      setError(
        "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
      );
      return;
    }

    setValidated(true);
    setError("");

    //send data to firebase
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result;
        console.log(user);
      })
      .catch(error => {
        console.error(error)
        setError(error.message)
      })
    } 
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail()
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
      // console.log("form submitted", email,password);
      // to prevent reload
      event.preventDefault();
    }


  };
  const handlePasswordReset = () =>{
    sendPasswordResetEmail(auth,email)
    .then(()=>{
      console.log("email sent");
    })
  }

  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log("email verification sent");
    })
  }

  const handleRegisteredChange = (event) => {
    setRegistered(event.target.value);
  };

  return (
    <div className="App">
      <div className="registration w-50  mx-auto mt-5">
        <h2>Please {registered ? "login" : "Register"}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already registered?"
            />
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="link"> Forget password</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
