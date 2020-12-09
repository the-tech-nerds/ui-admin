import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
import {AvField, AvCheckbox, AvCheckboxGroup} from "availity-reactstrap-validation";
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
        }
    }

    componentDidMount() {
        console.log("in mount create-role");
        const url = window.location.href;

        this.setState({ loading: true });
        fetch(`/api/permission-categories`, {
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
                console.log(response.data)
                if (response.code === 200) {
                    this.setState({
                        categories: response.data,
                    });
                    return;
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                        loading: false,
                    });
                    return;
                }
            })
            .catch(error => {
                console.log('in error: ');
                this.setState({
                    error: true,
                    errorMessage: error,
                    loading: false,
                })
            })
    }
    createRole(){
        let permissions = this.state.permissions;
        console.log();
    }
    render() {
        const { categories, loading } = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Create Role" parent="Roles" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader />}
                                <div className="card-header">
                                    <h5> Add Role</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: 'POST',
                                            url: '/api/roles',
                                            onSuccess: (response) => {
                                                window.location.href ='/list-role';
                                            }
                                        }}
                                    >
                                        <div className="row small" style={{marginTop: "10px"}}>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <AvField name="name" label="Name" type="text" required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    {categories.map((category) => (
                                                        <div className="col-md-3">
                                                            <div className="card">
                                                                <div className="card-header bg-primary"><h4>{category.name}</h4></div>
                                                                <div className="card-body">
                                                                    <AvCheckboxGroup name="permissions[]" id={"cat_"+category.id}>
                                                                        <AvCheckbox label="select all" value="0" />
                                                                        {category.permissions.map((permission) => (
                                                                            <AvCheckbox label={permission.name} value={permission.id} id={"perm_"+permission.id}/>
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
