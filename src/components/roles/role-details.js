import React, {Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";
import Forms from "../form/forms";
import {AvCheckbox, AvCheckboxGroup, AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export default class UserDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            error: false,
            errorMessage: null,
        }
    }

    componentDidMount() {
        const url = window.location.href;
        const roleId = url.substring(url.lastIndexOf('/') + 1);

        if (!roleId) {
            throw new Error("No user id in url");
        }

        this.setState({loading: true});
        fetch(`/api/roles/${roleId}`, {
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
                console.log(response.data)
                if (response.code === 200) {
                    this.setState({
                        user: response.data,
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
        const {user, loading} = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Role Detail" parent="Role"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader/>}
                                <div className="card-header">
                                    <h5>Role</h5>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <div className="row small" style={{marginTop: "10px"}}>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label name="name" label="Name" type="text" required
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
