import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import InventoryCart from "./inventory-cart";

export class CreateInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inventory: {},
            inventoryListSubmittable: [],
            inventoryList: [],
            categoryList: [],
            categoryId: 0,
            shops: [],
            shopIds: [],
            productList: [],
            productId: 0,
            productVarianceId: 0,
            productVarianceList: [],
            shopTypeList: [
                {
                    label: 'Grocery',
                    value: 1,
                },
                {label: 'Restaurant', value: 2},
            ],
            shop_type_id: 0,
            inventoryId: 0,
            method: 'POST',
            url: '/api/inventories/',
            loading: true,
        }
    }

    async componentDidMount() {
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
    }

    deleteSingleInventoryHandle = (index) => {
        // this.state.inventoryList.splice(index, 1);
    }
    editSingleInventoryHandle = (index) => {
        // this.setState((preState) => ({
        //     ...preState,
        //     inventory: this.state.inventoryList[index],
        // }));
    }
    saveInventoryCartHandle = (event) => {
        event.preventDefault();
        const type_id = document.getElementsByName('type_id')[0].value;
        const shop_ids = [];
        document.getElementsByName('shop_ids')?.forEach(el => shop_ids.push(el.value));
        const category_id = document.getElementsByName('category_id')[0].value;
        const product_id = document.getElementsByName('product_id')[0].value;
        const product_variance_id = document.getElementsByName('product_variance_id')[0].value;
        const inventoryList = [...this.state.inventoryList, {
            shop_type: [...this.state.shopTypeList]?.filter(d => d.value == type_id)[0]?.label,
            shops: [...this.state.shops]?.filter(d => shop_ids.includes(d.value + ''))?.reduce((shops, shop) => (shops + shop.label + ', '), '').slice(0, -2),
            category: [...this.state.categoryList]?.filter(d => d.value == category_id)[0]?.label,
            product: [...this.state.productList]?.filter(d => d.value == product_id)[0]?.label,
            product_variance: [...this.state.productVarianceList]?.filter(d => d.value == product_variance_id)[0]?.label,
        }];
        const inventoryListSubmittable = [...this.state.inventoryListSubmittable, {
            type_id: type_id,
            shop_ids: shop_ids,
            category_id: category_id,
            product_id: product_id,
            product_variance_id: product_variance_id,
        }];
        console.log(inventoryListSubmittable, inventoryList);
        this.setState({
            inventoryListSubmittable: inventoryListSubmittable,
            inventoryList: inventoryList
        });
        console.log(this.state);
    }
    handleChangeShopType = (event) => {
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.filter(shop => event === shop.type_id).map(x => {
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
                            shopIds: ids
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
                shopIds: event
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


    handleChangeProductVariance = (event) => {
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
            shopIds,
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
        console.log("rana");
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
                                            {inventoryId === 0 && <AvGroup>
                                                <Label for="type_id">Select Shop Type</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeShopType} name="type_id"
                                                          options={shopTypeList} required/>}
                                                {/*{inventoryId > 0 &&*/}
                                                {/*<AvSelect onChange={this.handleChangeShopType} name="type_id"*/}
                                                {/*          value={shop_type_id}*/}
                                                {/*          options={shopTypeList} required/>}*/}
                                            </AvGroup>}
                                            {inventoryId === 0 && <AvGroup>
                                                <Label for="shop_ids">Select Shops</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect isMulti onChange={this.handleChangeShops} name="shop_ids"
                                                          options={shops} required/>}
                                                {/*{inventoryId > 0 &&*/}
                                                {/*<AvSelect isMulti onChange={this.handleChangeShops} name="shop_ids"*/}
                                                {/*          value={shopIds}*/}
                                                {/*          options={shops} required/>}*/}
                                            </AvGroup>}
                                            {inventoryId === 0 && <AvGroup>
                                                <Label for="category_id">Select Category</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeCategory} name="category_id"
                                                          options={categoryList} required/>}
                                                {/*{inventoryId > 0 &&*/}
                                                {/*<AvSelect onChange={this.handleChangeCategory} value={categoryIds}*/}
                                                {/*          name="category_id" options={categoryList} required/>}*/}
                                            </AvGroup>}
                                            {inventoryId === 0 && <AvGroup>
                                                <Label for="product_id">Select Product</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect onChange={this.handleChangeProduct} name="product_id"
                                                          options={productList} required/>}
                                                {/*    {inventoryId > 0 &&*/}
                                                {/*    <AvSelect onChange={this.handleChangeProduct} value={productId}*/}
                                                {/*              name="product_id" options={productList} required/>}*/}
                                            </AvGroup>}
                                            <AvGroup>
                                                <Label for="product_variance_id">Select Product Variance</Label>
                                                {inventoryId === 0 &&
                                                <AvSelect value={productVarianceId} readOnly={true}
                                                          name="product_variance_id" options={productVarianceList}
                                                          required/>}
                                                {inventoryId > 0 &&
                                                <AvSelect onChange={this.handleChangeProductVariance}
                                                          value={productVarianceId} name="product_variance_id"
                                                          options={productVarianceList} required/>}
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="name">Price</Label>
                                                <AvField className="form-control" name="price"
                                                         value={inventory.price}
                                                         placeholder="Stock Price" type="text" required/>
                                            </AvGroup>

                                            <AvInput type="textarea" name="stock_count"
                                                     value={inventory.stock_count}
                                                     placeholder="Stock Count"/>

                                            {inventoryId == 0 && <Button name="status" value="1" color="primary"
                                                                         className="mt-3">Save</Button>}
                                            {inventoryId == 0 &&
                                            <Button onClick={this.saveInventoryCartHandle} name="status" value="0"
                                                    color="warning" className="mt-3">Save as
                                                Draft</Button>
                                            }
                                            {inventoryId > 0 &&
                                            <Button color="primary" className="mt-3">Update</Button>}
                                        </Forms>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <InventoryCart inventoryList={this.state.inventoryList}
                               deleteInventory={this.deleteSingleInventoryHandle}
                               editInventory={this.editSingleInventoryHandle}/>
            </App>
        )
    }
}

export default CreateInventory
