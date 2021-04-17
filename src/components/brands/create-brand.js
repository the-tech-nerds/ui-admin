import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import { Button } from "reactstrap";
import AsyncSelect from 'react-select/async';
import { DropzoneStatus } from '../../constants/dropzoneStatus';
import MyUploader from '../common/dropzone';
import updateFileStorage from "../common/file-storage";

export class CreateBrand extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brand: {
                name: '',
                description: '',
                supplier_id: 0
            },
            contentInfo: {
                entity: 'brand',
                folder: 'brand',
                entity_id: Number(this.props.match.params.id),
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            inputValue: '',
            brand_id: 0,
            method: 'POST',
            url: '/api/brands/',
            loading: true,
            suppliers: [],
            supplier_id: 0,
            files: []
        }
        this.getAllSupplier();
    }
    onChangeSelectedOption = (e) => {
        this.setState({
            brand: {
                description: this.state.brand.description,
                name: this.state.brand.name,
                supplier_id: e.value
            }
        });
    };
    handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '');
        this.setState({ inputValue: inputValue });
        return inputValue;
    };
    changeInputHandler = (event) => {
        if (event.target.name == "name") {
            this.setState({
                brand: {
                    name: event.target.value,
                    description: this.state.brand.description,
                    supplier_id: this.state.brand.supplier_id
                }
            });
        }
        if (event.target.name == "description") {
            this.setState({
                brand: {
                    description: event.target.value,
                    name: this.state.brand.name,
                    supplier_id: this.state.brand.supplier_id
                }
            });
        }
    }

    filterOptions = (inputValue) => {
        return this.state.suppliers.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    loadOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(this.filterOptions(inputValue));
        }, 1000);
    };

    getAllSupplier = async () => {
        await fetch(`/api/suppliers/list/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            const response = await res.json();
            const options = response.data.map(x => {
                return {
                    label: x.Name,
                    value: x.id
                };
            });
            this.setState({
                suppliers: options
            })
        })
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        const id = Number(this.props.match.params.id);
        let url = '/api/brands/';
        let method = 'POST'
        if (id > 0) {
            url = `/api/brands/update/${id}`;
            method = 'PUT';
        }
        const values = this.state.brand;
        fetch(url, {
            method: method,
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            redirect: 'follow',
        }).then(async res => {
            const response = await res.json();
            if (response.code == 200) {
                let items = []
                await this.state.uploadIds.forEach(x => {
                    items.push({
                        id: Number(x),
                        url: '',
                        type: 'shop',
                        type_id: response.data.id,
                        microService: 'product'
                    });
                });
                if (items.length === 0) {
                    window.location.href = `/brands/list/`;
                    return;
                }
                await updateFileStorage(items).then(response => {
                    window.location.href = `/brands/list/`;
                });

            }

        })
            .catch(error => {

            })
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
        const id = Number(this.props.match.params.id);
        if (id > 0) {

            this.setState({
                brand_id: id,
                method: 'PUT',
                url: `/api/brands/update/${id}`,
                loading: true
            });
            await fetch(`/api/brands/${id}`, {
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
                        if (response.data.brand?.supplier_id) {
                            var value = this.state.suppliers.filter(x => x.value == response.data.brand?.supplier_id)[0].label;
                        }
                        this.setState((state) => {
                            return {
                                ...state,
                                brand: response.data.brand,
                                files: response.data.images,
                                inputValue: value
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
        const { brand = {}, brand_id, inputValue, contentInfo, files, uploadIds } = this.state;

        return (
            <App>

                <Breadcrumb title={brand_id > 0 ? 'update' : 'create'} parent="product" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{brand_id > 0 ? 'Update brand' : 'Add brand'}</h5>
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
                                    <form onSubmit={this.mySubmitHandler}>
                                        <div className="row">
                                            <div className="col-6">
                                                <label>Name</label>
                                                <input className="form-control" name="name" onChange={this.changeInputHandler} value={brand?.name} placeholder="name" type="text" required />
                                            </div>
                                            <div className="col-6">
                                                <label className="mt-2 mb-2">Suppliers</label>
                                                <AsyncSelect
                                                    loadOptions={this.loadOptions}
                                                    defaultOptions
                                                    inputValue={inputValue}
                                                    name="supplier_id"
                                                    onChange={this.onChangeSelectedOption}
                                                    onInputChange={this.handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <label className="mt-2">Description</label>
                                                <textarea className="form-control" name="description" onChange={this.changeInputHandler} placeholder="description..." value={brand?.description} >
                                                </textarea>
                                            </div>
                                        </div>


                                        {brand_id == 0 && <Button className="mt-2" color="primary">Create</Button>}
                                        {brand_id > 0 && <Button className="mt-2" color="primary">Update</Button>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </App>
        )
    }
}

export default CreateBrand
