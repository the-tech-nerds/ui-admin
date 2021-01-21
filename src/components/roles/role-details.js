import React, {Component, Fragment} from 'react';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";
import {ListGroup} from 'react-bootstrap';

export default class EditRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roleDetails:{permission_category:{}, role_name:''},
            error: false,
            errorMessage: null,
        }
    }

    async componentDidMount() {
        const url = window.location.href.split('/');
        const roleId = url[4];
        this.setState({loading: true});
        await fetch(`/api/roles/${roleId}/details`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                this.setState({loading: false});
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        roleDetails: response.data.data
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                        loading: false,
                    });
                }
            })
            .catch(error => {
                this.setState((state) => {
                    return {
                        ...state,
                        error: true,
                        errorMessage: error,
                        loading: false,
                    }
                });
            });
    }
    render() {
        let {roleDetails, loading} = this.state;
        return (
            <App>
                <Breadcrumb title="Edit Role" parent="Roles"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5>Show Details</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row small" style={{marginTop: "10px"}}>
                                        <h3 className="p-4">{roleDetails.role_name}</h3>
                                        <div className="col-md-12">
                                            <div className="row">
                                                {Object.keys(roleDetails.permission_category).map((categoryName, i) => (
                                                    <div className="col-md-3" key={categoryName}>
                                                        <div className="card">
                                                            <div className="card-header bg-primary">
                                                                <h4>{categoryName}</h4></div>
                                                            <div className="card-body">
                                                                <ListGroup
                                                                    name={'permissions_' + i}
                                                                    id={"cat_" + i}
                                                                >
                                                                    {roleDetails.permission_category[categoryName].map((permission, j) => (
                                                                        <ListGroup.Item key={"perm_"+j} className="font-weight-bold">{permission.permission_name}</ListGroup.Item>
                                                                    ))}
                                                                </ListGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}
