import {GatewayService} from "@technerds/common-services";
import {Injectable} from "@nestjs/common";
import {UserLoginRequest} from "./requests/user.login.request";
import {ResetPasswordRequest} from "./requests/reset-password.request";

@Injectable()
export default class UserService {
    constructor(
        private readonly gatewayService: GatewayService
    ) {
    }

    createUser(user: any) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authentication/register',
            body: {...user, type: 2},
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
        return {
            code: 200,
            data: users,
        };
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
            "Roles": user?.roles?.reduce((acc: any, role) => (acc + role.name + ', '), '').slice(0, -1) || 'n/a',
            'Active': user.is_active ? 'Yes' : 'No',
        }));
        return {
            code: 200,
            data: users,
        };
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
        } = user;
        return {
            code: 200,
            data: {
                id,
                first_name,
                last_name,
                email,
                phone,
            }
        }
    }

    async assignRole(userId: number, roles: []) {
        return await this.gatewayService.execute("auth", {
            method: "POST",
            path: `/api/v1/user/${userId}/assign-roles`,
            body: roles
        });
    }
}
