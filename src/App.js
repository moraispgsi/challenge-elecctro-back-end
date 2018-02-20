import React, { Component } from 'react';
import TaskContainer from './containers/TaskContainer'
import './css/App.css';
import logo from './img/logo.png'
import { hideSettings } from "./actions/SettingsActions";
import { fetchTasks } from './actions/TaskActions'
import { connect } from 'react-redux'

class App extends Component {

  constructor(props) {
    super(props);
    this.props.fetchTasks();
  }

  render() {
    return (
      <div onClick={(e) => this.props.hideSettings()}>
        <img id="logo" src={logo} />
        <TaskContainer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideSettings: () => dispatch (hideSettings()),
  fetchTasks: () => dispatch(fetchTasks())
});

export default connect(null, mapDispatchToProps)(App);
