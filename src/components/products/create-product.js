import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup, AvInput} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Label} from "reactstrap";
import MyUploader from "../common/dropzone";
import {DropzoneStatus} from "../../constants/dropzoneStatus";
import updateFileStorage from "../common/file-storage";

export class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            categoryList: [],
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
        const {product, brands, categoryList, shops, productId, files, uploadIds, contentInfo} = this.state;
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
                                        </div>
                                        <div className="col-xl-7">
                                            <Forms
                                                options={{
                                                    method: 'POST',
                                                    url: '/api/products',
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
                                                        console.log(uploadIds)
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
