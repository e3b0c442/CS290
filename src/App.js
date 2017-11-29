import React, { Component } from 'react';
import { Alert, PageHeader } from 'react-bootstrap';
import './App.css';
import WorkoutTable from './WorkoutTable';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      workouts: [],
      alert: {
        show: false
      }
    };
  }

  componentDidMount() {
    this.fetchWorkouts();
  }

  showAlert(style, text, timeout) {
    this.setState({
      alert: {
        show: true,
        text: text,
        style: style,
        timeout:
          timeout === undefined
            ? undefined
            : setTimeout(() => {
                this.hideAlert();
              }, timeout)
      }
    });
  }

  hideAlert() {
    if (this.state.alert.timeout !== undefined) {
      clearTimeout(this.state.alert.timeout);
    }
    this.setState({
      alert: {
        show: false
      }
    });
  }

  fetchWorkouts() {
    fetch('/workout')
      .then(res => {
        this.setState({
          loading: false
        });
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }
        const error = new Error(res.statusText);
        error.response = res;
        throw error;
      })
      .then(json => {
        this.setState({
          workouts: json
        });
      })
      .catch(ex => {
        this.showAlert('danger', `Error loading workout data: ${ex}`);
      });
  }

  rowAdded() {
    this.fetchWorkouts();
  }

  render() {
    return (
      <div className="App container">
        <PageHeader>Workout tracker</PageHeader>
        {this.state.alert.show && (
          <Alert
            bsStyle={this.state.alert.style}
            onDismiss={() => {
              this.hideAlert();
            }}
          >
            {this.state.alert.text}
          </Alert>
        )}
        {this.state.loading ? (
          <div>
            <h2>
              <i className="fa fa-spinner fa-pulse fa-lg fa-fw" />
              Loading...
            </h2>
          </div>
        ) : (
          <WorkoutTable
            alert={(s, t, o) => this.showAlert(s, t, o)}
            update={() => {
              this.fetchWorkouts();
            }}
            workouts={this.state.workouts}
          />
        )}
      </div>
    );
  }
}

export default App;
