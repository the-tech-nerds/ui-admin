import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import * as fetch from "isomorphic-fetch";

export class CreateCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {
        fetch(`/api/categories`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        categoryList: response.data,
                    });
                    return;
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    });
                    return;
                }
            })
            .catch(error => {
                this.setState({
                    error: true,
                    errorMessage: error,
                })
            })
    }
    render() {
        let { categoryList } = this.state
        return (
            <App>
                <Breadcrumb title="Create Category" parent="Users" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add Category</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'POST',
                                            url: '/api/categories',
                                            onSuccess: (response) => {
                                                window.location.href ='/list-category';
                                            }
                                        }}
                                    >
                                        <AvField type="select" name="category_id">
                                            <option value="">Select a Parent Category</option>
                                            { categoryList.map(category => (
                                                <option value={category.id}>{ category.name }</option>
                                            ))}
                                        </AvField>

                                        <AvField name="name" label="Category Name" type="text" required />
                                        <Button color="primary">Create</Button>
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

export default CreateCategory
