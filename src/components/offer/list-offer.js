import React, { Component, Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable'
import App from "../app";
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

function ListOffer (props) {
        return<App>
                <Breadcrumb title="Offer list" parent="product" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Offer List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/offer/create" className="btn btn-secondary">Create Offer</Link>
                            </div>
                            <div className="clearfix"></div>
                            <div id="offerDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/offers/list/all"
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
                                                        window.location.href = `/offers/edit/${row.original.id}`;
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
                                                                        await fetch(`/api/offers/${row.original.id}`, {
                                                                            method: 'DELETE',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                            },

                                                                        }).then(async res => {
                                                                            const response = await res.json();
                                                                            if(response.code == 200){
                                                                                window.location.href = `/offers/list`;
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

}


export default ListOffer
