import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom'
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import Modal from "react-responsive-modal";

export default class ListRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleId:'',
            open: false,
            error: false,
            errorMessage: null,
        };
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        let { open, roleId } = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Role List" parent="Users"/>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Role List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/create-role" className="btn btn-secondary">Create Role</Link>
                            </div>
                            <div className="clearfix"></div>
                            <Modal open={open} onClose={this.onCloseModal} center>
                                <div className="modal-header">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Change Status</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/roles/${roleId}/change-status`,
                                            onSuccess: (response) => {
                                                window.location.href = '/list-roles';
                                            },
                                        }}
                                    >
                                        <AvField type="select" name="roles" id={"roles_"+userId} value={userRoles} label="Roles" helpMessage="Choose a Role to assign!" multiple>
                                            {roleList.map(role => (
                                                <option value={role.id}>{ role.Name }</option>
                                            ))}
                                        </AvField>

                                        <Button className="btn btn-sm btn-secondary">Assign</Button>
                                    </Forms>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-sm btn-d" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                </div>
                            </Modal>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/roles"
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
                                                        window.location.href = `/roles/${row.original.id}/details`;
                                                    }} title="Show role details">
                                                        <i className="fa fa-eye" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}
                                                        />
                                                    </span>
                                                    <span onClick={() => {
                                                        window.location.href = `/roles/${row.original.id}/edit`;
                                                    }} title="Edit role">
                                                        <i className="fa fa-pencil" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}
                                                        />
                                                    </span>

                                                    <span onClick={() => {
                                                        this.setState({
                                                            roleId: row.original.id
                                                        })
                                                        this.onOpenModal();
                                                    }} title="Change Status">
                                                        <button className={"btn btn-xs " + (row.original.isActive ? 'btn-success' : 'btn-warning') }>{ row.original.isActive ? 'Active' : 'Inactive' }</button>
                                                    </span>
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        },
                                        /*{
                                            Header: <b>Edit</b>,
                                            id: 'edit',
                                            accessor: str => "edit",
                                            Cell: (row) => (
                                                <div>
                                                    <span onClick={() => {
                                                        window.location.href = `/roles/${row.original.id}/edit`;
                                                    }}>
                                                        <i className="fa fa-pencil" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}
                                                        />
                                                    </span>
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        }*/
                                    ]}

                                    excludeColumns={['id', 'hasUser', 'isActive']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

