import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import {UserLoginRequest} from "./requests/user.login.request";
import {ResetPasswordRequest} from "./requests/reset-password.request";
import * as moment  from "moment";
import {ApiResponseService} from "../common/response/api-response.service";
import {ResetPasswordAutoGenerateRequest} from "./requests/reset-password-auto-generate.request";

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
            path: '/api/v1/authentication/register/admin',
            body: user,
        });
    }
    updateUser(user: any) {
        user.gender_type = Number(user.gender_type);
        return this.gatewayService.execute("auth", {
            method: "PUT",
            path: '/api/v1/user/profile/info/',
            body: { ...user},
        });
    }

    loginUser(request: UserLoginRequest) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authentication/login/admin',
            body: { ...request, type: 1 },
        });
    }

    resetPassword(request: ResetPasswordRequest) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/password/reset',
            body: request,
        });
    }


    resetPasswordAutoGenerate(request: ResetPasswordAutoGenerateRequest) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/password/reset-password-auto-generate',
            body: request,
        });
    }

    async listUsers() {
        const {data: userList} = await this.gatewayService.execute("auth", {
            method: "GET",
            qs: {
                userType: '2',
            },
            path: '/api/v1/user/all',
        });

        const users = userList.map((user: any, index: any) => ({
            id: user.id,
            'SL No': ++index,
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
                userType: '1',
            },
            path: '/api/v1/user/all',
        });

        const users = userList.map((user: any, index: any) => ({
            id: user.id,
            'SL No': ++index,
            isFrozen: !!user.is_frozen,
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
            roles,
            user_shop
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
            roles,
            user_shop
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
        return  this.gatewayService.execute("auth", {
            method: "POST",
            path: `/api/v1/user/${userId}/assign-roles`,
            body: roles
        });
    }

    async unfreezeUser(userId: number) {
        return  this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/user/${userId}/unfreeze`,
        });
    }

    logOutUser() {
        this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/authentication/logout',
        }).catch(e => {});
    }
    
    async updateUserShop(shopIds:number[]) {
       return this.gatewayService.execute("auth", {
            method: "PUT",
            path: '/api/v1/user/update/shop',
            body: shopIds
        });
    }
}
