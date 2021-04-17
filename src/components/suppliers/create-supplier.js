import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import { Button } from "reactstrap";
import { DropzoneStatus } from "../../constants/dropzoneStatus"
import MyUploader from "../common/dropzone";
import updateFileStorage from "../common/file-storage";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import AvInput from 'availity-reactstrap-validation/lib/AvInput';

export class CreateSupplier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            supplier: undefined,
            contentInfo: {
                entity: 'supplier',
                folder: 'supplier',
                entity_id: Number(this.props.match.params.id),
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            supplier_id: 0,
            method: 'POST',
            url: '/api/suppliers/',
            loading: true,
            files: []
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
        if (id == 0) {
            this.setState((state) => {
                return {
                    ...state,
                    supplier: {
                        is_active: true
                    }
                }
            });
        }
        if (id > 0) {

            this.setState({
                supplier_id: id,
                method: 'PUT',
                url: `/api/suppliers/update/${id}`,
                loading: true
            });
            await fetch(`/api/suppliers/${id}`, {
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
                                supplier: response.data.supplier,
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


    }
    render() {
        const { supplier, supplier_id, method, url, contentInfo, files, uploadIds } = this.state;
        return (
            <App>

                <Breadcrumb title={supplier_id > 0 ? 'update' : 'create'} parent="Supplier" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{supplier_id > 0 ? 'Update supplier' : 'Add Supplier'}</h5>
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
                                                        type: 'supplier',
                                                        type_id: response.data.id,
                                                        microService: 'product'
                                                    });
                                                });
                                                if (items.length === 0) {
                                                    window.location.href = '/suppliers/list';
                                                    return;
                                                }
                                                await updateFileStorage(items).then(response => {
                                                    window.location.href = '/suppliers/list';
                                                });

                                            }
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-6">
                                                <AvField name="name" label="Name" value={supplier?.name} type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <AvField name="address" value={supplier?.address} label="Address" type="text" required />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <AvField name="phone" value={supplier?.phone} label="Phone" type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <AvField name="email" value={supplier?.email} label="Email" type="email" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <AvField name="description" value={supplier?.description} label="Description" type="text" />
                                            </div>
                                            <div className="col-6">
                                                <label></label>
                                                {supplier && <AvGroup check>
                                                    <AvInput type="checkbox" className="checkbox_animated mt-2" name="is_active" defaultChecked={supplier?.is_active} />Is Active!

                                                 </AvGroup>}

                                            </div>
                                        </div>

                                        {supplier_id == 0 && <Button color="primary">Create</Button>}
                                        {supplier_id > 0 && <Button color="primary">Update</Button>}
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

export default CreateSupplier
