import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export class CreateSupplier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            supplier: {},
            supplier_id:0,
            method: 'POST',
            url: '/api/suppliers/',
            loading: true
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
       if(id > 0) {

        this.setState({
            supplier_id: id,
            method: 'PUT',
            url: `/api/suppliers/update/${id}`,
            loading: true
        });
        await fetch(`/api/suppliers/${id}`, {
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
                            supplier: response.data
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
        const {supplier, supplier_id, method, url} = this.state;
        return (
            <App>
                
                <Breadcrumb title={supplier_id>0? 'update' : 'create'} parent="Supplier" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{ supplier_id>0? 'Update supplier' : 'Add Supplier'}</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: method,
                                            url: url,
                                            onSuccess: (response) => {
                                                window.location.href ='/suppliers/list';
                                            }
                                        }}
                                    >
                                        <AvField name="name" label="Name" value = {supplier.name} type="text" required />
                                        <AvField name="description" value= {supplier.description} label="Description" type="text" required />
                                        <AvField name="phone" value= {supplier.phone} label="Phone" type="text" required />
                                        <AvField name="email" value= {supplier.email} label="Email" type="email" required />
                                        <AvField name="address" value ={supplier.address} label="Address" type="text" required />
                                       {supplier_id== 0 && <Button color="primary">Create</Button>}
                                       {supplier_id > 0 && <Button color="primary">Update</Button>}
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

export default CreateSupplier
