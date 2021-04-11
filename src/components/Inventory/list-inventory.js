import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import {Button, Label} from "reactstrap";
import {Alert} from "react-bootstrap";
import FetchData from "../common/get-data";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";

export default class ListInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryList: [],
            inventoryId: '',
            inventoryPrice:0,
            inventoryStockCount:0,
            inventoryShopIds:[],
            open: false,
            openStatus: false,
            openEdit: false,
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
        this.setState({openStatus: true});
    };

    onOpenEditModal = () => {
        this.setState({openEdit: true});
    };

    onCloseModal = () => {
        this.setState({open: false, openStatus: false, openEdit: false});
    };

    render() {
        let {openStatus, openEdit, inventoryId, inventoryPrice, inventoryStockCount} = this.state;
        return (
            <App>
                <Breadcrumb title="Inventory List" parent="Users"/>
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
                                        <Alert variant='warning'>Are you sure to update status? </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <Modal open={openEdit} onClose={this.onCloseModal} center>
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Update</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/inventories/update/${inventoryId}`,
                                            onSuccess: (response) => {
                                                window.location.href = '/inventories/list';
                                            },
                                        }}
                                    >
                                        <AvGroup>
                                            <Label for="name">Price</Label>
                                            <AvField className="form-control" name="price"
                                                     value={inventoryPrice}
                                                     placeholder="Stock Price" type="text" required/>
                                        </AvGroup>

                                        <AvInput type="textarea" name="stock_count"
                                                 value={inventoryStockCount}
                                                 placeholder="Stock Count"/>

                                        <Button className="btn btn-sm btn-success float-right mt-2 mb-2">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <div id="batchDelete"
                                 className="inventory-table inventory-list order-table coupon-list-delete">
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
                                                    {row.original.is_active === 0 && <span onClick={() => {
                                                        console.log('row original data : ', row.original)
                                                        this.setState({
                                                            inventoryId: row.original.id,
                                                            inventoryPrice: row.original['Stock Price'],
                                                            inventoryStockCount: row.original['Stock Unit'],
                                                        })
                                                        this.onOpenEditModal();
                                                    }} title="Edit">
                                                        <i className="fa fa-edit" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}></i>
                                                    </span>}

                                                    <span onClick={() => {
                                                        this.setState({
                                                            inventoryId: row.original.id
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
                                    excludeColumns={['id', 'is_active']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

