import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "../app";

// image import
import one from '../../assets/images/pro3/1.jpg';
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";

export default class UserDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            error: false,
            errorMessage: null,
        }
    }

    componentDidMount() {
        const url = window.location.href;
        const userId = url.substring(url.lastIndexOf('/') + 1);

        if (!userId) {
            throw new Error("No user id in url");
        }

        this.setState({ loading: true });
        fetch(`/api/users/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                this.setState({ loading: false });
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        user: response.data,
                    });
                    return;
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                        loading: false,
                    });
                    return;
                }
            })
            .catch(error => {
                this.setState({
                    error: true,
                    errorMessage: error,
                    loading: false,
                })
            })
    }
    render() {
        const { user, loading } = this.state;
        return (
            <App>
                <Breadcrumb title="User Detail" parent="User" />

                <div className="container-fluid">
                    <div className="card">
                        {loading && <Loader />}
                        {user && <div className="row product-page-main card-body">
                            <div className="col-xl-4">
                                <img className="img-fluid" src={one} alt="" />
                            </div>
                            <div className="col-xl-8">
                                <div className="product-page-details product-right mb-0">
                                    <h2>{user.first_name} {user.last_name}</h2>
                                    <hr />
                                    <h6 className="product-title">Email</h6>
                                    <p>{user.email}</p>
                                    <h6 className="product-title">Phone</h6>
                                    <p>{user.phone}</p>
                                </div>

                                <br/>
                                <h3>Assigned Roles</h3>
                                <hr/>
                                <div>
                                    {user.roles.map(role =>
                                            <span onClick={() => {
                                                window.location.href = `/roles/${role.id}/details`;
                                            }}
                                                  title="Show role details" className="btn btn-primary mr-2">{role.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>}
                    </div>

                </div>
            </App>
        )
    }
}
