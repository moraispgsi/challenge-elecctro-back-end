import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeTask, editTask, markTask, unmarkTask } from '../actions/TaskActions'
import { hideSettings } from '../actions/SettingsActions'
import cross from '../img/cross.svg'


class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      textValue: this.props.text
    }
  }

  _handleClick() {
    this.props.marked ?
      this.props.unmarkTask(this.props.id) : this.props.markTask(this.props.id);
  }

  renderText() {
    return !this.state.isEditing ? this.props.text :
      <input className="task-editing-input"
             value={this.state.textValue}
             autoFocus
             onChange={(e) => this.setState({textValue: e.target.value })}
             onBlur={() => {
               if(this.state.textValue.length === 0) {
                 this.props.removeTask(this.props.id);
               } else if(this.state.textValue !== this.props.text) {
                 this.props.editTask(this.props.id, this.state.textValue);
               }
               this.setState({isEditing: false});
             }}
             onKeyPress={(e) => {
               if (e.key === 'Enter') {
                 e.target.blur();
               }
             }}
             type="text" />
  }

  render() {
    return (
      <li
        className="task"
        autoFocus
        onClick={() => this.props.hideSettings()}
        style={{
          textDecoration: this.props.marked ? 'line-through' : 'none'
        }}
        >
        <label className="checkbox-container">
          <input className="checkbox"
                 type="checkbox"
                 checked={this.props.marked}
                 onClick={this._handleClick.bind(this)}/>
          <span className="checkbox-checkmark"/>
        </label>
        <span className="task-text" onClick={() => {
          this.props.hideSettings()
          this.setState({isEditing: true})
          }}>
        {this.renderText()}
        </span>
        <div className="cross-container">
        {
          this.state.isEditing ?
            <img className="task-cross"
                 src={cross}
                 style={{display:'block'}}
                 onClick={()=>this.props.removeTask(this.props.id)} />
            : <img className="task-cross"
                   src={cross}
                   onClick={()=>this.props.removeTask(this.props.id)} />
        }
        </div>
      </li>
    )
  }
}

Task.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  marked: PropTypes.bool
};

//Mapping the dispatcher to prop functions(actions)
const mapDispatchToProps = (dispatch, ownProps) => ({
  removeTask: (id) => dispatch (removeTask(id)),
  editTask: (id, text) => dispatch (editTask(id, text)),
  markTask: (id) => dispatch (markTask(id)),
  unmarkTask: (id) => dispatch (unmarkTask(id)),
  hideSettings: () => dispatch (hideSettings())
});

export default connect(null, mapDispatchToProps)(Task);
