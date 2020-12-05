import React, { Component,Fragment } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import Forms from "../form/forms";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {Button} from "reactstrap";

export class Tabset_user extends Component {
    render() {
        return (
            <Fragment>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link">Account</Tab>
                        {/*<Tab className="nav-link" disabled>Permission</Tab>*/}
                    </TabList>
                    <TabPanel>
                        <Forms
                            title="Create User"
                            options={{
                                method: 'POST',
                                url: '/api/users',
                                onSuccess: (response) => {
                                    console.log("in user list");
                                    window.location.href ='/users/list-user';
                                }
                            }}
                        >
                            <AvField name="first_name" label="First Name" type="text" required />
                            <AvField name="last_name" label="Last Name" type="text" required />
                            <AvField name="email" label="Email" type="email" required />
                            <AvField name="password" label="Password" type="password" required />
                            <AvField name="phone" label="Phone" type="phone" required />
                            <Button color="primary">Register</Button>
                        </Forms>
                    </TabPanel>
                    <TabPanel>
                        <form className="needs-validation user-add" noValidate="">
                            <div className="permission-block">
                                <div className="attribute-blocks">
                                    <h5 className="f-w-600 mb-3">Product Related Permission </h5>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Add Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block">
                                                    <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" />
                                                    Allow
                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani2" type="radio" name="rdo-ani" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Update Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani3" type="radio" name="rdo-ani1" defaultChecked />
                                                    Allow
                                                </label>
                                                <label className="d-block">
                                                    <input className="radio_animated" id="edo-ani4" type="radio" name="rdo-ani1" />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Delete Product</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani5" type="radio" name="rdo-ani2" />
                                                    Allow
                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani6" type="radio" name="rdo-ani2" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label className="mb-0 sm-label-radio">Apply Discount</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated pb-0">
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani7" type="radio" name="rdo-ani3" />
                                                    Allow
                                                </label>
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani8" type="radio" name="rdo-ani3" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="attribute-blocks">
                                    <h5 className="f-w-600 mb-3">Category Related Permission </h5>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Add Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani9" type="radio" name="rdo-ani4" />
                                                    Allow
                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani10" type="radio" name="rdo-ani4" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Update Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani11" type="radio" name="rdo-ani5" />
                                                    Allow
                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani12" type="radio" name="rdo-ani5" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label>Delete Category</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani13" type="radio" name="rdo-ani6" />
                                                    Allow
                                                </label>
                                                <label className="d-block" >
                                                    <input className="radio_animated" id="edo-ani14" type="radio" name="rdo-ani6" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-sm-4">
                                            <label className="mb-0 sm-label-radio">Apply Discount</label>
                                        </div>
                                        <div className="col-xl-9 col-sm-8">
                                            <div className="form-group m-checkbox-inline custom-radio-ml d-flex radio-animated pb-0">
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani15" type="radio" name="rdo-ani7" />
                                                    Allow
                                                </label>
                                                <label className="d-block mb-0" >
                                                    <input className="radio_animated" id="edo-ani16" type="radio" name="rdo-ani7" defaultChecked />
                                                    Deny
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                </Tabs>
                {/*<div className="pull-right">*/}
                {/*    <button type="button" className="btn btn-primary">Save</button>*/}
                {/*</div>*/}
            </Fragment>
        )
    }
}

export default Tabset_user
