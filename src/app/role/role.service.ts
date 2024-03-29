import {GatewayService} from "@the-tech-nerds/common-services";
import {Injectable} from "@nestjs/common";
import {ApiResponseService} from "../common/response/api-response.service";

@Injectable()
export default class RoleService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly responseService: ApiResponseService
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

        let roles = roleList.map((role: any, index: any) => (
            {
            hasUser: role.users.length > 0,
            id: role.id,
            'isActive': role.is_active,
            'SL No': ++index,
            'Name': role.name,
        }));
        return this.responseService.response(roles);
    }

    async getRolePermissions(id: number) {
        const {data: permission} = await this.gatewayService.execute("auth", {
            method: "GET",
            path: `/api/v1/authorization/role/${id}/permissions`,
        });

        return this.responseService.response(permission);
    }

    async updateRolePermissions(id: number, roleCreateRequest: any) {
        const data = await this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/authorization/role/${id}`,
            body: {...roleCreateRequest}
        });

        return this.responseService.response(data);
    }

    async changeRoleStatus(id: number) {
        const data = await this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/authorization/role/${id}/status`,
        });

        return this.responseService.response(data);
    }

    async getRoleDetailsById(id: number, roleCreateRequest: any) {
        const data = await this.gatewayService.execute("auth", {
            method: "PUT",
            path: `/api/v1/authorization/role/${id}/details`,
            body: {...roleCreateRequest}
        });

        return this.responseService.response(data);
    }

    async getPermissionsFromRole(roleId: number) {
        const data = await this.gatewayService.execute("auth", {
            method: "GET",
            path: `/api/v1/authorization/permission/categories/role/${roleId}`,
        });
        return this.responseService.response(data);
    }
}
