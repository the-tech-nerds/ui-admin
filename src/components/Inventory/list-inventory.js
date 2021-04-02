import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import {Button} from "reactstrap";
import {Alert} from "react-bootstrap";
import FetchData from "../common/get-data";

export default class ListInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryList: [],
            inventoryId: '',
            open: false,
            openStatus:false,
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {
        FetchData({
            url: `/api/inventories/`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    this.setState({
                        inventoryList: response.data,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        })
    }

    onOpenStatusModal = () => {
        this.setState({ openStatus: true });
    };

    onCloseModal = () => {
        this.setState({ open: false, openStatus: false });
    };
    render() {
        let {openStatus, inventoryId } = this.state;
        return (
            <App>
                <Breadcrumb title="Inventory List" parent="Users" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Inventory List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/inventories/create/0" className="btn btn-secondary">Create Inventory</Link>
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
                                            url: `/api/inventories/${inventoryId}/status`,
                                            onSuccess: (response) => {
                                                window.location.href = '/inventories/list';
                                            },
                                        }}
                                    >
                                        <Alert variant='warning'>Are you sure to update status?  </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <div id="batchDelete" className="inventory-table inventory-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/inventories/"
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
                                                    window.location.href = `/inventories/create/${row.original.id}`;
                                                    }} title="Edit Inventory">
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
                                                            inventoryId: row.original.id
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

