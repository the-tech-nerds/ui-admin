import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Modal from 'react-responsive-modal';
import Forms from "../form/forms";
import {Button} from "reactstrap";
import {Alert, ListGroup} from "react-bootstrap";
import {getPermissionTypes, userHasPermission} from "../../utils/utils";
import Datatable from "../common/datatable";

export default class ListDiscount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountId: '',
            open: false,
            discountData: {},
            assignedItemType: '',
            assignedItems: [],
            openItem: false,
            error: false,
            errorMessage: null,
        };
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onOpenItemModal = (discountData) => {
        let itemType = ''
        let items = [];
        if(discountData.categories.length > 0){
            itemType = 'Category';
            items = discountData.categories;
        }
        else if(discountData.products.length > 0){
            itemType = 'Product';
            items = discountData.products;
        }
        else if(discountData.productVariances.length > 0){
            itemType = 'Product Variances';
            items = discountData.productVariances;
        }
        else if(discountData.offers.length > 0){
            itemType = 'Offer';
            items = discountData.offers;
        }

        this.setState({ openItem: true, discountData: discountData, assignedItemType: itemType, assignedItems: items });
    };

    onCloseModal = () => {
        this.setState({ open: false, openItem: false });
    };
    render() {
        const PermissionTypes = getPermissionTypes();
        let { open, openItem, discountId, discountData, assignedItemType, assignedItems } = this.state;
        return (
            <App>
                <Breadcrumb title="Discount List" parent="Discounts" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Discount List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/discounts/create" className="btn btn-sm btn-secondary mr-1">Create Discount</Link>
                                <Link to="/discounts/assign" className="btn btn-sm btn-secondary">Assign Discount</Link>
                            </div>

                            <div className="clearfix"></div>

                            <Modal open={open} onClose={this.onCloseModal} center>
                                <div className="modal-header bg-warning">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Update Status</h5>
                                </div>
                                <div className="modal-body">
                                    <Forms
                                        options={{
                                            method: 'PUT',
                                            url: `/api/discounts/${discountId}/status`,
                                            onSuccess: (response) => {
                                                window.location.href = '/discount/list';
                                            },
                                        }}
                                    >
                                        <Alert variant='warning'>Are you sure to update status?  </Alert>
                                        <Button className="btn btn-xs btn-warning float-right">Update</Button>
                                        <br/>
                                    </Forms>
                                </div>
                            </Modal>

                            <Modal open={openItem} onClose={this.onCloseModal} center>
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title f-w-600" id="exampleModalLabel2">Discount Assigned on {assignedItemType || 'Nothing'}</h5>
                                </div>
                                <div className="modal-body">
                                    <h4>Item List: </h4>
                                    <ListGroup>
                                        {assignedItems.map(item => (
                                            <ListGroup.Item>{item.name || item.title}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </Modal>

                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/discounts"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    extraColumns={[
                                        {
                                            Header: <b>Assigned Items</b>,
                                            id: 'view_item',
                                            accessor: str => "view_item",
                                            Cell: (row) => (
                                                <div>
                                                    {userHasPermission(PermissionTypes.PRODUCT.UPDATE) &&
                                                    <span onClick={() => {
                                                        this.onOpenItemModal(row.original);
                                                    }} title="Assigned Items" className="btn btn-sm btn-info">View
                                                    </span>}
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
                                            id: 'view',
                                            accessor: str => "view",
                                            Cell: (row) => (
                                                <div>
                                                    {userHasPermission(PermissionTypes.PRODUCT.UPDATE) &&
                                                    <span onClick={() => {
                                                        window.location.href = `/discounts/edit/${row.original.id}`;
                                                    }} title="edit Discount">
                                                        <i className="fa fa-pencil-square-o" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    {userHasPermission(PermissionTypes.PRODUCT.UPDATE) &&
                                                    <span onClick={() => {
                                                        window.location.href = `/discounts/assign?id=${row.original.id}`;
                                                    }} title="Assign Discount">
                                                        <i className="fa fa-chain" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    {userHasPermission(PermissionTypes.PRODUCT.UPDATE) &&
                                                    <span onClick={() => {
                                                        this.setState({
                                                            discountId: row.original.id
                                                        })
                                                        this.onOpenModal();
                                                    }} title="Change Status">
                                                        <i className="fa fa-unlock-alt" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}></i>
                                                    </span>}
                                                </div>
                                            ),
                                            style: {
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                            sortable: false
                                        }
                                    ]}
                                    excludeColumns={['id', 'categories', 'products', 'productVariances', 'offers']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

