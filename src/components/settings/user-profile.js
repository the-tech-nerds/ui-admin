import React from 'react'
import designer from '../../assets/images/dashboard/man.png'
import ProfileInfo from "./profile-info";

export  function UserProfile({user}){
    const element =   <div className="card">
        <div className="card-body">
            <div className="profile-details text-center">
                <img src={designer} alt="" className="img-fluid img-90 rounded-circle blur-up lazyloaded" />
                <h5 className="f-w-600 f-16 mb-0">{user.first_name + ' ' + user.last_name}</h5>
                <span>{user.email}</span>
            </div>
            <hr />
            <div className="project-status">
                <h5 className="f-w-600 f-16">Profile Info</h5>
                <ProfileInfo user={user}/>
            </div>
        </div>
    </div>

    return element;
}

export  default UserProfile;
