import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import { Button, Label } from "reactstrap";
import { DropzoneStatus } from "../../constants/dropzoneStatus"
import MyUploader from "../common/dropzone";
import AvSelect, {
    AvSelectField,
} from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
import updateFileStorage from "../common/file-storage";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import FetchData from '../common/get-data';
import CKEditors from "react-ckeditor-component";
import AvInput from 'availity-reactstrap-validation/lib/AvInput';

export class CreateShop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shop: undefined,
            contentInfo: {
                entity: 'shop',
                folder: 'shop',
                entity_id: Number(this.props.match.params.id),
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            shop_id: 0,
            method: 'POST',
            url: '/api/shops/',
            loading: true,
            files: [],
            types: [],
            type_id: 0,
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
        FetchData({
            url: '/api/categories/shop/type', callback: (response, isSucess) => {
                if (isSucess) {
                    this.setState((state) => {
                        return {
                            ...state,
                            types: response.data,
                        }
                    });
                }
            }
        })
        const id = Number(this.props.match.params.id);
        if (id > 0) {

            this.setState({
                shop_id: id,
                method: 'PUT',
                url: `/api/shops/update/${id}`,
                loading: true
            });
            await fetch(`/api/shops/${id}`, {
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
                    if (response.code === 200) {
                        this.setState((state) => {
                            return {
                                ...state,
                                shop: response.data.shop,
                                type_id: response.data.shop.type_id,
                                files: response.data.images,
                                description: response.data.shop.description
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
    handleChange = (event) => {
        this.setState((state) => {
            return {
                ...state,
                type_id: event
            }
        });
    }
    onChange = (event) => {
        this.setState((state) => {
            return {
                ...state,
                description: event.editor.getData(),
            }
        });
    }
    render() {
        let { shop, shop_id, method, url, contentInfo, files, uploadIds, type_id, types, description } = this.state;
        return (
            <App>

                <Breadcrumb title={shop_id > 0 ? 'update' : 'create'} parent="Shops" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{shop_id > 0 ? 'Update Shop' : 'Add Shop'}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card ">
                                        <div className="card-header">
                                            <h5>Media</h5>
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
                                                        type: 'shop',
                                                        type_id: response.data.id,
                                                        microService: 'product'
                                                    });
                                                });
                                                if (items.length === 0) {
                                                    window.location.href = '/shops/list';
                                                    return;
                                                }
                                                await updateFileStorage(items).then(response => {
                                                    window.location.href = '/shops/list';
                                                });
                                            },
                                            dataProcessBeforeSubmit: (value, callback) => {
                                                callback({
                                                    ...value,
                                                    description: description
                                                });
                                            },
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-6">
                                                <AvField name="name" label="Name" value={shop?.name} type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <label></label>
                                                {shop && <AvGroup check>
                                                        <AvInput type="checkbox" className="checkbox_animated mt-2" name="is_active" defaultChecked={shop?.is_active} />Is Active!
                                        
                                                </AvGroup>}

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <AvField name="address" value={shop?.address} label="Address" type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <AvGroup>
                                                    <Label for="shopIds">Shop type</Label>
                                                    <AvSelect onChange={this.handleChange} value={type_id} name="type_id" options={types} required />
                                                </AvGroup>
                                            </div>
                                        </div>
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


                                        {shop_id == 0 && <Button className="mt-2" color="primary">Create</Button>}
                                        {shop_id > 0 && <Button className="mt-2" color="primary">Update</Button>}
                                    </Forms>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default CreateShop
