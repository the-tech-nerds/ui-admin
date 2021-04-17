import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import * as fetch from "isomorphic-fetch";
import {Button} from "reactstrap";
import {Alert} from "react-bootstrap";

export default class ListProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            productId: '',
            open: false,
            openStatus:false,
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {
        fetch(`/api/products/`, {
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
                        productList: response.data,
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

    onOpenStatusModal = () => {
        this.setState({openStatus: true});
    };

    onCloseModal = () => {
        this.setState({open: false, openStatus: false});
    };

    render() {
        let {openStatus, productId} = this.state;
        return (
            <App>
                <Breadcrumb title="Product List" parent="Users"/>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Product List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/products/create/0" className="btn btn-secondary">Create Product</Link>
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
                                            url: `/api/products/${productId}/status`,
                                            onSuccess: (response) => {
                                                window.location.href = '/products/list';
                                            },
                                        }}
                                    >
                                        <Alert variant='warning'>Are you sure to update status? </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <div id="batchDelete" className="product-table product-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/products/"
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
                                                        window.location.href = `/product/${row.original.id}/variance/list`;
                                                    }} title="Show Product Variances">
                                                        <i className="fa fa-eye" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}
                                                        />
                                                    </span>

                                                    <span onClick={() => {
                                                        window.location.href = `/products/create/${row.original.id}`;
                                                    }} title="Edit Product">
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
                                                            productId: row.original.id
                                                        })
                                                        this.onOpenStatusModal();
                                                    }} title="Change Status">
                                                        <i className="fa fa-unlock-alt" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}></i>
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

