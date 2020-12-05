import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export class Create_user extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create Admin" parent="Users" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add Admin</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'POST',
                                            url: '/api/users',
                                            onSuccess: (response) => {
                                                window.location.href ='/users/list-user';
                                            }
                                        }}
                                    >
                                        <AvField name="first_name" label="First Name" type="text" required />
                                        <AvField name="last_name" label="Last Name" type="text" required />
                                        <AvField name="email" label="Email" type="email" required />
                                        <AvField name="password" label="Password" type="password" required />
                                        <AvField name="phone" label="Phone" type="phone" required />
                                        <Button color="primary">Register</Button>
                                    </Forms>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Create_user
