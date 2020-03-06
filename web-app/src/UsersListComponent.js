import React from 'react';
import './UsersListComponent.css';
import { subscribeToUsersList } from './api'

class UsersListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [""]
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
                <span>Users</span>
                <div className="users users-order">
                    {this.state.users.map(user => {
                        return (
                            <span key={user}>{user}</span>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default UsersListComponent;