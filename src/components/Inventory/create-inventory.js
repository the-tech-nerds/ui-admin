import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import {ShopTypes} from "@the-tech-nerds/common-services";

export class CreateInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inventory: {},
            categoryList: [],
            categoryId: 0,
            shops: [],
            shopId: [],
            productList: [],
            productId: 0,
            productVarianceId: 0,
            productVarianceList: [],
            shopTypeList: ShopTypes,
            inventoryId: 0,
            method: 'POST',
            url: '/api/inventories/',
            loading: true,
        }
    }

    async componentDidMount() {
        console.log('Hello shop type',ShopTypes);
        const id = Number(this.props.match.params.id);
        if (id > 0) {
            this.setState({
                inventoryId: id,
                method: 'PUT',
                url: `/api/inventories/update/${id}`,
                loading: true
            });
            await fetch(`/api/inventories/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache',
                redirect: 'follow',
            })
                .then(async res => {
                    this.setState({loading: false});
                    const response = await res.json();

                    console.log('inventory data :::', response.data);
                    if (response.code === 200) {
                        this.setState((state) => {
                            return {
                                ...state,
                                inventory: response.data,
                            }
                        });
                    } else {
                        this.setState((state) => {
                            return {
                                ...state,
                                error: true,
                                errorMessage: response.message,
                                loading: false,
                            }
                        });
                    }
                })
                .catch(error => {
                    this.setState((state) => {
                        return {
                            ...state,
                            error: true,
                            errorMessage: error,
                            loading: false,
                        }
                    });
                });
        }

        // fetch shops
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        shops: options
                    })

                    const ids = this.state.shops.filter(option => this.state.productVariance.shops && this.state.productVariance.shops.find(shop => shop.id == option.value)).map(el => el.value)
                    this.setState((state) => {
                        return {
                            ...state,
                            shopId: ids
                        }
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        })
    }

    handleChangeShops = (event) => {
        this.setState((state) => {
            return {
                ...state,
                shopId: event
            }
        });

        // get categoryList against selected shop
        FetchData({
            url: `/api/categories/shop/${event}`, callback: (response, isSuccess) => {
                console.log('categories : ', response.data);
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        categoryList: options,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        });
    }

    handleChangeCategory = (event) => {
        this.setState((state) => {
            return {
                ...state,
                categoryId: event
            }
        });

        FetchData({
            url: `/api/products/category/${event}`, callback: (response, isSuccess) => {
                console.log('categories : ', response.data);
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        productList: options,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        });
    }

    handleChangeProduct = (event) => {
        this.setState((state) => {
            return {
                ...state,
                productId: event
            }
        });
        FetchData({
            url: `/api/product-variances/${event}`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x['Variance Title'],
                            value: x['id']
                        };
                    });
                    this.setState({
                        productVarianceList: options,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        });
    }

    handleChangeVariance = (event) => {
        this.setState((state) => {
            return {
                ...state,
                productVarianceId: event
            }
        });
    }

    render() {
        const {
            inventory,
            shops,
            shopId,
            categoryList,
            categoryIds,
            inventoryId,
            productId,
            productList,
            productVarianceId,
            productVarianceList,
            method,
            url,
            shop_type_id,
            shopTypeList
        } = this.state;
        return (
            <App>
                <Breadcrumb title={inventoryId > 0 ? 'update' : 'create'} parent="inventory"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{inventoryId > 0 ? 'Update Inventory' : 'Add Inventory'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="col-xl-12">
                                        <Forms
                                            options={{
                                                method: method,
                                                url: url,
                                                onSuccess: (response) => {
                                                    window.location.href = '/inventories/list';
                                                }
                                            }}
                                        >
                                            <AvGroup>
                                                <Label for="type_id">Select Shop Type</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeShopType} name="type_id"
                                                          options={shopTypeList} required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeShopType} name="type_id"
                                                          value={shop_type_id}
                                                          options={shopTypeList} required/>}
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="shop_id">Select Shops</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeShops} name="shop_id"
                                                          options={shops} required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeShops} name="shop_id"
                                                          value={shopId}
                                                          options={shops} required/>}
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="category_id">Select Category</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeCategory} name="category_id"
                                                          options={categoryList} required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeCategory} value={categoryIds}
                                                          name="category_id" options={categoryList} required/>}
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="product_id">Select Product</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeProduct} name="product_id"
                                                          options={productList} required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeProduct} value={productId}
                                                          name="product_id" options={productList} required/>}
                                            </AvGroup>
                                            {/* @todo product variances depend on product*/}
                                            <AvGroup>
                                                <Label for="product_variance_id">Select Product Variance</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect name="product_variance_id" options={productVarianceList}
                                                          required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeProductVariance}
                                                          value={productVarianceId} name="product_variance_id"
                                                          options={productVarianceList} required/>}
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="name">Price</Label>
                                                <AvField className="form-control" name="price" value={inventory.price}
                                                         placeholder="Stock Price" type="text" required/>
                                            </AvGroup>

                                            <AvInput type="textarea" name="stock_count" value={inventory.stock_count}
                                                     placeholder="Stock Count"/>

                                            {inventoryId == 0 && <Button name="status" value="1" color="primary"
                                                                         className="mt-3">Save</Button>}
                                            {inventoryId == 0 &&
                                            <Button name="status" value="0" color="warning" className="mt-3">Save as
                                                Draft</Button>}
                                            {inventoryId > 0 &&
                                            <Button color="primary" className="mt-3">Update</Button>}
                                        </Forms>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default CreateInventory
