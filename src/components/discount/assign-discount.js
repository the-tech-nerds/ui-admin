import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import queryString from 'query-string';
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import {Col} from "react-bootstrap";

export class AssignDiscount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            discountListSubmittable: [],
            discountList: [],
            discountLevels: [{'label': 'Category', 'value': 1}, {'label': 'Product', 'value': 2}, {'label': 'Product variance', 'value': 3}, {'label': 'Offer', 'value': 4}],
            discountLevelNo: 0,
            discountId: Number(queryString.parse(this.props.location.search).id),

            categoryList: [],
            offerList: [],
            productList: [],
            productVarianceId: 0,
            productVarianceList: [],
            loading: true,
        }
    }

    async componentDidMount() {
        // get discountList
        FetchData({
            url: `/api/discounts`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.filter(discount => discount.Status.toLowerCase() === 'active').map(x => {
                        return {
                            label: `${x.Name} (amount: ${x.Amount || 0} - percentage: ${x.Percentage || 0+'%'})`,
                            value: x.id
                        };
                    });
                    this.setState({
                        discountList: options,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        });

        // get categoryList
        FetchData({
            url: `/api/categories`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x
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

        if(event === 4){
            // get Offers
            FetchData({
                url: `/api/offers/list/all`, callback: (response, isSuccess) => {
                    if (isSuccess) {
                        const options = response.data.map(x => {
                            return {
                                label: x.Name,
                                value: x
                            };
                        });
                        this.setState({
                            offerList: options,
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
    }

    handleChangeCategory = (event) => {
        FetchData({
            url: `/api/products/category/${event.id}`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x
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
        FetchData({
            url: `/api/product-variances/${event.id}`, callback: (response, isSuccess) => {
                if (isSuccess) {
                    const options = response.data.map(x => {
                        return {
                            label: `${x['Variance Title']} (${x['Price']} BDT)`,
                            value: x
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

    handleChangeDiscount = (event) => {
        this.setState((state) => {
            return {
                ...state,
                discountId: event
            }
        });
    }

    render() {
        const {
            discountList,
            categoryList,
            discountId,
            discountLevels,
            discountLevelNo,
            productList,
            productVarianceList,
            offerList
        } = this.state;
        return (
            <App>
                <Breadcrumb title="Assign" parent="discount"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Assign Discount</h5>
                                </div>
                                <div className="card-body">
                                    <div className="col-xl-12">
                                        <Forms
                                            options={{
                                                method: 'POST',
                                                url: '/api/discounts/assign',
                                                onSuccess: (response) => {
                                                    window.location.href = '/discount/list';
                                                }
                                            }}
                                        >
                                            <Col md="8">
                                                <Label for="discount_id">Select Discount</Label>

                                                <AvSelect onChange={this.handleChangeDiscount} name="discount_id" value={discountId}
                                                          options={discountList}/>
                                            </Col>

                                            <Col md="8">
                                                <Label for="discount_level">Select Discount Level</Label>
                                                <AvSelect onChange={this.handleChangeDiscountLevel} name="discount_level"
                                                          options={discountLevels} required/>
                                            </Col>

                                            { discountLevelNo === 1 &&
                                            <Col md="8">
                                                <Label for="categories">Select Category</Label>

                                                <AvSelect isMulti name="categories"
                                                          options={categoryList}/>
                                            </Col>}

                                            { discountLevelNo !== 4 && discountLevelNo > 1 &&
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
                                                <Label for="products">Select Product</Label>

                                                <AvSelect isMulti name="products"
                                                          options={productList}/>
                                            </Col>}


                                            { discountLevelNo === 3 &&
                                            <Col md="8">
                                                <Label for="product_variances">Select Product Variance</Label>
                                                <AvSelect isMulti
                                                          name="product_variances" options={productVarianceList}/>
                                            </Col>}

                                            { discountLevelNo === 4 &&
                                            <Col md="8">
                                                <Label for="offers">Select Offer</Label>
                                                <AvSelect isMulti
                                                          name="offers" options={offerList}/>
                                            </Col>}

                                            <Col md='8'>
                                                <Button color="primary" className="mt-3">Assign</Button>
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

export default AssignDiscount
