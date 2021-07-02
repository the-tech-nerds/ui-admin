import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import {Col} from "react-bootstrap";

export class CreateDiscount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            discount: {},
            discountListSubmittable: [],
            discountList: [],
            discountLevels: [{'label': 'Category', 'value': 1}, {'label': 'Product', 'value': 2}, {'label': 'Product variance', 'value': 3}],
            discountLevelNo: 0,
            discountId: 0,

            categoryList: [],
            categoryId: 0,
            productList: [],
            productId: 0,
            productVarianceId: 0,
            productVarianceList: [],

            method: 'POST',
            url: '/api/discounts/',
            loading: true,
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        if (id > 0) {
            this.setState({
                discountId: id,
                method: 'PUT',
                url: `/api/discounts/update/${id}`,
                loading: true
            });
            await fetch(`/api/discounts/${id}`, {
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
                    if (response.code === 200) {
                        this.setState((state) => {
                            return {
                                ...state,
                                discount: response.data,
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

        // get categoryList
        FetchData({
            url: `/api/categories`, callback: (response, isSuccess) => {
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

    handleChangeDiscountLevel = (event) => {
        this.setState((state) => {
            return {
                ...state,
                discountLevelNo: event
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
                            label: `${x['Variance Title']} (${x['Price']} BDT)`,
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
            categoryList,
            discountId,
            discountLevels,
            discountLevelNo,
            productList,
            productVarianceId,
            productVarianceList,
            method,
            url
        } = this.state;
        return (
            <App>
                <Breadcrumb title={discountId > 0 ? 'update' : 'create'} parent="discount"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{discountId > 0 ? 'Update Discount' : 'Add Discount'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="col-xl-12">
                                        <Forms
                                            options={{
                                                method: method,
                                                url: url,
                                                onSuccess: (response) => {
                                                    window.location.href = '/discounts/list';
                                                }
                                            }}
                                        >

                                            <Col md="8">
                                                <Label for="price">Discount Title</Label>
                                                <AvField className="form-control" name="name"
                                                         placeholder="Discount Title" type="text"/>
                                            </Col>

                                            <Col md="8">
                                                <Label for="price">Discount Amount</Label>
                                                <AvField className="form-control" name="discount_amount"
                                                         placeholder="Discount Amount" type="text"/>
                                            </Col>

                                            <Col md="8">
                                                <Label for="price">Discount Percentage</Label>
                                                <AvField className="form-control" name="discount_percentage"
                                                         placeholder="Discount Percentage" type="text"/>
                                            </Col>

                                            <Col md="8">
                                                <Label for="discount_level">Select Discount Level</Label>
                                                <AvSelect onChange={this.handleChangeDiscountLevel} name="discount_level"
                                                          options={discountLevels} required/>
                                            </Col>

                                            { discountLevelNo === 1 &&
                                            <Col md="8">
                                                <Label for="category_id">Select Category</Label>

                                                <AvSelect isMulti onChange={this.handleChangeCategory} name="category_id"
                                                          options={categoryList}/>
                                            </Col>}

                                            { discountLevelNo > 1 &&
                                            <Col md="8">
                                                <Label for="category_id">Select Category</Label>

                                                <AvSelect onChange={this.handleChangeCategory} name="category_id"
                                                          options={categoryList}/>
                                            </Col>}

                                            { discountLevelNo === 3 &&
                                            <Col md="8">
                                                <Label for="product_id">Select Product</Label>

                                                <AvSelect onChange={this.handleChangeProduct} name="product_id"
                                                          options={productList}/>
                                            </Col>}

                                            { discountLevelNo === 2 &&
                                            <Col md="8">
                                                <Label for="product_id">Select Product</Label>

                                                <AvSelect isMulti onChange={this.handleChangeProduct} name="product_id"
                                                          options={productList}/>
                                            </Col>}


                                            { discountLevelNo === 3 &&
                                            <Col md="8">
                                                <Label for="product_variance_id">Select Product Variance</Label>
                                                <AvSelect isMulti value={productVarianceId}
                                                          onChange={this.handleChangeProductVariance}
                                                          name="product_variance_id" options={productVarianceList}/>
                                            </Col>}

                                            <Col md='8'>
                                                {discountId === 0 && <Button color="primary" className="mt-3">Create</Button>}
                                                {discountId > 0 && <Button color="primary" className="mt-3">Update</Button>}
                                            </Col>
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

export default CreateDiscount
