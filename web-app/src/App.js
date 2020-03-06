import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


import MessagesComponent from './MessagesComponent'
import UsersListComponent from './UsersListComponent'
import { sendMessage, subscribeToUserInfo, requestToChangeNickName, subscribeNickNameChangeFailed } from './api'

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: "",
      username: "",
      color: "#FFFFFF",

      showNameChangeFailed: false
    }
  }

  componentDidMount() {
    subscribeToUserInfo((err, userInfo) => {
      this.setState({ username: userInfo.username,
                      color: "#" + userInfo.color })
    })

    subscribeNickNameChangeFailed((reason) => {
      this.setState({
          nameChangeFailedReason: reason,
          showNameChangeFailed: true
        })
    })
  }

  onMessageChange(evt) {
    this.setState(
      {message: evt.target.value}
    )
  }

  onKeyPress(evt) {
    if(evt.key === "Enter") {
      let nickChangeRegex = /^\/nick (.*)/
      let nickChangeRegexArray = nickChangeRegex.exec(this.state.message)
      
      if(nickChangeRegexArray !== null) {
        requestToChangeNickName(nickChangeRegexArray[1])
      } else {
        sendMessage({
          message: this.state.message,
          username: this.state.username,
          color: this.state.color,
        })
      }

      this.setState({message: ""})
    }
  }

  handleNameChangeFailedAlertClose() {
    this.setState({
      showNameChangeFailed: false,
      nameChangeFailedReason: ""
    })
  }
  
  render() {
    return (
      <div className="App">
        <div className="chatbox">
          <MessagesComponent username={this.state.username}/>
          <UsersListComponent/>
          <TextField 
            className="userInput"
            label="Message"
            variant="outlined"
            value={this.state.message}
            onKeyPress={(evt) => this.onKeyPress(evt)}
            onChange={(evt) => this.onMessageChange(evt)}/>

          <Collapse in={this.state.showNameChangeFailed}>
            <Alert severity="error" onClose= {() => this.handleNameChangeFailedAlertClose()}>
              Name Change Failed: {this.state.nameChangeFailedReason}
            </Alert>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default App;
