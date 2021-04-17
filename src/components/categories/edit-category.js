import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvCheckbox, AvCheckboxGroup, AvField } from "availity-reactstrap-validation";
import { Button,  Label } from "reactstrap";
import * as fetch from "isomorphic-fetch";
import Loader from "../common/loader";
import { DropzoneStatus } from "../../constants/dropzoneStatus"
import MyUploader from "../common/dropzone";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import AvSelect from '@availity/reactstrap-validation-select';
import FetchData from '../common/get-data';

export default class EditCategory extends Component {
    constructor(props) {
        super(props)
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
            category: {},
            files: [],
            type_id: 1,
            types: []

        }
    }
    handleUploadResponse = (response) => {
        if (response.status == DropzoneStatus.UPLOAD_SUCCESS) {
            let ids = this.state.uploadIds;
            let imgs = this.state.images;
            ids.push(response.data.id)
            imgs.push(response.data.url)
            this.setState((state) => {
                return {
                    ...state,
                    uploadIds: ids,
                    images: imgs
                }

            });
        } else if (response.status == DropzoneStatus.REMOVE_UPLOADED_ITEM) {
            const urls = this.state.images.filter(i => i !== response.data.url);
            const ids = this.state.uploadIds.filter(u => u !== response.data.id)
            this.setState((state) => {
                return {
                    ...state,
                    uploadIds: ids,
                    images: urls
                }

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

        const url = window.location.href.split('/');
        const categoryId = url[4];
        this.setState({ loading: true });

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
        fetch(`/api/categories`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        })
            .then(async res => {
                const response = await res.json();
                if (response.code === 200) {
                    this.setState({
                        categoryList: response.data,
                    });
                    return;
                } else {
                    this.setState({
                        error: true,
                        errorMessage: response.message,
                    });
                    return;
                }
            })
            .catch(error => {
                this.setState({
                    error: true,
                    errorMessage: error,
                })
            })

        await fetch(`/api/categories/${categoryId}`, {
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
                            category: response.data.category,
                            type_id: response.data.category.type_id,
                            files: response.data.images,
                            categoryList: this.state.categoryList.filter(category => category.id !== Number(categoryId))
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
    handleChange = (event) =>{
        this.setState((state) => {
            return {
                ...state,
                type_id: event
            }
        });
    } 
    render() {
        let { categoryList, loading, category, contentInfo, files, types, type_id } = this.state;
        const url = window.location.href.split('/');
        const categoryId = url[4];
        return (
            <App>
                <Breadcrumb title="Edit category" parent="Category List" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                {loading && <Loader />}
                                <div className="card-header">
                                    <h5> Edit Category</h5>
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
                                            method: 'PUT',
                                            url: `/api/categories/${categoryId}`,
                                            onSuccess: (response) => {
                                                window.location.href = '/categories/list';
                                            },
                                        }}
                                    >

                                        <div className="row">
                                            <div className="col-6">

                                                <AvField label="Parent Category" value={category.parent_id} type="select" name="parent_id">
                                                    <option >Select Parent Category</option>
                                                    {categoryList.map(category => (
                                                        <option value={category.id}>{category.Name}</option>
                                                    ))}
                                                </AvField>
                                            </div>
                                            <div className="col-6">
                                                <AvGroup>
                                                    <Label for="shopIds">Shop type</Label>
                                                    <AvSelect   onChange={this.handleChange} value={type_id}  name="type_id" options={types} required />
                                                </AvGroup>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div class="col-12">
                                                <AvField name="name" label="Name" type="text" required
                                                    value={category.name}
                                                />
                                            </div>
                                        </div>
                                        <Button color="primary">Edit</Button>
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
