import React, {Component, Fragment} from 'react';
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable'
import App from "../app";
import {Link} from 'react-router-dom';


export class ListShop extends Component {
    render() {
        return (
            <App>
                <Breadcrumb title="Shop List" parent="Shops"/>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Shop List</h5>
                        </div>
                        <div className="card-body">
                            <div className="btn-popup pull-right">
                                <Link to="/shops/create" className="btn btn-secondary">Create Shop</Link>
                            </div>
                            <div className="clearfix"></div>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/shops/list/all"
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
                                                        window.location.href = `/shops/edit/${row.original.id}`;
                                                    }} title="Edit shop">
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
                                    excludeColumns={['id', 'type_id']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}


export default ListShop
