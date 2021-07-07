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

export default class ListDiscount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountId: '',
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
        const PermissionTypes = getPermissionTypes();
        let { open, discountId } = this.state;
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
                                <Link to="/discounts/create" className="btn btn-secondary">Create Discount</Link>
                            </div>
                            <div className="clearfix"></div>

                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <PaginatedDatatable
                                    url="/api/discounts"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    takeColumns={['id', 'name', 'discount_amount', 'discount_percentage', 'start_date', 'end_date', 'status']}
                                    extraQuery="type=discount"
                                    modifyColumns={
                                        [
                                            /*{
                                                key: 'roles',
                                                name: 'Roles',
                                                modifier: (roles) => roles.map(role => role.name).join(', ')
                                            }*/
                                        ]
                                    }
                                    extraColumns={[
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
                                                        <i className="fa fa-pencil-square-o" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                                        ></i>
                                                    </span>}

                                                    { row.original.isFrozen && userHasPermission(PermissionTypes.PRODUCT.UPDATE) &&
                                                        <span onClick={() => {
                                                            this.setState({
                                                                discountId: row.original.id
                                                            })
                                                            this.onOpenModal();
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

