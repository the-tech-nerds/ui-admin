import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable'
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import * as fetch from "isomorphic-fetch";
import {Button} from "reactstrap";

export default class    ListAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleList: [],
            open: false,
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {
        fetch(`/api/roles`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                const response = await res.json();
                console.log(response.data)
                if (response.code === 200) {
                    this.setState({
                        roleList: response.data,
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

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };
    render() {
        const { open, roleList } = this.state;
        let userRoles = [];
        return (
            <Fragment>
                <Breadcrumb title="Admin List" parent="Users" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>User List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/create-user" className="btn btn-secondary">Create Admin</Link>
                            </div>
                            <div className="clearfix"></div>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/users?type=admin"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    extraColumns={[
                                        {
                                            Header: <b>Action</b>,
                                            id: 'view',
                                            accessor: str => "view",
                                            Cell: (row) => (
                                                <div>
                                                    <span onClick={() => {
                                                        window.location.href = `/users/${row.original.id}`;
                                                    }}>
                                                        <i className="fa fa-eye" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        },
                                        {
                                            Header: <b>Action</b>,
                                            id: 'assign',
                                            accessor: str => "assign",
                                            Cell: (row) => (
                                                <div>
                                                    <span onClick={() => {
                                                        userRoles = row.original.Roles.split(',');
                                                        this.onOpenModal();
                                                    }}>
                                                        <i className="fa fa-lock" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>

                                                    <Modal open={open} onClose={this.onCloseModal} >
                                                        <div className="modal-header">
                                                            <h5 className="modal-title f-w-600" id="exampleModalLabel2">Assign Role to User</h5>
                                                        </div>
                                                        <div className="modal-body modal-lg">
                                                            <Forms
                                                                options={{
                                                                    method: 'POST',
                                                                    url: `/api/users/${row.original.id}/assign-roles`,
                                                                    onSuccess: (response) => {
                                                                        window.location.href = '/list-admins';
                                                                    },
                                                                }}
                                                            >
                                                                <AvField type="select" name="roles" value={row.original.roleIds} label="Roles" helpMessage="Choose a Role to assign!" multiple>
                                                                    {roleList.map(role => (
                                                                        <option value={role.id}>{ role.Name }</option>
                                                                    ))}
                                                                </AvField>

                                                                <Button color="primary">Assign</Button>
                                                            </Forms>
                                                        </div>
                                                        <div className="modal-footer">
                                                            {/*<button type="button" className="btn btn-primary" onClick={() => this.onCloseModal('VaryingMdo')}>Save</button>*/}
                                                            <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

