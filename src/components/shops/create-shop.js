import React, { Component, Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import { AvField } from "availity-reactstrap-validation";
import { Button } from "reactstrap";
import MyDropzone from '../common/dropzone';
import MyUploader from "../common/dropzone";
export class CreateShop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shop: {},
            contentInfo: {
                entity: 'shop',
                folder: 'shop',
                entity_id: 0,
                serviceName: 'product'
            },
            images: [],
            uploadIds: [],
            shop_id: 0,
            method: 'POST',
            url: '/api/shops/',
            loading: true
        }
    }
     handleUploadResponse = (response) =>{
         if(response.status == 'done'){
             let ids = this.state.uploadIds;
             let imgs = this.state.images;
              ids.push(response.data.id)
              imgs.push(response.data.url)
             this.setState({ uploadIds: ids,
                 images: imgs});
         } else if(response.status =='removed'){
             const urls  = this.state.images.filter(i => i !== response.data.url);
             const ids = this.state.uploadIds.filter(u =>u !== response.data.id)
             this.setState({ uploadIds: ids,
                 images: urls});
         }
    }

    async componentDidMount() {
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
                                shop: response.data
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
        let { shop, shop_id, method, url, contentInfo, images, uploadIds } = this.state;
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
                                            <h5>Dropzone Media</h5>
                                        </div>
                                        <div className="card-body">
                                            <MyUploader options={{
                                                images: images,
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
                                               await uploadIds.forEach(x=>{
                                                   items.push({
                                                       id: Number(x),
                                                       url: '',
                                                       type:'shop',
                                                       type_id: response.data.id,
                                                       microService: 'product'
                                                   });
                                                });
                                                if(items.length ==0){
                                                    window.location.href = '/shops/list';
                                                    return;
                                                }
                                                await fetch(`/api/file/update`, {
                                                    method: "PUT",
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(items),
                                                    cache: 'no-cache',
                                                    redirect: 'follow',
                                                })
                                                    .then(async res => {
                                                        const respons = await res.json();
                                                        if(respons.code ==200){
                                                            window.location.href = '/shops/list';
                                                        }
                                                     
                                                    })
                                            }
                                        }}
                                    >
                                        <AvField name="name" label="Name" value={shop.name} type="text" required />
                                        <AvField name="description" value={shop.description} label="Description" type="text" required />
                                        <AvField name="address" value={shop.address} label="Address" type="text" required />
                                        {shop_id == 0 && <Button color="primary">Create</Button>}
                                        {shop_id > 0 && <Button color="primary">Update</Button>}
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
