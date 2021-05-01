import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
import App from "../app";
import {AvCheckbox, AvCheckboxGroup, AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";

export default class CreateRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            permissions: [],
            error: false,
            errorMessage: null,
            selectedPermissions: [],
            role: '',
        }
        this.setRoleTitle = this.setRoleTitle.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
        this.selectAllPermission = this.selectAllPermission.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        fetch(`/api/permission-categories`, {
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
                            ...state, categories: response?.data?.map((category) => {
                                category.checked = false;
                                category?.permissions?.map((permission) => {
                                    permission.checked = false;
                                    return true;
                                })
                                return category;
                            }) || []
                        };
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
                this.setState({
                    error: true,
                    errorMessage: error,
                    loading: false,
                })
            })
    }

    setRoleTitle(e) {
        setTimeout(() => this.setState((state) => {
            return {
                role: e.target.value,
                ...state
            }
        }), 100);
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
        const {categories, loading} = this.state;
        return (
            <App>
                <Breadcrumb title="Create Role" parent="Roles"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5> Add Role</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'POST',
                                            url: '/api/roles',
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
                                                                        {category.permissions.map((permission, j) => (
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
                                                <Button color="primary">Create</Button>
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
