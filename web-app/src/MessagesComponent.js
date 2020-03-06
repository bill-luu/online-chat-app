import React from 'react';
import './MessagesComponent.css';
import { subscribeToMessageList } from './api';

function Message(props) {
    return(
        <div>
            <span>
                {props.timestamp} <span style={{color: props.color}}>
                    {props.username}:
                </span> {props.message}
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
    }
    
    componentDidMount() {
        subscribeToMessageList((err, messages) => {
            this.setState({messages: messages})
        })
    }
    render() {
        return (
            <div className="messagesComponent">
                <span>Welcome, {this.props.username}!</span>
                <div className="messages overflow">
                    <div className="overflow">
                        {this.state.messages.map((message, index) => {
                            return (
                                <Message key={index} 
                                        timestamp={message.timestamp} 
                                        username={message.username}
                                        color={message.color}
                                        message={message.message} />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default MessagesComponent;