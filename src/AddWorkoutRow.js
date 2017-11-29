import React, { Component } from 'react';
import { Button, ButtonGroup, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import moment from 'moment';
import { validate } from './functions';
import './AddWorkoutRow.css';

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
          value: "1",
          valid: 'success'
        }
      },
      valid: false,
      saving: false
    }
  } 

  change(field, type, e) {
    const updater = {
      fields: this.state.fields,
      valid: false
    };
    updater.fields[field] = {
      value: e.currentTarget.value,
      valid: validate(type, e.currentTarget.value)
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
    this.setState({
      saving: true
    });
    const postJSON = {};
    postJSON.name = this.state.fields.name.value;
    postJSON.reps = parseInt(this.state.fields.reps.value);
    postJSON.weight = parseInt(this.state.fields.weight.value);
    postJSON.date = moment(this.state.fields.date.value, [moment.ISO_8601, 'MM/DD/YYYY']).toDate();
    postJSON.lbs = this.state.fields.lbs.value === '1' ? true : false;
    
    fetch('/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postJSON)
    }).then((res) => {
      this.setState({saving: false});
      if(res.status >= 200 && res.status < 300) {
        this.props.update();
        this.props.alert("success", "Workout added!", 5000);
        this.setState({
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
              value: "1",
              valid: 'success'
            }
          },
          valid: false
        });
        return;
      }
      const error = new Error(res.statusText)
      error.response = res
      throw error
    }).catch((err) => {
      this.props.alert("danger", `Add workout failed: ${err}`);
    })
  }

  render() {
    return(
      <tr className="AddWorkoutRow" key="newRow">
        <td>
          <ButtonGroup justified>
            <ButtonGroup>
              <Button bsStyle='primary' disabled={(!this.state.valid) || this.state.saving} onClick={() => this.insert()}>
                { 
                  this.state.saving ? (
                    <span><i class="fa fa-pulse fa-spinner fa-fw"/> Saving...</span>
                  ) : (
                    <span>Add Workout</span>                    
                  )
                }
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </td>
        <td>
          <FormGroup
            controlId="name"
            validationState={this.state.fields.name.valid}
          >
            <FormControl
              type="text"
              value={this.state.fields.name.value}
              onChange={(e) => {this.change('name', 'string', e)}}
            />
            <FormControl.Feedback />
            {
              this.state.fields.name.valid === 'error' && (
                <HelpBlock>Required.</HelpBlock>
              ) 
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="date"
            validationState={this.state.fields.date.valid}    
          >
            <FormControl
              type="date"
              value={this.state.fields.date.value}
              onChange={(e) => {this.change('date', 'date', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.fields.date.valid === 'error' && (
                <HelpBlock>Invalid date.</HelpBlock>                                                
              )
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="reps"
            validationState={this.state.fields.reps.valid}    
          >
            <FormControl
              type="number"
              value={this.state.fields.reps.value}
              onChange={(e) => {this.change('reps', 'number', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.fields.reps.valid === 'error' && (
                <HelpBlock>Invalid number.</HelpBlock>                                                
              )
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="weight"
            validationState={this.state.fields.weight.valid}    
          >
            <FormControl
              type="number"
              value={this.state.fields.weight.value}
              onChange={(e) => {this.change('weight', 'number', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.fields.weight.valid === 'error' && (
                <HelpBlock>Invalid number.</HelpBlock>                                                
              )
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="lbs"
          >
            <FormControl 
              componentClass="select" 
              value={this.state.fields.lbs.value}
              onChange={(e) => {this.change('lbs', 'string', e); }}
            >
              <option value="1">lbs</option>
              <option value="0">kgs</option>
            </FormControl>
          </FormGroup>
        </td>
      </tr>
    )
  }
}

export default AddWorkout;