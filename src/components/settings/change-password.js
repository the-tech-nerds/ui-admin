import React, { Component,Fragment, useState } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import {TabPanel} from "react-tabs";
import {PasswordStrengthMeter} from "../common/password-strength-meter";

export function ChangePassword() {
        const [password, setPassword] = useState("");
        return (
            <div className="tab-pane fade show active">
                <h5 className="f-w-600 f-16">Reset Password</h5>
                <Forms
                    options={{
                        method: 'POST',
                        url: '/api/users/reset-password',
                        onSuccess: (response) => {
                            window.location.href ='/auth/login';
                        }
                    }}
                >
                    <AvField name="old_password"  label="Current Password"  type="password" required />
                    <AvField name="new_password" label="New Password" type="password" required onChange={e => setPassword(e.target.value)}/>
                    <PasswordStrengthMeter text={password} />
                    <AvField name="new_password_confirm" label="Confirm Password" type="password" required />
                    <Button color="primary">Update Password</Button>
                </Forms>
            </div>
        )
}

export default ChangePassword
