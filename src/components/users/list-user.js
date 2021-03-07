import React, { Component, Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
//import data from '../../assets/data/listUser';
import Datatable from '../common/datatable'
import App from "../app";


export class List_user extends Component {
    render() {
        return (
            <App>
                <Breadcrumb title="User List" parent="Users" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>User List</h5>
                        </div>
                        <div className="card-body">
                            <div className="clearfix"></div>
                            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
                                <Datatable
                                    url="/api/users/"
                                    pageSize={10}
                                    pagination={true}
                                    class="-striped -highlight"
                                    renameColumns={{
                                        'is_active': 'Active'
                                    }}
                                    takeColumns={['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']}
                                    // excludeColumns={['id']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default List_user
