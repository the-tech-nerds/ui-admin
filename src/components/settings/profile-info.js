import React from 'react'

export  function ProfileInfo({user}){
    const element =  <div className="tab-pane fade show active">
        <div className="table-responsive profile-table">
            <table className="table table-responsive">
                <tbody>
                <tr>
                    <td>First Name:</td>
                    <td>{user?.first_name}</td>
                </tr>
                <tr>
                    <td>Last Name:</td>
                    <td>{user?.last_name}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{user?.email}</td>
                </tr>
                <tr>
                    <td>Gender:</td>
                    <td>{user?.gender}</td>
                </tr>
                <tr>
                    <td>Mobile Number:</td>
                    <td>{user.phone? user.phone: 'N/A'}</td>
                </tr>
                <tr>
                    <td>DOB:</td>
                    <td>{user?.birthday}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    return element;
}

export  default ProfileInfo;
