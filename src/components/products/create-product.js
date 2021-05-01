import React, {Component} from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField, AvGroup} from "availity-reactstrap-validation";
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import FetchData from "../common/get-data";
import {Button, Label} from "reactstrap";
import MyUploader from "../common/dropzone";
import {DropzoneStatus} from "../../constants/dropzoneStatus";
import updateFileStorage from "../common/file-storage";
import CKEditors from "react-ckeditor-component";
import { MultilevelSelect } from '../common/multilevel-select';

export class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            categoryList: [],
            categoryIds: [],
            brands: [],
            brandId: 0,

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
            description: ''
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
        } else if (response.status == DropzoneStatus.REMOVE_EXISTING_ITEM) {
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
                    this.setState({loading: false});
                    const response = await res.json();

                    if (response.code === 200) {
                        response.data.product.categories = response.data.product.categories.map(category => category.id);

                        this.setState((state) => {
                            return {
                                ...state,
                                product: response.data.product,
                                files: response.data.images,
                                description: response.data.product.description
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
                    
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        brands: options
                    })

                    const id = this.state.brands.filter(option => option.value === this.state.product.brand_id).map(el => el.value)[0];

                    this.setState((state) => {
                        return {
                            ...state,
                            brandId: id
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

        //fetch categories
        FetchData({
            url: '/api/categories/menu/all', callback: (response, isSucess) => {
                if (isSucess) {
                    const selectedCategorys = [];
                    const remapCategories = categories => categories.map(category => {
                        const selected = this.state.product?.categories?.includes(category.id) || false;
                        if (selected) {
                            selectedCategorys.push(category.id);
                        }
                        return {
                            id: category.id,
                            label: category.name,
                            children: remapCategories(category.children),
                            checked: selected,
                        }
                    });
                    const options = remapCategories(response.data);

                    this.setState({
                        categoryList: options,
                    });

                    // const ids = this.state.categoryList.filter(option => this.state.product.categories.includes(option.value)).map(el => el.value)
                    this.setState((state) => {
                        return {
                            ...state,
                            categoryIds: selectedCategorys
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

    onChange = (event) => {
        this.setState((state) => {
            return {
                ...state,
                description: event.editor.getData(),
            }
        });
    }

    handleChangeCategories = (_, selectedNodes) => {
        this.setState({
            categoryIds: selectedNodes.map(({ id }) => id),
        });
    }

    handleChangeBrand = (event) => {
        this.setState((state) => {
            return {
                ...state,
                brandId: event
            }
        });
    }

    render() {
        const {product, brands, brandId, categoryList, categoryIds, productId, shops, files, uploadIds, contentInfo, method, url, description, error, errorMessage} = this.state;
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
                                                }} content={contentInfo}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        {error && <span className="text-danger">{errorMessage}</span>}
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
                                                    await updateFileStorage(items).then(response => {
                                                        window.location.href = '/products/list';
                                                    });
                                                },
                                                dataProcessBeforeSubmit: (value, callback) => {
                                                    if (!this.state.categoryIds.length) {
                                                        this.setState({
                                                            error: true,
                                                            errorMessage: "Select atleast one category",
                                                        })
                                                        return;
                                                    }
                                                    callback({
                                                        ...value,
                                                        description: description,
                                                        category_ids: this.state.categoryIds,
                                                    });
                                                },
                                            }}
                                        >
                                            <AvGroup>
                                                <Label>Select category</Label>
                                                <MultilevelSelect 
                                                        data={categoryList}
                                                        onChange={this.handleChangeCategories}
                                                />
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="brand_id">Select Brand</Label>
                                                {productId == 0 &&
                                                <AvSelect name="brand_id" options={brands} required/>}
                                                {productId > 0 &&
                                                <AvSelect onChange={this.handleChangeBrand} name="brand_id"
                                                          value={brandId} options={brands} required/>}
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="name">Product Name</Label>
                                                <AvField className="form-control" name="name" value={product.name}
                                                         type="text" required/>
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

                                            {/* <AvInput type="textarea" name="description" value={product.description} placeholder="Product Description" /> */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <label>Description</label>
                                                    <CKEditors
                                                        activeclassName="p10"
                                                        content={description}
                                                        events={{
                                                            "blur": this.onBlur,
                                                            "afterPaste": this.afterPaste,
                                                            "change": this.onChange
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

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
