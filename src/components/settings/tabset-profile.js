import React from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import {User, Settings, Key} from 'react-feather'
import ChangePassword from "./change-password";
import EditProfile from "./edit-profile";

export function Tabset_profile({user, response}){
        return (
            <div>
                <Tabs>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link"><User className="mr-2" />Profile</Tab>
                        {/*<Tab className="nav-link"><Settings className="mr-2" />Setting</Tab>*/}
                        <Tab className="nav-link"><Key className="mr-2" />Reset Password</Tab>
                    </TabList>
                    <TabPanel>
                        <EditProfile user={user} response={response}/>
                    </TabPanel>
                    {/*<TabPanel>
                         <div className="tab-pane fade">
                            <div className="account-setting">

                                <h5 className="f-w-600 f-16">Notifications</h5>
                                <div className="row">
                                    <div className="col">
                                        <label className="d-block" >
                                            <input className="checkbox_animated" id="chk-ani" type="checkbox" defaultChecked />
                                            Allow Desktop Notifications
                                                    </label>
                                        <label className="d-block">
                                            <input className="checkbox_animated" id="chk-ani1" type="checkbox" />
                                            Enable Notifications
                                                    </label>
                                        <label className="d-block">
                                            <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                            Get notification for my own activity
                                                    </label>
                                        <label className="d-block mb-0" >
                                            <input className="checkbox_animated" id="chk-ani3" type="checkbox" defaultChecked />
                                            DND
                                                    </label>
                                    </div>
                                </div>
                            </div>
                            <div className="account-setting deactivate-account">
                                <h5 className="f-w-600 f-16">Deactivate Account</h5>
                                <div className="row">
                                    <div className="col">
                                        <label className="d-block" >
                                            <input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" defaultChecked />
                                            I have a privacy concern
                                                    </label>
                                        <label className="d-block" >
                                            <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" />
                                            This is temporary
                                                    </label>
                                        <label className="d-block mb-0" >
                                            <input className="radio_animated" id="edo-ani2" type="radio" name="rdo-ani" defaultChecked />
                                            Other
                                                    </label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary">Deactivate Account</button>
                            </div>
                            <div className="account-setting deactivate-account">
                                <h5 className="f-w-600 f-16">Delete Account</h5>
                                <div className="row">
                                    <div className="col">
                                        <label className="d-block" >
                                            <input className="radio_animated" id="edo-ani3" type="radio" name="rdo-ani1" defaultChecked />
                                            No longer usable
                                                    </label>
                                        <label className="d-block">
                                            <input className="radio_animated" id="edo-ani4" type="radio" name="rdo-ani1" />
                                            Want to switch on other account
                                                    </label>
                                        <label className="d-block mb-0">
                                            <input className="radio_animated" id="edo-ani5" type="radio" name="rdo-ani1" defaultChecked />
                                            Other
                                                    </label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary">Delete Account</button>
                            </div>
                         </div>
                    </TabPanel>*/}
                    <TabPanel>
                      <ChangePassword/>
                    </TabPanel>
                </Tabs>
            </div>
        )
}

export default Tabset_profile
