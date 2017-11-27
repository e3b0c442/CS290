import React, { Component } from 'react';
import { PageHeader, Panel } from 'react-bootstrap';
import './App.css';
import WorkoutTable from './WorkoutTable';
import AddWorkout from './AddWorkout';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      workouts: []
    };
  }

  componentDidMount() {
    this.fetchWorkouts();
  }

  fetchWorkouts() {
    fetch('http://localhost:3000/workout').then((res) => {
      if(res.status >= 200 && res.status < 300) {
          return res.json();
      }
    }).then((json) => {
        this.setState({workouts: json});
    }).catch((ex) => {
        console.log(ex);
    });
  }

  rowAdded() {
    this.fetchWorkouts();
  }

  render() {
    return (
      <div className="App container">
        <PageHeader>Workout tracker</PageHeader>
        <div class="row">
          <div class="col-xs-6 col-xs-offset-3">
            <Panel header={<h3>Add workout</h3>}>
              <AddWorkout added={() => {this.rowAdded()}}/>
            </Panel>
          </div>
        </div>
        <h3>Previous workouts</h3>
        <WorkoutTable workouts={this.state.workouts}/>
      </div>
    );
  }
}

export default App;
