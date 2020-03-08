import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


import MessagesComponent from './MessagesComponent'
import UsersListComponent from './UsersListComponent'
import { 
  sendMessage,
  subscribeToUserInfo,
  requestToChangeNickName,
  subscribeNickNameChangeFailed,
  requestToChangeColor,
  checkIfUserExists } from './api'

import { withCookies, Cookies } from 'react-cookie'
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    const { cookies } = props;
    this.state = {
      message: "",
      username: cookies.get('username') || "",
      clientID: cookies.get('clientID') || -1,
      color: cookies.get('usercolor') || "#FFFFFF",

      showNameChangeFailed: false,
      nameChangeFailedReason: "",
      
      showColorChangeFailed: false,
      invalidSlashCommand: false
    }
  }

  componentDidMount() {
    const { cookies } = this.props;
    
    checkIfUserExists({
      username: this.state.username,
      clientID: this.state.clientID
    })

    subscribeToUserInfo((err, userInfo) => {
      this.setState({ username: userInfo.username,
                      color: "#" + userInfo.color,
                      clientID: userInfo.userID })
      cookies.set('username', userInfo.username, {path: '/'})
      cookies.set('usercolor', userInfo.color, { path: '/' })
      cookies.set('clientID', userInfo.userID, {path: '/'})
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
      let slashCommandRegex = /^\/(.*)/
      let slashCommandRegexArray = slashCommandRegex.exec(this.state.message)

      if(slashCommandRegexArray !== null) {
        let nickChangeRegex = /^\/nick (.*)/
        let nickChangeRegexArray = nickChangeRegex.exec(this.state.message)
  
        let nickChangeColorRegex = /^\/(nickcolor) (.*)/
        let nickChangeColorRegexArray = nickChangeColorRegex.exec(this.state.message)
        
        if(nickChangeRegexArray !== null) {
          requestToChangeNickName(nickChangeRegexArray[1])
        } else if (nickChangeColorRegexArray !== null) {
          let hexCodeRegex = /^([A-Fa-f0-9]{6})/
          let hexCodeRegexArray = hexCodeRegex.exec(nickChangeColorRegexArray[2])
  
          if (hexCodeRegexArray !== null) {
            requestToChangeColor(hexCodeRegexArray[0])
          } else {
            this.setState({ showColorChangeFailed: true })
          }
        } else {
          this.setState({ invalidSlashCommand: true })
        }
      }
      else {
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

  handleColorChangeFailedAlertClose() {
    this.setState({
      showColorChangeFailed: false,
    })
  }

  handleInvalidSlashCommandAlertClose() {
    this.setState({
      invalidSlashCommand: false,
    })
  }
  
  render() {
    return (
      <div className="App">
        <div className="chatbox">
          <MessagesComponent username={this.state.username} clientID={this.state.clientID}/>
          <UsersListComponent/>
          <div className="userInput">
            <TextField 
              style={{width: "100%"}}
              label="Message"
              variant="outlined"
              value={this.state.message}
              onKeyPress={(evt) => this.onKeyPress(evt)}
              onChange={(evt) => this.onMessageChange(evt)}/>
          </div>
          <div className="alerts">
            <Collapse in={this.state.showNameChangeFailed}>
              <Alert severity="error" onClose= {() => this.handleNameChangeFailedAlertClose()}>
                Name Change Failed: {this.state.nameChangeFailedReason}
              </Alert>
            </Collapse>
            <Collapse in={this.state.showColorChangeFailed}>
              <Alert severity="error" onClose={() => this.handleColorChangeFailedAlertClose()}>
                Color Change Failed: Command Format: /nickcolor RRGGBB
              </Alert>
            </Collapse>
            <Collapse in={this.state.invalidSlashCommand}>
              <Alert severity="error" onClose={() => this.handleInvalidSlashCommandAlertClose()}>
                Invalid Slash Command
              </Alert>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(App);
