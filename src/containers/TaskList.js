import React, { Component } from 'react'
import { connect } from 'react-redux'
import Task from '../components/Task'
import { getVisibleTasks } from '../selectors/TasksSelector'

class TaskList extends Component {
  render() {
    return (
      <ul id="task-list">
        {this.props.tasks.toJS().map((task) => (
          <Task key={task.id}
                id={task.id}
                text={task.text}
                marked={task.marked}/>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  tasks: getVisibleTasks(state)
});

export default connect(mapStateToProps, null)(TaskList);
