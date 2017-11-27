import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import './WorkoutTable.css';

class WorkoutTable extends Component {

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th><th>Reps</th><th>Weight</th><th>Date</th><th>Units</th>
          </tr>
          {
            this.props.workouts.map((v, i) => {
              return(
                <tr key={v.id}>
                  <td>{v.name}</td><td>{v.reps}</td><td>{v.weight}</td><td>{v.date}</td><td>{v.units}</td>
                </tr>
              );
            })
          }
        </thead>
      </Table>
    );
  }
}

export default WorkoutTable;