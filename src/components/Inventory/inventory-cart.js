import React, {Component} from 'react';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from "../common/datatable";

export default class InventoryCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryList: props.inventoryList,
            inventoryId: '',
            open: false,
            openStatus: false,
            error: false,
            errorMessage: null,
        };
    }

    componentDidMount() {

    }

    onOpenStatusModal = () => {
        this.setState({openStatus: true});
    };

    onCloseModal = () => {
        this.setState({open: false, openStatus: false});
    };

    render() {
        console.log(this.props.inventoryList);
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h5>Temporary Inventory List</h5>
                    </div>
                    <div className="card-body">
                        <div id="batchDelete"
                             className="inventory-table inventory-list order-table coupon-list-delete">
                            <Datatable
                                myData={[...this.props.inventoryList]}
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

