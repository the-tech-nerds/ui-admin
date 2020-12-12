import React, { Component ,Fragment} from 'react'
import Tabset_profile from './tabset-profile';
import Breadcrumb from '../common/breadcrumb';
import * as fetch from "isomorphic-fetch";
import UserProfile from "./user-profile";
export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state={
            user: null
        };
        this.handleUserResponse= this.handleUserResponse.bind(this);
    }
    componentDidMount()
    {
        this.getUserInfo();
    }
    getUserInfo(){
        fetch('/api/users/38').then(async res => {
            const response = await res.json();
            if (response.code === 200 ) {
                this.setState({
                    user: response.data
                });
            }
        }).catch(e => {})
    }
    handleUserResponse() {
       this.getUserInfo();
    }
    render() {
        const {user} = this.state
        return (
            <Fragment>
                <Breadcrumb title="Profile" parent="Settings" />
                 <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-4">
                        {user &&<UserProfile user = {user}/>}
                    </div>
                    <div className="col-xl-8">
                        <div className="card profile-card">
                            <div className="card-body">
                                {user &&<Tabset_profile user={user} response = {this.handleUserResponse}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Fragment>
        )
    }
}

export default Profile
