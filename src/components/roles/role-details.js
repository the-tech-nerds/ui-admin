import React, {Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
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
                        return {...state, categories: response.data};
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

    render() {
        const {categories, loading} = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Create Role" parent="Roles"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5> Details Role</h5>
                                </div>
                                <div className="card-body">
                                    <div>
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
                                                                        {category.permissions.map(permission => (
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
