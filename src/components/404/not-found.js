import React, { Component, Fragment } from 'react'
// import 'not-found.css';
export class NotFound extends Component {
    render() {
        return (
            <Fragment>
                <div className="page-wrapper">
                    <div className="not-found">
                        <div className="container">
                            <div className="error-wrapper">
                                <div className="man-icon"/>
                                <h3 className="title">404</h3>
                                <p className="info">Oh! Page not found</p>
                               <a href="/" > <button type="button" className="home-btn">HOME</button></a>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default NotFound
