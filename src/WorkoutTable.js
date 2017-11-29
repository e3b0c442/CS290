import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import WorkoutRow from './WorkoutRow';
import AddWorkoutRow from './AddWorkoutRow';

class WorkoutTable extends Component {

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th className="col-xs-2"></th>
            <th className="col-xs-3">Name</th>
            <th className="col-xs-2">Date</th>
            <th className="col-xs-2">Reps</th>
            <th className="col-xs-2">Weight</th>
            <th className="col-xs-1">Units</th>
          </tr>
        </thead>
        <tbody>
          <AddWorkoutRow update={this.props.update} alert={this.props.alert}/>
          {
            this.props.workouts.map((v) => {
              return(
                <WorkoutRow workout={v} update={this.props.update} alert={this.props.alert}/>
              );
            })
          }
        </tbody>
      </Table>
    );
  }
}

export default WorkoutTable;