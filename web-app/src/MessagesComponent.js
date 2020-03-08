import React from 'react';
import './MessagesComponent.css';
import { subscribeToMessageList } from './api';

function Message(props) {

    let messageStyle = {
        'fontWeight': 'normal'
    }

    if (props.clientID === props.userID) {
        messageStyle = {
            'fontWeight': 'bold'
        }
    }
    return(
        <div style={{paddingLeft: "10px"}}>
            <span>
                {props.timestamp + " "}
                <span style={messageStyle}>
                    <span style={{color: props.color}}>
                        {props.username}:
                    </span> {props.message}
                </span>
            </span>
        </div>
    )
}

class MessagesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
        this.messagesEndRef = React.createRef();
    }
    
    componentDidMount() {
        subscribeToMessageList((err, messages) => {
            this.setState({ messages: messages }, () => { this.scrollToBottom() })
        })
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        return (
            <div className="messagesComponent">
                <span style={{paddingLeft: "5px"}}>Welcome, {this.props.username}!</span>
                <div className="messages overflow">
                    <div className="overflow">
                        {this.state.messages.map((message, index) => {
                            return (
                                <div key={index} >
                                    <Message
                                            timestamp={message.timestamp} 
                                            username={message.username}
                                            color={message.color}
                                            message={message.message}
                                            userID={message.userID}
                                            clientID={this.props.clientID}/>
                                </div>
                            )
                        })}
                        <div ref={this.messagesEndRef}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessagesComponent;