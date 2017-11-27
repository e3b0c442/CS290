import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import moment from 'moment';

class AddWorkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        name: {
          value: "",
          valid: null
        },
        reps: {
          value: "",
          valid: null
        },
        weight: {
          value: "",
          valid: null
        },
        date: {
          value: "",
          valid: null
        },
        lbs: {
          value: "lbs",
          valid: 'success'
        }
      },
      valid: false
    }
  } 

  validate(type, value) {
    if(value.length < 1) {
      return 'error';
    }
    switch(type) {
      case "string":
        return 'success';
      case "number":
        if(isNaN(value)) {
          return 'error';
        }
        return 'success';
      case "date":
        const m = moment(value, [moment.ISO_8601, "MM/DD/YYYY"])
        if(!m.isValid()) {
          return 'error'
        }
        return 'success';
      default:
        return null;
    }
  }

  update(field, type, e) {
    const updater = {
      fields: this.state.fields,
      valid: false
    };
    updater.fields[field] = {
      value: e.currentTarget.value,
      valid: this.validate(type, e.currentTarget.value)
    };
    if(updater.fields[field].valid === 'success') {
      let flag = true
      for(const v in updater.fields) {
        if(updater.fields[v].valid !== 'success') {
          flag = false;
        }  
      }
      updater.valid = flag;
    } else {
      updater.valid = false;
    }
 
    this.setState(updater);
  }

  insert() {
    const postJSON = {}
    postJSON.name = this.state.fields.name.value;
    postJSON.reps = parseInt(this.state.fields.reps.value);
    postJSON.weight = parseInt(this.state.fields.weight.value);
    postJSON.date = moment(this.state.fields.date.value, [moment.ISO_8601, 'MM/DD/YYYY']).toDate();
    postJSON.lbs = this.state.fields.lbs.value === 'lbs' ? true : false;

    fetch('/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postJSON)
    }).then((resp) => {
      this.props.added();
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return(
      <Form>
        <div class="row">
          <div class="col-xs-12">
            <FormGroup
              controlId="name"
              validationState={this.state.fields.name.valid}    
            >
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.fields.name.value}
                placeholder="Your name"
                onChange={(e) => {this.update('name', 'string', e); }}
              />
              <FormControl.Feedback />
              {
                (this.state.fields.name.valid === 'error') ? (
                  <HelpBlock>Name field cannot be empty.</HelpBlock>                                                
                ) : (
                  <HelpBlock></HelpBlock>                            
                )
              }
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-6">
          <FormGroup
              controlId="reps"
              validationState={this.state.fields.reps.valid}    
            >
              <ControlLabel>Reps</ControlLabel>
              <FormControl
                type="number"
                value={this.state.fields.reps.value}
                placeholder="0"
                onChange={(e) => {this.update('reps', 'number', e); }}
              />
              <FormControl.Feedback />
              {
                (this.state.fields.reps.valid === 'error') ? (
                  <HelpBlock>Reps field must be a number.</HelpBlock>                                                
                ) : (
                  <HelpBlock></HelpBlock>                            
                )
              }
            </FormGroup>
          </div>
          <div class="col-xs-4">
            <FormGroup
              controlId="weight"
              validationState={this.state.fields.weight.valid}    
            >
              <ControlLabel>Weight</ControlLabel>
              <FormControl
                type="number"
                value={this.state.fields.weight.value}
                placeholder="0"
                onChange={(e) => {this.update('weight', 'number', e); }}
              />
              <FormControl.Feedback />
              {
                (this.state.fields.weight.valid === 'error') ? (
                  <HelpBlock>Weight field must be a number.</HelpBlock>                                                
                ) : (
                  <HelpBlock></HelpBlock>                            
                )
              }
            </FormGroup>
          </div>
          <div class="col-xs-2">
            <FormGroup
              controlId="lbs"
            >
              <ControlLabel>&nbsp;</ControlLabel>
              <FormControl 
                componentClass="select" 
                placeholder="select" 
                onChange={(e) => {this.update('lbs', 'string', e); }}
              >
                <option value="lbs">lbs</option>
                <option value="kgs">kgs</option>
              </FormControl>
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-8">
            <FormGroup
              controlId="date"
              validationState={this.state.fields.date.valid}    
            >
              <ControlLabel>Date</ControlLabel>
              <FormControl
                type="date"
                value={this.state.fields.date.value}
                placeholder="0"
                onChange={(e) => {this.update('date', 'date', e); }}
              />
              <FormControl.Feedback />
              {
                (this.state.fields.date.valid === 'error') ? (
                  <HelpBlock>Date field must be a valid date.</HelpBlock>                                                
                ) : (
                  <HelpBlock></HelpBlock>                            
                )
              }
            </FormGroup>
          </div>
          <div class="col-xs-4">
            <FormGroup
              controlId="add"
            >
              <ControlLabel>&nbsp;</ControlLabel>
              <Button 
                block 
                bsStyle="primary"
                disabled={!this.state.valid}
                onClick={() => this.insert()}
              >Add workout</Button>
            </FormGroup>
          </div>
        </div>
      </Form>
    )
  }
}

export default AddWorkout;