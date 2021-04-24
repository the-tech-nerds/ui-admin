import React, { Component, Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable'
import App from "../app";
import { Link } from 'react-router-dom';
import {userHasPermission, getPermissionTypes} from "../../utils/utils";

 const ListUnit = () =>{
    const PermissionTypes = window.permission_types !== 'undefined' ? getPermissionTypes() : null;
        return (
            <App>
                <Breadcrumb title="unit list" parent="product" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Unit List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                {PermissionTypes && userHasPermission(PermissionTypes.UNIT.CREATE) &&
                                <Link to="/units/create" className="btn btn-secondary">Create Unit</Link>}
                            </div>
                            <div className="clearfix"></div>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/units/list/all"
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
                                                        window.location.href = `/units/edit/${row.original.id}`;
                                                    }} title="Edit unit">
                                                        <i className="fa fa-edit" style={{
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


export default ListUnit
