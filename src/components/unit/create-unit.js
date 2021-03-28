import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export class CreateUnit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            unit: {},
            unit_id:0,
            method: 'POST',
            url: '/api/units/',
            loading: true
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
       if(id > 0) {

        this.setState({
            unit_id: id,
            method: 'PUT',
            url: `/api/units/update/${id}`,
            loading: true
        });
        await fetch(`/api/units/${id}`, {
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
                    this.setState((state) => {
                        return {
                            ...state,
                            unit: response.data
                        }
                    });
                } else {
                    this.setState((state) => {
                        return {
                            ...state,
                            error: true,
                            errorMessage: response.message,
                            loading: false,
                        }
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
  

    }
    render() {
        const {unit, unit_id, method, url} = this.state;
        return (
            <App>
                
                <Breadcrumb title={unit_id>0? 'update' : 'create'} parent="product" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{ unit_id>0? 'Update unit' : 'Add unit'}</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: method,
                                            url: url,
                                            onSuccess: (response) => {
                                                window.location.href ='/units/list';
                                            }
                                        }}
                                    >
                                        <AvField name="name" label="Name" value = {unit.name} type="text" required />
                                        <AvField name="description" value= {unit.description} label="Description" type="text" required />
                                       {unit_id== 0 && <Button color="primary">Create</Button>}
                                       {unit_id > 0 && <Button color="primary">Update</Button>}
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

export default CreateUnit
