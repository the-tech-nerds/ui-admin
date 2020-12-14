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
        const {data: roleList} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: '/api/v1/authorization/roles',

        });
        const roles = roleList.map((role: any) => ({
            id: role.id,
            'Name': role.name,
        }));
        return {
            code: 200,
            data: roles,
        };
    }

    async getRolePermissions(id: number) {
        const {data: permission} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: `/api/v1/authorization/role/${id}/permissions`,
        });
        return {
            code: 200,
            data: permission,
        };
    }

    async updateRolePermissions(id: number, roleCreateRequest: any) {
        const data = await this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/authorization/role/${id}`,
            body: {...roleCreateRequest}
        });
        return {
            code: 200,
            data,
        };
    }

    async getRoleDetailsById(id: number, roleCreateRequest: any) {
        const data = await this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/authorization//role/${id}/details`,
            body: {...roleCreateRequest}
        });
        return {
            code: 200,
            data,
        };
    }
}
