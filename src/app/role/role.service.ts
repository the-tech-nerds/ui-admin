import {GatewayService} from "@technerds/common-services";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class RoleService {
    constructor(
        private readonly gatewayService: GatewayService
    ) {
    }

    createRole(role: any) {
        return this.gatewayService.execute("auth", {
            method: "POST",
            path: '/api/v1/authorization/role',
            body: role,
        });
    }

    async listRoles() {
        console.log('res');
        // const {data: roleList} = await this.gatewayService.execute("auth", {
        const res = await this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/authorization/roles',

        });
        console.log(res);
        // const roles = roleList.map((role: any) => ({
        //     id: role.id,
        //     'Name': role.name,
        // }));
        // return {
        //     code: 200,
        //     data: roles,
        // };
    }

}
