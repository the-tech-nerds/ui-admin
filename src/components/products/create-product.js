import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import MyUploader from "../common/dropzone";
import {DropzoneStatus} from "../../constants/dropzoneStatus";
import updateFileStorage from "../common/file-storage";

export class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            categoryList: [],
            categoryIds: [],
            brands: [],
            shops: [],

            contentInfo: {
                entity: 'product',
                folder: 'product',
                entity_id: Number(this.props.match.params.id) || 0,
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            files: [],

            productId: 0,
            method: 'POST',
            url: '/api/products/',
            loading: true,
        }
    }

    handleUploadResponse = (response) => {
        if (response.status == DropzoneStatus.UPLOAD_SUCCESS) {
            let ids = this.state.uploadIds;
            let imgs = this.state.images;
            ids.push(response.data.id)
            imgs.push(response.data.url)
            this.setState({
                uploadIds: ids,
                images: imgs
            });
        } else if (response.status == DropzoneStatus.REMOVE_UPLOADED_ITEM) {
            const urls = this.state.images.filter(i => i !== response.data.url);
            const ids = this.state.uploadIds.filter(u => u !== response.data.id)
            this.setState({
                uploadIds: ids,
                images: urls
            });
        }
        else if (response.status == DropzoneStatus.REMOVE_EXISTING_ITEM) {
            const file = this.state.files.filter(i => i.id !== response.data.id);
            this.setState((state) => {
                return {
                    ...state,
                    files: file,
                }
            });
        }
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);

        if (id > 0) {

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
                    this.setState({ loading: false });
                    const response = await res.json();

                    console.log('product data :::', response.data.product);
                    if (response.code === 200) {
                        response.data.product.categories = response.data.product.categories.map(category => category.id);

                        console.log('product data after manipulation :::', response.data.product);
                        this.setState((state) => {
                            return {
                                ...state,
                                product: response.data.product,
                                files: response.data.images
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
    }

    render() {
        const {product, brands, categoryList, shops, productId, files, uploadIds, contentInfo, method, url} = this.state;
        return (
            <App>

                <Breadcrumb title={productId > 0 ? 'update' : 'create'} parent="product"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{productId > 0 ? 'Update Product' : 'Add Product'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="add-product">
                                        <div className="card ">
                                            <div className="card-header">
                                                <h5>Product Media</h5>
                                            </div>
                                            <div className="card-body">
                                                <MyUploader options={{
                                                    images: files,
                                                    onUploadSuccess: (response) => {
                                                        this.handleUploadResponse(response);
                                                    }
                                                }} content={contentInfo} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <Forms
                                            options={{
                                                method: method,
                                                url: url,
                                                onSuccess: async (response) => {
                                                    let items = []
                                                    await uploadIds.forEach(x => {
                                                        items.push({
                                                            id: Number(x),
                                                            url: '',
                                                            type: 'product',
                                                            type_id: response.data.id,
                                                            microService: 'product'
                                                        });
                                                    });
                                                    if (items.length === 0) {
                                                        window.location.href = '/products/list';
                                                        return;
                                                    }
                                                    await updateFileStorage(items).then(response =>{
                                                        window.location.href = '/products/list';
                                                    } );
                                                }
                                            }}
                                        >
                                            <AvGroup>
                                                <Label for="shop_id">Select Shop</Label>
                                                {productId == 0 && <AvSelect name="shop_id" options={shops} required/>}
                                                {productId > 0 && <AvSelect name="shop_id" value={shops.filter(option => option.value === product.shop_id).map(el => el.value)[0]} options={shops} required/>}
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="category_ids">Select category</Label>
                                                {productId == 0 && <AvSelect isMulti name="category_ids" options={categoryList} required/>}
                                                {productId > 0 && <AvSelect value={categoryList.filter(option => product.categories.includes(option.value)).map(el=>el.value)} isMulti name="category_ids" options={categoryList} required/>}
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="brand_id">Select Brand</Label>
                                                {productId == 0 && <AvSelect name="brand_id" options={brands} required/>}
                                                {productId > 0 && <AvSelect name="brand_id" value={brands.filter(option => option.value === product.brand_id).map(el=>el.value)[0]} options={brands} required/>}
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="name">Product Name</Label>
                                                <AvField className="form-control" name="name" value={product.name} type="text" required/>
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

                                            <AvInput type="textarea" name="description" value={product.description} placeholder="Product Description" />

                                            {productId == 0 && <Button color="primary" className="mt-3">Create</Button>}
                                            {productId > 0 && <Button color="primary" className="mt-3">Update</Button>}
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

export default CreateProduct
