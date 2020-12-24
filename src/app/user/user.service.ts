import {GatewayService} from "@technerds/common-services";
import {Injectable} from "@nestjs/common";
import {UserLoginRequest} from "./requests/user.login.request";
import {ResetPasswordRequest} from "./requests/reset-password.request";
import * as moment  from "moment";
import {ApiResponseService} from "../common/response/api-response.service";

@Injectable()
export default class UserService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
    ) {
    }

    createUser(user: any) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authentication/register',
            body: {...user, type: 2},
        });
    }
    updateUser(user: any, userId: any) {
        user.gender_type = Number(user.gender_type);
        return this.gatewayService.execute("auth", {
            method: "PUT",
            path: '/api/v1/user/info/' + userId,
            body: { ...user},
        });
    }

    loginUser(request: UserLoginRequest) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authentication/login',
            body: request,
        });
    }

    resetPassword(request: ResetPasswordRequest) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/password/reset',
            body: request,
        });
    }

    async listUsers() {
        const {data: userList} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/user/all',
        });
        const users = userList.map((user: any) => ({
            id: user.id,
            'First Name': user.first_name,
            'Last Name': user.last_name,
            'Email': user.email,
            'Phone': user.phone,
            'Active': user.is_active ? 'Yes' : 'No'
        }));

        return this.responseService.response(users);
    }

    async listAdmins() {
        const {data: userList} = await this.gatewayService.execute("auth", {
            method: "GET",
            qs: {
                userType: "2",
            },
            path: '/api/v1/user/all',
        });
        const users = userList.map((user: any) => ({
            id: user.id,
            roleIds: user?.roles?.map((role: any) => role.id) || [],
            'First Name': user.first_name,
            'Last Name': user.last_name,
            'Email': user.email,
            'Phone': user.phone,
            // @ts-ignore
            "Roles": user?.roles?.reduce((acc: any, role) => (acc + role.name + ', '), '').slice(0, -2) || 'n/a',
            'Active': user.is_active ? 'Yes' : 'No',
        }));

        return this.responseService.response(users);
    }

    async getUser(userId: number) {
        const {data: user} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: `/api/v1/user/${userId}`,
        });
        const {
            id,
            first_name,
            last_name,
            email,
            phone,
            birthday,
            gender_type,
            roles
        } = user;

        return this.responseService.response({
            id,
            first_name,
            last_name,
            email,
            phone,
            birthday : birthday ? moment(birthday).format('YYYY-MM-DD') : 'N/A',
            gender_type,
            gender: gender_type == 1? 'Male' : gender_type == 2? 'female' : 'Other',
            roles
        });
    }

    async getCurrentUser() {
        const {data: user} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: `/api/v1/user/profile/info`,
        });
        const {
            id,
            first_name,
            last_name,
            email,
            phone,
            image_url,
            birthday,
            is_mobile_verified,
            gender_type,
            roles
        } = user;

        return this.responseService.response({
            id,
            first_name,
            last_name,
            email,
            phone,
            image_url,
            birthday : birthday ? moment(birthday).format('YYYY-MM-DD') : 'N/A',
            is_mobile_verified,
            gender_type,
            gender: gender_type == 1? 'Male' : gender_type == 2? 'female' : 'Other',
            roles: roles?.reduce((acc: any, role: any) => (acc + role.name + ', '), '').slice(0, -2) || 'n/a',
        });
    }

    async assignRole(userId: number, roles: []) {
        return await this.gatewayService.execute("auth", {
            method: "POST",
            path: `/api/v1/user/${userId}/assign-roles`,
            body: roles
        });
    }

    logOutUser() {
        this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/authentication/logout',
        }).catch(e => {});
    }
}
