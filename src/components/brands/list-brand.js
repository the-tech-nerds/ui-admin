import React, { Component, Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable'
import App from "../app";
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

export class ListBrand extends Component {
    render() {
        return (
            <App>
                <Breadcrumb title="Brand list" parent="product" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Brand List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/brands/create/0" className="btn btn-secondary">Create Brand</Link>
                            </div>
                            <div className="clearfix"></div>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/brands/list/all"
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
                                                        window.location.href = `/brands/create/${row.original.id}`;
                                                    }} title="Edit brand">
                                                        <i className="fa fa-edit" style={{
                                                            width: 35,
                                                            fontSize: 20,
                                                            padding: 11,
                                                            color: '#e4566e'
                                                        }}
                                                        />
                                                    </span>
                                                    <span onClick={async () => {
                                                           confirmAlert({
                                                            title: 'Confirm to delete',
                                                            message: 'Are you sure to do this?',
                                                            buttons: [
                                                              {
                                                                label: 'Yes',
                                                                onClick:async () => {
                                                                    await fetch(`/api/brands/${row.original.id}`, {
                                                                        method: 'DELETE',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                      
                                                                    }).then(async res => {
                                                                        const response = await res.json();
                                                                        if(response.code == 200){
                                                                            window.location.href = `/brands/list`;
                                                                        }
                                                                    })
                                                                }
                                                              },
                                                              {
                                                                label: 'No',
                                                              }
                                                            ]
                                                          });
                                                       
                                                       
                                                    }} title="delete brand">
                                                        <i className="fa fa-trash" style={{
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
}


export default ListBrand
