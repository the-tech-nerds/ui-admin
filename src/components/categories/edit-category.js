import React, {Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvCheckbox, AvCheckboxGroup, AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";

export default class EditCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryList: [],
            error: false,
            errorMessage: null,
            category: {},
            role: '',
            role_id:'',
        }
    }

    async componentDidMount() {
        const url = window.location.href.split('/');
        const categoryId = url[4];
        this.setState({loading: true});

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

        await fetch(`/api/categories/${categoryId}`, {
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
                            category: response.data
                        }
                    });

                    this.setState((state) => {
                        return {
                            ...state,
                            categoryList: this.state.categoryList.filter(category => category.id !== Number(categoryId))
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

    render() {
        let {categoryList, loading, category} = this.state;
        const url = window.location.href.split('/');
        const categoryId = url[4];
        return (
            <App>
                <Breadcrumb title="Edit Role" parent="Roles"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5> Edit Category</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/categories/${categoryId}`,
                                            onSuccess: (response) => {
                                                window.location.href = '.categories/list';
                                            },
                                        }}
                                    >
                                        <div className="row small" style={{marginTop: "10px"}}>
                                            <div className="col-md-12">
                                            <AvField type="select" name="parent_id">
                                                <option value="">Select Parent Category</option>
                                                { categoryList.map(category => (
                                                    <option value={category.id}>{ category.Name }</option>
                                                ))}
                                            </AvField>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <AvField name="name" label="Name" type="text" required
                                                             value={category.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <Button color="primary">Edit</Button>
                                            </div>
                                        </div>
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
