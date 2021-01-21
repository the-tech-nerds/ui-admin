import React, { Component } from 'react'
import man from '../../../assets/images/dashboard/man.png'
import * as fetch from "isomorphic-fetch";
import Loader from "../loader";

export class User_panel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            error: false,
            errorMessage: null,
        }
    }
    componentDidMount() {
        fetch(`/api/users/current/user`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        user: response.data
                    });
                } else {
                    window.location.href = '/api/users/logout';
                }
            })
            .catch(error => {
                window.location.href = '/auth/login';
            })
    }
    render() {
        const { user = null } = this.state;
        return (
            <div>
                {user && <div className="sidebar-user text-center">
                    <div><img className="img-60 rounded-circle lazyloaded blur-up" src={man} alt="#" />
                    </div>
                    <h6 className="mt-3 f-14">{user.first_name+' '+user.last_name}</h6>
                    <p>{ user.roles }</p>
                </div>}
                {!user && <Loader />}
            </div>
        )
    }
}

export default User_panel

