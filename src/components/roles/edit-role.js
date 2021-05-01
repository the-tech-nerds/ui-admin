import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvCheckbox, AvCheckboxGroup, AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";

export default class EditRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            permissions: [],
            error: false,
            errorMessage: null,
            selectedPermissions: [],
            selectedRole: {},
            role: '',
            role_id: '',
        }
    }

    async componentDidMount() {
        const url = window.location.href.split('/');
        const roleId = url[4];
        this.setState({loading: true});
        await fetch(`/api/permission-categories`, {
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
                            categories: response.data
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
                this.setState({
                    error: true,
                    errorMessage: error,
                    loading: false,
                })
            });
        await fetch(`/api/roles/${roleId}/permissions`, {
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
                    console.log(response);
                    this.setState((state) => {
                        const categories = this.state?.categories?.map((category) => {
                            category.permissions = category.permissions?.map((permission) => {
                                permission.checked = response?.data?.permissions?.includes(permission.id);
                                return permission;
                            });
                            category.checked = category?.permissions?.findIndex((permission) => !permission.checked) === -1;
                            return category;
                        });
                        return {
                            ...state,
                            categories,
                            selectedRole: response.data.role
                        }
                    });
                    console.log(this.state.categories);
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

    checkPermission(category_index, permission_index) {
        const categories = [...this.state.categories || []];
        categories[category_index].permissions[permission_index].checked = !categories[category_index]?.permissions[permission_index]?.checked;
        const categoryChecked = categories[category_index].permissions.findIndex((permission) => !permission.checked);
        categories[category_index].checked = categoryChecked === -1;
        this.setState((prepState) => ({
            ...prepState,
            categories: categories
        }));
    }

    selectAllPermission(category_index) {
        const categories = [...this.state.categories || []];
        const categoryChecked = categories[category_index]?.checked;
        categories[category_index].permissions = categories[category_index]?.permissions?.map((permission) => {
            permission.checked = !categoryChecked;
            return permission;
        });
        categories[category_index].checked = !categoryChecked;
        this.setState((prepState) => ({
            ...prepState,
            categories: categories
        }));
    }

    render() {
        let {categories, loading, selectedRole} = this.state;
        const url = window.location.href.split('/');
        const roleId = url[4];
        return (
            <App>
                <Breadcrumb title="Edit Role" parent="Roles"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5> Edit Role</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/roles/${roleId}/update`,
                                            onSuccess: (response) => {
                                                window.location.href = '/list-roles';
                                            },
                                            dataProcessBeforeSubmit: (value, callback) => {
                                                callback({
                                                    permissions: this.state?.categories?.map((category) => category?.permissions?.filter((permission) => permission.checked) || [])
                                                        .reduce((allPermission, permissions) => [...allPermission, ...permissions?.map((permission) => permission.id)], []),
                                                    name: value.name
                                                });
                                            },
                                        }}
                                    >
                                        <div className="row small" style={{marginTop: "10px"}}>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <AvField name="name" label="Name" type="text" required
                                                             value={selectedRole.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    {categories.map((category, i) => (
                                                        <div className="col-md-3" key={"cat_" + category.id}>
                                                            <div className="card">
                                                                <div className="card-header bg-primary">
                                                                    <h4>{category.name}</h4></div>
                                                                <div className="card-body">
                                                                    <AvCheckboxGroup
                                                                        name={'permissions_' + i}
                                                                        id={"cat_" + category.id}
                                                                    >
                                                                        <AvCheckbox
                                                                            label="Select all"
                                                                            value={category.id}
                                                                            className="checkbox_animated"
                                                                            id={"perm_select" + category.id}
                                                                            key={"perm_select" + category.id}
                                                                            checked={category.checked}
                                                                            onChange={() => this.selectAllPermission(i)}
                                                                        />
                                                                        {category?.permissions?.map((permission, j) => (
                                                                            <AvCheckbox
                                                                                label={permission.name}
                                                                                value={permission.id}
                                                                                className="checkbox_animated"
                                                                                id={"perm_" + permission.id}
                                                                                key={"perm_" + permission.id}
                                                                                checked={permission.checked}
                                                                                onChange={() => this.checkPermission(i, j)}
                                                                            />
                                                                        ))}
                                                                    </AvCheckboxGroup>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
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
