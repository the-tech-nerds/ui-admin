import React, { Component, Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { User } from 'react-feather';
import { ArrowLeft } from 'react-feather';
import Slider from 'react-slick';
import stats from '../../assets/images/dashboard/stats.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export class Login extends Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            arrows: false
        };
        return (
            <Fragment>
                <div className="page-wrapper">
                    <div className="authentication-box">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-5 p-0 card-left">
                                    <div className="card bg-primary">
                                        <div className="svg-icon">
                                            <img src={stats} className="Img-fluid" />
                                        </div>
                                        <Slider className="single-item" {...settings}>
                                            <div>
                                                <div>
                                                    <h3>Welcome to Multikart</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <h3>Welcome to Multikart</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <h3>Welcome to Multikart</h3>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                                                </div>
                                            </div>
                                        </Slider >
                                    </div>
                                </div>
                                <div className="col-md-7 p-0 card-right">
                                    <div className="card tab2-card">
                                        <div className="card-body">
                                            <Tabs>
                                                <TabList className="nav nav-tabs tab-coupon" >
                                                    <Tab className="nav-link" onClick={(e) => this.clickActive(e)}><User />Login</Tab>
                                                    {/*<Tab className="nav-link" onClick={(e) => this.clickActive(e)}><Unlock />Register</Tab>*/}
                                                </TabList>

                                                <TabPanel>
                                                    <Forms
                                                        title="Login User"
                                                        options={{
                                                            method: 'POST',
                                                            url: '/api/users/login',
                                                            onSuccess: (response) => {
                                                                window.location.href ='/';
                                                            }
                                                        }}
                                                    >
                                                        <AvField name="username" label="Email" type="email" required />
                                                        <AvField name="password" label="Password" type="password" required />
                                                        <Button color="primary">Login</Button>
                                                    </Forms>
                                                </TabPanel>
                                            </Tabs>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a href="https://react.pixelstrap.com/multikart" target="_blank" className="btn btn-primary back-btn"><ArrowLeft />back</a>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Login
