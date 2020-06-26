import React from 'react';
// import axios from 'axios';
import MaterialIcon from 'material-icons-react';
import './report.scss';

import { Row, Col } from "react-bootstrap";
import { Search } from 'react-bootstrap-icons';

const txtFieldState = {
  value: "",
  valid: true,
  typeMismatch: false,
  errMsg: "" //this is where our error message gets across
};

const ErrorValidationLabel = ({ txtLbl }) => (
  <label htmlFor="" style={{ color: "red", float: "right", fontWeight: "bold" }}>
    {txtLbl}
  </label>
);

class ReportForm extends React.Component {

  constructor() {
    super();
    this.state = {
      name: { ...txtFieldState, fieldName: "Your Name", required: true, requiredTxt: "Name is required." },
      phone: { ...txtFieldState, fieldName: "Phone Number", required: false, requiredTxt: "Phone is required." },
      email: { ...txtFieldState, fieldName: "Email", required: true, requiredTxt: "Email is required", formatErrorTxt: "Incorrect email format" },
      message: { ...txtFieldState, fieldName: "Your Message", required: false, requiredTxt: "Message is required" },
      allFieldsValid: false,
      response: ''
    };
  }

  reduceFormValues = formElements => {
    const arrElements = Array.prototype.slice.call(formElements); //we convert elements/inputs into an array found inside form element

    //we need to extract specific properties in Constraint Validation API using this code snippet
    const formValues = arrElements
      .filter(elem => elem.name.length > 0)
      .map(x => {
        const { typeMismatch } = x.validity;
        const { name, type, value } = x;

        return {
          name,
          type,
          typeMismatch, //we use typeMismatch when format is incorrect(e.g. incorrect email)
          value,
          valid: x.checkValidity()
        };
      })
      .reduce((acc, currVal) => {
        //then we finally use reduce, ready to put it in our state
        const { value, valid, typeMismatch, type } = currVal;
        const { fieldName, requiredTxt, formatErrorTxt } = this.state[
          currVal.name
        ]; //get the rest of properties inside the state object

        //we'll need to map these properties back to state so we use reducer...
        acc[currVal.name] = {
          value,
          valid,
          typeMismatch,
          fieldName,
          requiredTxt,
          formatErrorTxt
        };

        return acc;
      }, {});

      return formValues;
    };


  checkAllFieldsValid = formValues => {
    return !Object.keys(formValues)
      .map(x => formValues[x])
      .some(field => !field.valid);
  };
  
  async withFetch(postData) {
          
    const res = await fetch('http://localhost:9000/api/send_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(res => res.text())          // convert to plain text
    .then(text =>         
        console.log(text)
    )    
   
    // const data = await res.json();
    // console.log('MAKES IT TO HERE');
    // this.setState({ response: data.message });    
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    //we need to extract specific properties in Constraint Validation API using this code snippet
    const formValues = this.reduceFormValues(form.elements);
    const allFieldsValid = this.checkAllFieldsValid(formValues);
    //note: put ajax calls here to persist the form inputs in the database.    
    // console.log('allFieldsValid='+allFieldsValid);
    
    if (allFieldsValid) {
      let postData = {}
      for (const [key, prop] of Object.entries(formValues)) {
        console.log(key+': '+prop.value);
        postData[key] = prop.value;
      }  
      // console.log(formData);
      try {

        const response = this.withFetch(postData);
        if (response.result == 'OK')
          this.setState({ response: 'Your message has been submitteed!'});
      } catch (err) {
        console.log('Error:', err);
      }  
    } 
    
    this.setState({ ...formValues, allFieldsValid });
  }

  render() {
        const { name, phone, email, message, allFieldsValid, response } = this.state;
    const successFormDisplay = allFieldsValid ? "block" : "none";
    const inputFormDisplay = !allFieldsValid ? "block" : "none";

    const renderEmailValidationError = email.valid ? (
      ""
    ) : (
      <ErrorValidationLabel
        txtLbl={email.typeMismatch ? email.formatErrorTxt : email.requiredTxt}
      />
    );
    const renderNameValidationError = name.valid ? (
      ""
    ) : (
      <ErrorValidationLabel txtLbl={name.requiredTxt} />
    );
    const renderPhoneValidationError = phone.valid ? (
      ""
    ) : (
      <ErrorValidationLabel txtLbl={phone.requiredTxt} />
    );
    const renderMessageValidationError = message.valid ? (
      ""
    ) : (
      <ErrorValidationLabel txtLbl={message.requiredTxt} />
    );

    return (
      <div className="App">
        <header className="">  
          <nav class="navbar navbar-default">
        
            <a class="navbar-brand mx-auto" href="#">
                <div className="Oval"></div>
            </a>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#"><MaterialIcon icon="search" size={40} color='rgb(241, 243, 245, 0.6)' /></a></li>
            </ul>
          </nav>        
        </header>
        <div className="container main-content">
          <div class="Green-Background"></div>
          <div class="Blue-Background"></div>
          <Row className="justify-content-md-center">
              <Col md="4">
                  <form className="" onSubmit={this.handleSubmit} noValidate>
                    <div className="Form-Wrapper">
                        <div className="Report-a-Problem">Report a Problem</div>
                      
                        <label>Your Name</label> {renderNameValidationError}                        
                        <input type="text" className="form-control Shape-All-Soft-Rounded Input" 
                        name="name" 
                        required
                        />
                        <label>Phone Number</label> {renderPhoneValidationError}                       
                        <input type="text" className="form-control Shape-All-Soft-Rounded Input" 
                        name="phone"
                        required
                         />
                        <label>Email</label> {renderEmailValidationError}                       
                        <input type="email" className="form-control Shape-All-Soft-Rounded Input" 
                        name="email"
                        required
                         />
                        <label>Your Message</label> {renderMessageValidationError}                       
                        <textarea className="form-control Shape-All-Soft-Rounded Message" 
                        name="message"
                        required
                         >                    
                        </textarea>
                        <button className="Submit-Button btn-block"></button>
                        <div className="success">{ response }</div>
                    </div>
                  </form>
              </Col>
          </Row>              
        </div>
        <footer className="">
          <Row className="justify-content-md-center">
            <Col md="4">
                <ul className="no-style social-media">
                  <li className="item"><a className="icon twitter" href="#"></a></li>
                  <li className="item"><a className="icon linked-in" href="#"></a></li>
                  <li className="item"><a className="icon instagram" href="#"></a></li>
                </ul>
            </Col>
          </Row>          
          <Row>
              <Col md="4" xs="6">
                  <ul className="no-style">
                    <li className="buffer">
                      <a className="links links-left" href="#">Claim Your Venue</a>
                    </li>
                    <li className="buffer">
                      <a className="links links-left" href="#">Venue Log in</a>
                    </li>
                  </ul>
              </Col>
              <Col md="4" xs="6">
              <ul className="no-style">
                    <li className="buffer">
                      <a className="links links-right" href="#">Terms and Condition</a>
                    </li>
                    <li className="buffer">
                      <a className="links links-right" href="#">Privacy Policy</a>
                    </li>
                  </ul>              
              </Col>
              <Col md="4" className="d-flex justify-content-center">   
                  <div className="wrapper">
                      <div class="State Shape-All-Soft-Rounded">
                          <div className="Default">Default</div>
                      </div>
                  </div>
              </Col>
          </Row>
        </footer>
      </div>
    );
  }

}

export default ReportForm;
