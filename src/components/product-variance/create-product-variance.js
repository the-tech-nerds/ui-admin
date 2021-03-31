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

export class CreateProductVariance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productVariance: {},
            units: [],

            contentInfo: {
                entity: 'product-variance',
                folder: 'product-variance',
                entity_id: Number(this.props.match.params.id) || 0,
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            files: [],
            shops: [],
            shopIds:[],
            unitId:0,

            productId: Number(this.props.match.params.productId) || 0,
            productVarianceId: 0,
            method: 'POST',
            url: '/api/product-variances/' + Number(this.props.match.params.productId),
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
                productVarianceId: id,
                method: 'PUT',
                url: `/api/product-variances/${this.state.productId}/update/${id}`,
                loading: true
            });

            FetchData({
                url: `/api/product-variances/single/${id}`, callback: (response, isSuccess) => {
                    this.setState({loading: false});
                    if (isSuccess) {
                        this.setState((state) => {
                            return {
                                ...state,
                                productVariance: response.data.productVariance,
                                files: response.data.images
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

                    const ids = this.state.shops.filter(option => this.state.productVariance.shops && this.state.productVariance.shops.includes(option.value)).map(el => el.value)
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
        // fetch units
        FetchData({
            url: '/api/units/list/all/', callback: (response, isSucess) => {
                if (isSucess) {
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        units: options
                    })

                    const id = this.state.units.filter(option => option.value === this.state.productVariance.unit_id).map(el => el.value)[0]
                    this.setState((state) => {
                        return {
                            ...state,
                            unitId: id
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
    }

    handleChangeUnit = (event) => {
        this.setState((state) => {
            return {
                ...state,
                unitId: event
            }
        });
    }

    render() {
        const {
            productVariance,
            productVarianceId,
            productId,
            units,
            unitId,
            files,
            uploadIds,
            contentInfo,
            method,
            url,
            shops,
            shopIds,
        } = this.state;
        return (
            <App>

                <Breadcrumb title={productVarianceId > 0 ? 'update' : 'create'} parent="productVariance"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{productVarianceId > 0 ? 'Update Product Variance' : 'Add Product Variance'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="add-product">
                                        <div className="card ">
                                            <div className="card-header">
                                                <h5>Product Variance Media</h5>
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
                                                            type: 'product-variance',
                                                            type_id: response.data.id,
                                                            microService: 'product'
                                                        });
                                                    });
                                                    if (items.length === 0) {
                                                        window.location.href = `/product/${productId}/variance/list`;
                                                        return;
                                                    }
                                                    await updateFileStorage(items).then(response => {
                                                        window.location.href = `/product/${productId}/variance/list`;
                                                    });
                                                }
                                            }}
                                        >
                                            <AvGroup>
                                                <Label for="title">Variance Title</Label>
                                                <AvField className="form-control" name="title"
                                                         value={productVariance.title} type="text" required/>
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="price">Variance Price</Label>
                                                <AvField className="form-control" name="price"
                                                         value={productVariance.price} type="text" required/>
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="color">Variance Color</Label>
                                                <AvField className="form-control" name="color"
                                                         value={productVariance.color} type="text"/>
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="unit_id">Select Unit</Label>
                                                {productVarianceId === 0 && <AvSelect name="unit_id" options={units}/>}
                                                {productVarianceId > 0 && <AvSelect onChange={this.handleChangeUnit} name="unit_id"
                                                                                    value={unitId}
                                                                                    options={units}/>}
                                            </AvGroup>

                                            <AvGroup>
                                                <Label for="unit_value">Unit Value</Label>
                                                <AvField className="form-control" name="unit_value"
                                                         value={productVariance.unit_value} type="text"/>
                                            </AvGroup>
                                            <AvGroup>
                                                <Label for="shop_ids">Select Shops</Label>
                                                {productId === 0 &&
                                                <AvSelect isMulti name="shop_ids" options={shops} required/>}
                                                {productId > 0 &&
                                                <AvSelect isMulti onChange={this.handleChangeShops} name="shop_ids"
                                                          value={shopIds}
                                                          options={shops} required/>}
                                            </AvGroup>
                                            {productVarianceId === 0 && <Button color="primary">Create</Button>}
                                            {productVarianceId > 0 && <Button color="primary">Update</Button>}
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

export default CreateProductVariance
