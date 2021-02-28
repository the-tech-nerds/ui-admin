import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import * as fetch from "isomorphic-fetch";
import {Button} from "reactstrap";
import {Alert} from "react-bootstrap";

export default class ListCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            open: false,
            openStatus:false,
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {
        fetch(`/api/categories/`, {
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
                console.log('in error', error.message);
                this.setState({
                    error: true,
                    errorMessage: error,
                })
            })
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onOpenStatusModal = () => {
        this.setState({ openStatus: true });
    };

    onCloseModal = () => {
        this.setState({ open: false, openStatus: false });
    };
    render() {
        let { open, openStatus, categoryList, CategoryRoles, CategoryId } = this.state;
        return (
            <App>
                <Breadcrumb title="Admin List" parent="Users" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Category List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/create-category" className="btn btn-secondary">Create Category</Link>
                            </div>
                            <div className="clearfix"></div>

                            <Modal open={openStatus} onClose={this.onCloseModal} center>
                                <div className="modal-header bg-warning">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Update Status</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/categories/${CategoryId}/status`,
                                            onSuccess: (response) => {
                                                window.location.href = '/list-categories';
                                            },
                                        }}
                                    >
                                        <Alert variant='warning'>Are you sure to update status?  </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <div id="batchDelete" className="category-table category-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/categories/"
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
                                                    window.location.href = `/categories/${row.original.id}/edit`;
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
                                                            CategoryId: row.original.id
                                                        })
                                                        this.onOpenStatusModal();
                                                    }} title="Change Status">
                                                        <i className="fa fa-unlock-alt" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}></i>
                                                    </span>
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        },
                                    ]}
                                    excludeColumns={['id']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

