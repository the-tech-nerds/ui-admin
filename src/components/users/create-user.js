import React, { Component,Fragment } from 'react'
import Breadcrumb from '../common/breadcrumb';
import App from "../app";
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button, Label} from "reactstrap";
import FetchData from "../common/get-data";
import AvGroup from 'availity-reactstrap-validation/lib/AvGroup';
import AvSelect from '@availity/reactstrap-validation-select';
export class Create_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shops: [],
            userId: Number(this.props.match.params.id),
            user: {},
            selectedShops: [],
            method: 'POST',
            url: '/api/users/',
        }
    }
    getUser=() =>{
        FetchData({
            url: `/api/users/${this.state.userId}`, callback: (response, isSucess) => {
                if (isSucess) {
                    response.data.user_shop = response.data.user_shop.map(shop => shop.shop_id);
                    // let selectedShops = this.state.shops.filter(option =>  response.data.user_shop.includes(option.value)).map(el=>el.value);
                    this.setState((state) => {
                        return {
                            ...state,
                            user: response.data,
                            // selectedShops:selectedShops,
                            method: 'PUT',
                            url: '/api/users/update/shop'
                        }
                    });
                } 
            }
        })
    }
    async componentDidMount() {
        // fetch shops
        FetchData({
            url: '/api/shops/list/all', callback: (response, isSucess) => {
                if (isSucess) {
                    if(this.state.userId > 0){

                    }
                    this.getUser();
                    const options = response.data.map(x => {
                        return {
                            label: x.Name,
                            value: x.id
                        };
                    });
                    this.setState({
                        shops: options
                    })
                } 
            }
        })
    }

    render() {
        const {shops, userId, user, selectedShops,  method, url} = this.state;
        return (
            <App>
                <Breadcrumb title="Create Admin" parent="Users" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5> Add Admin</h5>
                                </div>
                                <div className="card-body">
                                    <Forms
                                        options={{
                                            method: method,
                                            url: url,
                                            onSuccess: (response) => {
                                                window.location.href ='/list-admins';
                                            }
                                        }}
                                    >
                                        {!userId &&<AvField name="first_name" value={user.first_name} label="First Name" type="text" required />}
                                        {!userId && <AvField name="last_name" value={user.last_name} label="Last Name" type="text" required />}
                                        {!userId && <AvField name="email" label="Email" type="email" required /> }
                                        {/*<AvField name="password" label="Password" type="password" required />*/}
                                        {!userId && <AvField name="phone" label="Phone" type="phone" required /> }
                                        <AvGroup>
                                                <Label for="shopIds">Select Shop</Label>
                                                {userId == 0 && <AvSelect  isMulti name="shopIds" options={shops} required/>}
                                                {userId > 0 && <AvSelect  value={shops.filter(option =>  user?.user_shop?.includes(option.value)).map(el=>el.value)} isMulti name="shopIds" options={shops} required/>}
                                        </AvGroup>
                                        <Button color="primary">{userId?'Update' : 'Register'}</Button>
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

export default Create_user
