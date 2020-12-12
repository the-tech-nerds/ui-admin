import React, {useState} from 'react'
import Forms from "../form/forms";
import {AvField} from "availity-reactstrap-validation";
import {Button} from "reactstrap";
import {toast, ToastContainer} from "react-toastify";

export function EditProfile({user, response}) {
    const [gender_type, setGenderType] = useState(user.gender_type?user.gender_type : 1)
    const handleSelect=(e)=>{
        setGenderType(e.target.value);
    }
    return (
        <div className="tab-pane fade show active">
            <h5 className="f-w-600 f-16">Edit Profile</h5>
            <Forms
                options={{
                    method: 'PUT',
                    url: '/api/users',
                    onSuccess: (res) => {
                        toast.success("Successfully Updated !")
                        // window.location.href ='/auth/login';
                        response();
                    }
                }}
            >
                <AvField name="first_name" value ={user.first_name}  label="First Name"  type="text" required />
                <AvField name="last_name" value = {user.last_name} label="Last Name" type="text" required />
                <AvField name="birthday" value = {user.birthday} label="Last Name" type="date"  />
                <AvField type="select" name="gender_type" value ={gender_type}  onChange={handleSelect} label="Gender" >
                    <option key="1" value="1" >Male</option>
                    <option key="2" value="2">Female</option>
                    <option key="3" value="3">Other</option>
                </AvField>
                <Button color="primary">Update Profile</Button>
            </Forms>
            <ToastContainer />
        </div>
    )
}

export default EditProfile
