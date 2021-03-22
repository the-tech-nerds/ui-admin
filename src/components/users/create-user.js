import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button, Label} from "reactstrap";
import FetchData from "../common/get-data";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import AvSelect from '@availity/reactstrap-validation-select';
export class Create_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shops: []
        }
    }
    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        // fetch shops
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSucess) => {
                if (isSucess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        shops: options
                    })
                } 
            }
        })
    }

    render() {
        const {shops} = this.state;
        return (
            <App>
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
                                                window.location.href ='/list-admins';
                                            }
                                        }}
                                    >
                                        <AvField name="first_name" label="First Name" type="text" required />
                                        <AvField name="last_name" label="Last Name" type="text" required />
                                        <AvField name="email" label="Email" type="email" required />
                                        {/*<AvField name="password" label="Password" type="password" required />*/}
                                        <AvField name="phone" label="Phone" type="phone" required />
                                        <AvGroup>
                                                <Label for="shopId">Select Shop</Label>
                                                <AvSelect isMulti name="shopId" options={shops} required/>
                                        </AvGroup>
                                        <Button color="primary">Register</Button>
                                    </Forms>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default Create_user
