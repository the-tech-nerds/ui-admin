import {GatewayService} from "@technerds/common-services";
import {Injectable} from "@nestjs/common";

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
            body: user,
        });
    }

    async listUsers() {
        const { data: userList } = await this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/user/all',
        });
        const users = userList.map((user: any) => ({
            id: user.id,
            'first Name': user.first_name,
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
}