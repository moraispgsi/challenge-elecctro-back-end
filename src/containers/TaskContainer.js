import React, { Component } from 'react'
import TaskInput from '../components/TaskInput'
import TaskList from '../containers/TaskList'
import settingIcon from '../img/settings.png'
import Settings from '../components/Settings'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { showSettings, hideSettings } from '../actions/SettingsActions'

class TaskContainer extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div id="main-task-container">
        <div id="task-input-container">
          <TaskInput />
          <img id="setting-button"
               src={settingIcon}
               onClick={(e) => {
                 this.props.showingSettings ? this.props.hideSettings() : this.props.showSettings();
                 e.stopPropagation();
               }} />
          {
            !this.props.showingSettings ? null :
              <Settings />
          }
        </div>
        <div id="task-list-container">
          <TaskList />
        </div>
      </div>
      );
  }
}

TaskContainer.propTypes = {
  showingSettings: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  showingSettings: state.settings.get('showingSettings')
});

//Mapping the dispatcher to prop functions(actions)
const mapDispatchToProps = (dispatch, ownProps) => ({
  showSettings: () => dispatch (showSettings()),
  hideSettings: () => dispatch (hideSettings())
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer);
