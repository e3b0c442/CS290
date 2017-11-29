import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup, Button, ButtonGroup, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';

import moment from 'moment';
import { validate } from './functions';

import './WorkoutRow.css';

class WorkoutRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      saving: false,
      deleting: false,
      editor: {
        fields: {
          name: {
            value: props.workout.name,
            valid: 'success',
          },
          reps: {
            value: props.workout.reps,
            valid: 'success',
          },
          weight: {
            value: props.workout.weight,
            valid: 'success'
          },
          date: {
            value: moment(props.workout.date).format('YYYY-MM-DD'),
            valid: 'success'
          },
          lbs: {
            value: props.workout.lbs ? 'lbs' : 'kgs',
            valid: 'success'
          }
        },
        valid: false
      },
      workout: props.workout
    }
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing
    });
  }

  componentWillReceiveProps(props) {
    if(props.workout !== this.state.workout) {
      this.setState({
        workout: props.workout,
        editor: {
          fields: {
            name: {
              value: props.workout.name,
              valid: 'success',
            },
            reps: {
              value: props.workout.reps,
              valid: 'success',
            },
            weight: {
              value: props.workout.weight,
              valid: 'success'
            },
            date: {
              value: moment(props.workout.date).format('YYYY-MM-DD'),
              valid: 'success'
            },
            lbs: {
              value: props.workout.lbs,
              valid: 'success'
            }
          },
          valid: false
        },
        editing: false
      });
    }
  }

  change(field, type, e) {
    const newEditor = {
      fields: {
        name: Object.assign({}, this.state.editor.fields.name),
        reps: Object.assign({}, this.state.editor.fields.reps),
        weight: Object.assign({}, this.state.editor.fields.weight),
        date: Object.assign({}, this.state.editor.fields.date),        
        lbs: Object.assign({}, this.state.editor.fields.lbs),
      },
      valid: false
    };
    newEditor.fields[field] = {
      value: e.currentTarget.value,
      valid: validate(type, e.currentTarget.value)
    }
    if(newEditor.fields[field].valid === 'success') {
      newEditor.valid = true;
      for(const v in newEditor.fields) {
        if(newEditor.fields[v].valid !== 'success') {
          newEditor.valid = false;
          break;
        }
      }
    }

    this.setState({
      editor: newEditor
    });
  }

  update() {
    const postJSON = {};
    this.setState({saving: true});
    postJSON.name = this.state.editor.fields.name.value;
    postJSON.reps = parseInt(this.state.editor.fields.reps.value);
    postJSON.weight = parseInt(this.state.editor.fields.weight.value);
    postJSON.date = moment(this.state.editor.fields.date.value, [moment.ISO_8601, 'MM/DD/YYYY']).toDate();
    postJSON.lbs = this.state.editor.fields.lbs.value === '1' ? true : false;

    fetch(`/workout/${this.state.workout.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postJSON)
    }).then((res) => {
      this.setState({saving: false});
      if(res.status >= 200 && res.status < 300) {
        this.props.update();
        this.props.alert('success', 'Updated workout', 5000);
        return;
      }        
      const error = new Error(res.statusText)
      error.response = res
      throw error
    }).catch((err) => {
      this.props.alert('danger', `Unable to update workout: ${err}`);
    });
  }

  delete() {
    this.setState({deleting: true});
    fetch(`/workout/${this.state.workout.id}`, {
      method: 'DELETE'
    }).then((res) => {
      this.setState({deleting: false});
      if(res.status >= 200 && res.status < 300) {
        this.props.update();
        this.props.alert('info', 'Deleted workout', 5000);
        return;
      }
      const error = new Error(res.statusText)
      error.response = res
      throw error
    }).catch((err) => {
      this.props.alert('danger', `Unable to delete workout: ${err}`);
    })
  }

  render() {
    return this.state.editing ? (  
      <tr className="WorkoutRow" key={this.state.workout.id}>
        <td>
          <ButtonGroup justified>
            <ToggleButtonGroup type="checkbox">
              <ToggleButton value={1} checked={this.state.editing} onChange={() => this.toggleEditing()} bsStyle='warning'>Edit</ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup>
              <Button bsStyle='primary' disabled={(!this.state.editor.valid) || this.state.saving} onClick={() => this.update()}>
                {
                  this.state.saving ? (
                    <span><i class="fa fa-pulse fa-spinner fa-fw"/>Saving</span>
                  ) : (
                    <span>Save</span>
                  )
                }
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </td>
        <td>
          <FormGroup
            controlId="name"
            validationState={this.state.editor.fields.name.valid}
          >
            <FormControl
              type="text"
              value={this.state.editor.fields.name.value}
              onChange={(e) => {this.change('name', 'string', e)}}
            />
            <FormControl.Feedback />
            {
              this.state.editor.fields.name.valid === 'error' && (
                <HelpBlock>Name required</HelpBlock>
              ) 
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="date"
            validationState={this.state.editor.fields.date.valid}    
          >
            <FormControl
              type="date"
              value={this.state.editor.fields.date.value}
              onChange={(e) => {this.change('date', 'date', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.editor.fields.date.valid === 'error' && (
                <HelpBlock>Date field must be a valid date.</HelpBlock>                                                
              )
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="reps"
            validationState={this.state.editor.fields.reps.valid}    
          >
            <FormControl
              type="number"
              value={this.state.editor.fields.reps.value}
              onChange={(e) => {this.change('reps', 'number', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.editor.fields.reps.valid === 'error' && (
                <HelpBlock>Reps field must be a number.</HelpBlock>                                                
              )
            }
          </FormGroup>
        </td>
        <td>
          <FormGroup
            controlId="weight"
            validationState={this.state.editor.fields.weight.valid}    
          >
            <FormControl
              type="number"
              value={this.state.editor.fields.weight.value}
              onChange={(e) => {this.change('weight', 'number', e); }}
            />
            <FormControl.Feedback />
            {
              this.state.editor.fields.weight.valid === 'error' && (
                <HelpBlock>Weight field must be a number.</HelpBlock>                                                
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
              value={this.state.editor.fields.lbs.value}
              onChange={(e) => {this.change('lbs', 'string', e); }}
            >
              <option value="1">lbs</option>
              <option value="0">kgs</option>
            </FormControl>
          </FormGroup>
        </td>
      </tr>
    ) : (
      <tr className="WorkoutRow" key={this.state.workout.id}>
        <td>
          <ButtonGroup justified>
            <ToggleButtonGroup type="checkbox">
              <ToggleButton value={1} checked={this.state.editing} onChange={() => this.toggleEditing()} bsStyle='warning'>Edit</ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup>
              <Button bsStyle='danger' disabled={this.state.deleting} onClick={() => this.delete()}>
                {
                  this.state.deleting ? (
                    <span><i class="fa fa-pulse fa-spinner fa-fw"/> Deleting...</span>
                  ) : (
                    <span>Delete</span>
                  )
                }
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </td>
        <td>{this.state.workout.name}</td>
        <td>{moment(this.state.workout.date).format('L')}</td>
        <td>{this.state.workout.reps}</td>
        <td>{this.state.workout.weight}</td>
        <td>{this.state.workout.lbs ? 'lbs' : 'kgs'}</td>
      </tr>
    );
  }
}

export default WorkoutRow;