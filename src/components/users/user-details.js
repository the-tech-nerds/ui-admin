import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from 'react-responsive-modal';


// image import
import two from '../../assets/images/pro3/2.jpg';
import twentySeven from '../../assets/images/pro3/27.jpg';
import one from '../../assets/images/pro3/1.jpg';
import size_chart from '../../assets/images/size-chart.jpg'
import user from '../../assets/images/user.png'
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
                console.log(response.data)
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
            <Fragment>
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
                            </div>
                        </div>}
                    </div>

                </div>
            </Fragment>
        )
    }
}
