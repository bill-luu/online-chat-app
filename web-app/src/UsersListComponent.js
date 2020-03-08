import React from 'react';
import './UsersListComponent.css';
import { subscribeToUsersList } from './api'

function User(props) {
    return (
        <div style={{paddingLeft: "10px"}}>
            <span>{props.user.username}</span>
        </div>
    )
}

class UsersListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        subscribeToUsersList((err, users) => {
            this.setState({ users: users })
        })
    }

    render() {
        return (
            <div className="usersListComponent">
                <span style={{paddingLeft: "5px"}}>Users</span>
                <div className="users users-order">
                    {this.state.users.map(user => {
                        return (
                            <User key={user.clientID} user={user}></User>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default UsersListComponent;