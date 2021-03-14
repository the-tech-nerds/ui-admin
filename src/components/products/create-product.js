import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import MyDropzone from "../common/dropzone";
import CKEditors from "react-ckeditor-component";
import one from "../../assets/images/pro3/1.jpg";

export class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            productId: 0,
            method: 'POST',
            url: '/api/products/',
            loading: true
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
       if(id > 0) {

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


    }
    render() {
        const {product, productId, method, url} = this.state;
        return (
            <App>

                <Breadcrumb title={productId>0? 'update' : 'create'} parent="product" />
                <div className="container-fluid">
                    {/*<div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{ productId>0? 'Update product' : 'Add product'}</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: method,
                                            url: url,
                                            onSuccess: (response) => {
                                                window.location.href ='/products/list';
                                            }
                                        }}
                                    >
                                        <AvField name="name" label="Name" value = {product.name} type="text" required />
                                        <AvField name="description" value= {product.description} label="Description" type="text" required />
                                       {productId== 0 && <Button color="primary">Create</Button>}
                                       {productId > 0 && <Button color="primary">Update</Button>}
                                    </Forms>
                                </div>
                            </div>
                        </div>
                    </div>*/}

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
                                                        <img src={one} alt="" className="img-fluid image_zoom_1 blur-up lazyloaded" />
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
                                                        window.location.href ='/list-products';
                                                    }
                                                }}
                                            >
                                                <div className="form form-label-center">
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Product Name :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control" name="name" id="validationCustom01" type="text" required />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                </div>
                                                <div className="offset-xl-3 offset-sm-4">
                                                    <button type="submit" className="btn btn-primary">Add</button>
                                                </div>
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
