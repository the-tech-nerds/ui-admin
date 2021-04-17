import React, {Component} from 'react';
import App from "../app";
import Breadcrumb from '../common/breadcrumb';
import Datatable from "../common/datatable";
import {Table} from "react-bootstrap";
import {Button} from "reactstrap";
import Forms from "../form/forms";

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
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h5 className='d-inline-block'>Temporary Inventory List</h5>
                        <Button name="status" value="1" color="primary"
                                className="mt-3 pull-right" onClick={this.props.saveInventory}>Save</Button>
                    </div>
                    <div className="card-body">
                        <div id="batchDelete"
                             className="inventory-table inventory-list order-table coupon-list-delete">
                            <Table className="striped bordered hover">
                                <thead>
                                <tr>
                                    <th>Shop Type</th>
                                    <th>Shops</th>
                                    <th>Category</th>
                                    <th>Product</th>
                                    <th>Product Variance</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                    <th>Stock Count</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.inventoryList.map((el, index) =>
                                    (
                                        <tr key={index + parseInt((Math.random() * 10000) + '') + ''}>
                                            <td>{el.shop_type}</td>
                                            <td>{el.shops}</td>
                                            <td>{el.category}</td>
                                            <td>{el.product}</td>
                                            <td>{el.product_variance}</td>
                                            <td>{el.status}</td>
                                            <td>{el.price}</td>
                                            <td>{el.stock_count}</td>
                                            <td>
                                                <span style={{cursor: 'pointer', color: 'red'}}
                                                      className="mt-3 pull-right"
                                                      onClick={() => this.props.deleteInventory(index)}><i
                                                    className="fa fa-2x fa-trash-o"/></span>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

