import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import PaginatedDatatable from '../common/paginated-datatable';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import * as fetch from "isomorphic-fetch";
import { Button } from "reactstrap";
import { Alert } from "react-bootstrap";
import {getPermissionTypes, userHasPermission} from "../../utils/utils";

export default class ListAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleList: [],
            userId: '',
            userRoles: [],
            open: false,
            openFreeze: false,
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

    onOpenFreezeModal = () => {
        this.setState({ openFreeze: true });
    };

    onCloseModal = () => {
        this.setState({ open: false, openFreeze: false });
    };
    render() {
        const PermissionTypes = getPermissionTypes();
        let { open, openFreeze, roleList, userRoles, userId } = this.state;
        return (
            <App>
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
                            <Modal open={open} onClose={this.onCloseModal} center>
                                <div className="modal-header">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Assign Role to User</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'POST',
                                            url: `/api/users/${userId}/assign-roles`,
                                            onSuccess: (response) => {
                                                window.location.href = '/list-admins';
                                            },
                                        }}
                                    >
                                        <AvField type="select" name="roles" id={"roles_" + userId} value={userRoles} label="Roles" helpMessage="Choose a Role to assign!" multiple>
                                            {roleList.map(role => (
                                                <option value={role.id}>{role.Name}</option>
                                            ))}
                                        </AvField>

                                        <Button className="btn btn-xs btn-secondary">Assign</Button>
                                    </Forms>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-xs btn-warning" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                </div>
                            </Modal>

                            <Modal open={openFreeze} onClose={this.onCloseModal} center>
                                <div className="modal-header bg-warning">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Unfreeze User</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/users/${userId}/unfreeze`,
                                            onSuccess: (response) => {
                                                window.location.href = '/list-admins';
                                            },
                                        }}
                                    >
                                        <Alert variant='warning'>Are you sure to unfreeze this user?  </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Unfreeze</Button>
                                        <br />
                                    </Forms>
                                </div>
                            </Modal>

                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <PaginatedDatatable
                                    url="/api/users"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    takeColumns={['id', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'Roles']}
                                    extraQuery="type=admin"
                                    modifyColumns={
                                        [
                                            {
                                                key: 'roles',
                                                name: 'Roles',
                                                modifier: (roles) => roles.map(role => role.name).join(', ')
                                            }
                                        ]
                                    }
                                    extraColumns={[
                                        {
                                            Header: <b>Action</b>,
                                            id: 'view',
                                            accessor: str => "view",
                                            Cell: (row) => (
                                                <div>
                                                    {userHasPermission(PermissionTypes.USER.DETAILS) &&
                                                    <span onClick={() => {
                                                        window.location.href = `/users/${row.original.id}`;
                                                    }} title="Show user details">
                                                        <i className="fa fa-eye" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    {userHasPermission(PermissionTypes.USER.UPDATE) &&
                                                    <span onClick={() => {
                                                        window.location.href = `/edit-user/${row.original.id}`;
                                                    }} title="edit user details">
                                                        <i className="fa fa-pencil-square-o" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    {userHasPermission(PermissionTypes.USER.ROLE_ASSIGN) &&
                                                    <span onClick={() => {
                                                        this.setState({
                                                            userRoles: row.original.roles.map(({id}) => id),
                                                            userId: row.original.id
                                                        })
                                                        this.onOpenModal();
                                                    }} title="Assign role to user">
                                                        <i className="fa fa-lock" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    { row.original.isFrozen && userHasPermission(PermissionTypes.USER.UPDATE) &&
                                                        <span onClick={() => {
                                                            this.setState({
                                                                userId: row.original.id
                                                            })
                                                            this.onOpenFreezeModal();
                                                        }} title="Unfreeze User">
                                                            <i className="fa fa-unlock-alt" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                            ></i>
                                                        </span>}
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        },
                                    ]}
                                    excludeColumns={['id', 'roleIds', 'isFrozen']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

