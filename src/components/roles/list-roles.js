import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom'
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';

export default class ListRole extends Component {
    render() {
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
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/roles"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    extraColumns={[
                                        {
                                            Header: <b>Show</b>,
                                            id: 'view',
                                            accessor: str => "view",
                                            Cell: (row) => (
                                                <div>
                                                    <span onClick={() => {
                                                        window.location.href = `/roles/${row.original.id}`;
                                                    }}>
                                                        <i className="fa fa-eye" style={{
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
                                        {
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
                                        },{
                                            Header: <b>Details</b>,
                                            id: 'details',
                                            accessor: str => "details",
                                            Cell: (row) => (
                                                <div>
                                                    <span onClick={() => {
                                                        window.location.href = `/roles/${row.original.id}/details`;
                                                    }}>
                                                        <i className="fa fa-street-view" style={{
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
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

