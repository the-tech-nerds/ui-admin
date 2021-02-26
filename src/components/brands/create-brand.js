import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import { Button } from "reactstrap";

export class CreateBrand extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brand: {},
            brand_id: 0,
            method: 'POST',
            url: '/api/brands/',
            loading: true
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        if (id > 0) {

            this.setState({
                brand_id: id,
                method: 'PUT',
                url: `/api/brands/update/${id}`,
                loading: true
            });
            await fetch(`/api/brands/${id}`, {
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
                        this.setState((state) => {
                            return {
                                ...state,
                                brand: response.data
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
        const { brand, brand_id, method, url } = this.state;
        const options = [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3 },
          ];
        return (
            <App>

                <Breadcrumb title={brand_id > 0 ? 'update' : 'create'} parent="product" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{brand_id > 0 ? 'Update brand' : 'Add brand'}</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: method,
                                            url: url,
                                            onSuccess: (response) => {
                                                window.location.href = '/brands/list';
                                            }
                                        }}
                                    >
                                        <AvField name="name" label="Name" value={brand.name} type="text" required />
                                        <AvField name="description" value={brand.description} label="Description" type="text" required />
                                        <AvField type="select" name="supplier_id" label="Supplier" helpMessage="please, select on item from dropdown">
                                            <option value="1">Khan group</option>
                                            <option value="2">Amin group</option>
                                        </AvField>
                                        {/* <AvSelect name="justTheInput" options={options} required /> */}
                                        {brand_id == 0 && <Button color="primary">Create</Button>}
                                        {brand_id > 0 && <Button color="primary">Update</Button>}
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

export default CreateBrand
