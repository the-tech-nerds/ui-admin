import React, {Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
import {AvCheckbox, AvCheckboxGroup, AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

/*import role_data from '../../assets/data/roles';
import permission_category_data from '../../assets/data/permissionCategory';
import permission_data from '../../assets/data/permissions';*/
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
            selectedPermission: [],
            role: '',
        }
        this.setRoleTitle = this.setRoleTitle.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
    }

    componentDidMount() {
        console.log("in mount create-role");
        const url = window.location.href;

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
                    this.setState({
                        categories: response.data
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

    checkPermission(category_id, permission_id) {
        console.log(category_id, permission_id);
    }

    render() {
        const {categories, loading, selectedPermission, role} = this.state;
        return (
            <Fragment>
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
                                                window.location.href = '/list-role';
                                            },
                                            dataProcessBeforeSubmit: (value, callback) => {
                                                callback({
                                                    permissions: Object.keys(value)
                                                        .filter(pk => pk !== 'name')
                                                        .reduce((allPermission, permissionKey) => [...allPermission, ...value[permissionKey]], []),
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
                                                                            label="select all"
                                                                            value="0"
                                                                            id={"per_all_" + category.id}
                                                                            key={"per_all_" + category.id}
                                                                        />
                                                                        {category.permissions.map((permission, j) => (
                                                                            <AvCheckbox
                                                                                label={permission.name}
                                                                                value={permission.id}
                                                                                id={"perm_" + permission.id}
                                                                                key={"perm_" + permission.id}
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
            </Fragment>
        )
    }
}
