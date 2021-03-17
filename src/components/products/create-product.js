import React, {Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Label} from "reactstrap";
import MyDropzone from "../common/dropzone";
import CKEditors from "react-ckeditor-component";
import one from "../../assets/images/pro3/1.jpg";
import * as fetch from "isomorphic-fetch";

export class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            categoryList: [],
            brands: [],
            shops: [],
            productId: 0,
            method: 'POST',
            url: '/api/products/',
            loading: true
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        // fetch brands
        FetchData({
            url: '/api/brands/list/all', callback: (response, isSucess) => {
                if (isSucess) {
                    console.log('brands : ',response.data);
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    console.log('in pr. get brands: ', options);
                    this.setState({
                        brands: options
                    })
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        })

        // fetch shops
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSucess) => {
                if (isSucess) {
                    console.log('shops : ',response.data);
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        shops: options
                    })
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    })
                }
            }
        })

        //fetch categories
        FetchData({
            url: '/api/categories', callback: (response, isSucess) => {
                console.log('categories : ',response.data);
                if (isSucess) {
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
        })

        this.setState({
            productId: id,
            method: 'PUT',
            url: `/api/products/update/${id}`,
            loading: true
        });
        await fetch(`/api/products/${id}`, {
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
                            product: response.data
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

    render() {
        const {product, brands, categoryList, shops, productId} = this.state;
        return (
            <App>

                <Breadcrumb title={productId > 0 ? 'update' : 'create'} parent="product"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add Product</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row product-adding">
                                        <div className="col-xl-5">
                                            <div className="add-product">
                                                <div className="row">
                                                    <div className="col-xl-9 xl-50 col-sm-6 col-9">
                                                        <img src={one} alt=""
                                                             className="img-fluid image_zoom_1 blur-up lazyloaded"/>
                                                    </div>
                                                    {/*<div className="col-xl-3 xl-50 col-sm-6 col-3">
                                                        <ul className="file-upload-product">
                                                            {
                                                                this.state.dummyimgs.map((res, i) => {
                                                                    return (
                                                                        <li key={i}>
                                                                            <div className="box-input-file">
                                                                                <input className="upload" type="file" onChange={(e) => this._handleImgChange(e, i)} />
                                                                                <img src={res.img} style={{ width: 50, height: 50 }} />
                                                                                <a id="result1" onClick={(e) => this._handleSubmit(e.target.id)}></a>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-7">
                                            <Forms
                                                options={{
                                                    method: 'POST',
                                                    url: '/api/products',
                                                    onSuccess: (response) => {
                                                        window.location.href = '/products/list';
                                                    }
                                                }}
                                            >
                                                <AvGroup>
                                                    <Label for="shop_id">Select Shop</Label>
                                                    <AvSelect name="shop_id" options={shops} required/>
                                                </AvGroup>
                                                <AvGroup>
                                                    <Label for="category_id">Select category</Label>
                                                    <AvSelect name="category_id" options={categoryList} required/>
                                                </AvGroup>
                                                <AvGroup>
                                                    <Label for="brand_id">Select Brand</Label>
                                                    <AvSelect name="brand_id" options={brands} required/>
                                                </AvGroup>

                                                <AvGroup>
                                                    <Label for="name">Product Name</Label>
                                                    <AvField className="form-control" name="name" type="text" required/>
                                                </AvGroup>

                                                {/*<div className="digital-add needs-validation">
                                                    <div className="form-group mb-0">
                                                        <div className="description-sm">
                                                            <CKEditors
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "blur": this.onBlur,
                                                                    "afterPaste": this.afterPaste,
                                                                    "change": this.onChange
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>*/}

                                                <AvInput type="textarea" name="description" placeholder="Product Description" />

                                                <button type="submit" className="btn btn-primary mt-3">Add</button>
                                            </Forms>
                                        </div>
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

export default CreateProduct
