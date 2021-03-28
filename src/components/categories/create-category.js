import React, { Component } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import { Button, Label } from "reactstrap";
import * as fetch from "isomorphic-fetch";
import FetchData from "../common/get-data";
import { DropzoneStatus } from "../../constants/dropzoneStatus"
import MyUploader from "../common/dropzone";
import updateFileStorage from "../common/file-storage";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import AvSelect from '@availity/reactstrap-validation-select';

export class CreateCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            contentInfo: {
                entity: 'category',
                folder: 'category',
                entity_id: Number(this.props.match.params.id) || 0,
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            error: false,
            errorMessage: null,
            files: [],
            types: []
        };
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

    componentDidMount() {
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
        FetchData({
            url: '/api/categories', callback: (response, isSucess) => {
                if (isSucess) {
                    this.setState({
                        categoryList: response.data,
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
        let { categoryList, contentInfo, files, uploadIds, types } = this.state
        return (
            <App>
                <Breadcrumb title="Create Category" parent="List" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add Category</h5>
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
                                            method: 'POST',
                                            url: '/api/categories',
                                            onSuccess: async (response) => {
                                                let items = []
                                                await uploadIds.forEach(x => {
                                                    items.push({
                                                        id: Number(x),
                                                        url: '',
                                                        type: 'category',
                                                        type_id: response.data.id,
                                                        microService: 'product'
                                                    });
                                                });
                                                if (items.length === 0) {
                                                    window.location.href = '/categories/list';
                                                    return;
                                                }
                                                await updateFileStorage(items).then(response => {
                                                    window.location.href = '/categories/list';
                                                });
                                            }
                                        }}
                                    >

                                        <div className="row">
                                            <div className="col-6">
                                                <AvField label="Parent Category" type="select" name="parent_id">
                                                    <option value="0">Select Parent Category</option>
                                                    {categoryList.map(category => (
                                                        <option value={category.id}>{category.Name}</option>
                                                    ))}
                                                </AvField>
                                            </div>
                                            <div className="col-6">
                                                <AvGroup>
                                                    <Label for="type_id">Select Shop</Label>
                                                    <AvSelect name="type_id" options={types} required />
                                                </AvGroup>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div class="col-6">
                                                <AvField name="name" label="Category Name" type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <AvField name="slug" label="Slug Name" type="text" required />
                                            </div>
                                        </div>

                                        <Button color="primary">Create</Button>
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

export default CreateCategory
