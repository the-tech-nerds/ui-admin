import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import {Col} from "react-bootstrap";

export class AssignDiscount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            discount: {},
            discountListSubmittable: [],
            discountList: [],
            discountLevels: [{'label': 'Category', 'value': 1}, {'label': 'Product', 'value': 2}, {'label': 'Product variance', 'value': 3}, {'label': 'Offer', 'value': 4}],
            discountLevelNo: 0,
            discountId: 0,

            categoryList: [],
            categoryId: 0,
            offerList: [],
            offerId: 0,
            productList: [],
            productId: 0,
            productVarianceId: 0,
            productVarianceList: [],
            loading: true,
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        console.log('assign id: ', id);
        this.setState({
            discountId: id,
            loading: true
        });

        if(id>0){
            this.fetchDiscountById(id);
        }
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

    fetchDiscountById = (id) => {
        FetchData({
            url: `/api/discounts/${id}`, callback: (response, isSuccess) => {
                console.log('discount', response.data);
                if (isSuccess) {
                    this.setState({
                        discount: response.data,
                    });
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
                    console.log('offers in view: ', response.data);
                    if (isSuccess) {
                        const options = response.data.map(x => {
                            return {
                                label: x.Name,
                                value: x.id
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

    handleChangeOffer = (event) => {
        this.setState((state) => {
            return {
                ...state,
                offerId: event
            }
        });
    }

    handleChangeDiscount = (event) => {
        this.fetchDiscountById(event);

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
            productVarianceId,
            productVarianceList,
            offerId,
            offerList
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
                                                method: 'POST',
                                                url: '/api/discounts/assign',
                                                onSuccess: (response) => {
                                                    window.location.href = '/discount/list';
                                                }
                                            }}
                                        >
                                            <Col md="8">
                                                <Label for="discount_id">Select Discount</Label>

                                                <AvSelect onChange={this.handleChangeDiscount} name="discount_id"
                                                          options={discountList}/>
                                            </Col>

                                            <Col md="8">
                                                <Label for="discount_level">Select Discount Level</Label>
                                                <AvSelect onChange={this.handleChangeDiscountLevel} name="discount_level"
                                                          options={discountLevels} required/>
                                            </Col>

                                            { discountLevelNo === 1 &&
                                            <Col md="8">
                                                <Label for="category_ids">Select Category</Label>

                                                <AvSelect isMulti onChange={this.handleChangeCategory} name="category_ids"
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
                                                <Label for="product_ids">Select Product</Label>

                                                <AvSelect isMulti onChange={this.handleChangeProduct} name="product_ids"
                                                          options={productList}/>
                                            </Col>}


                                            { discountLevelNo === 3 &&
                                            <Col md="8">
                                                <Label for="product_variance_ids">Select Product Variance</Label>
                                                <AvSelect isMulti value={productVarianceId}
                                                          onChange={this.handleChangeProductVariance}
                                                          name="product_variance_ids" options={productVarianceList}/>
                                            </Col>}

                                            { discountLevelNo === 4 &&
                                            <Col md="8">
                                                <Label for="offer_ids">Select Offer</Label>
                                                <AvSelect isMulti value={offerId}
                                                          onChange={this.handleChangeOffer}
                                                          name="offer_ids" options={offerList}/>
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
