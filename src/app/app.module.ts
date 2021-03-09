import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CacheModule, commonConfig, GatewayModule} from "@the-tech-nerds/common-services";
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import configuration from "./config/configuration";
import {RoleModule} from "./role/role.module";
import {PermissionCategoryModule} from "./permissionCategory/permissionCategory.module";
import {ApiResponseService} from "./common/response/api-response.service";
import {ShopModule} from "./shop/shop.module";
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import {CategoryModule} from "./category/category.module";
import { AdminEventModule } from './EventService/admin-event.module';

@Module({
  imports: [
    CacheModule,
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration,commonConfig],
    }),
    UserModule, RoleModule, PermissionCategoryModule, ApiResponseService,
      ShopModule,
      ProductModule,
      SupplierModule,
      CategoryModule,
      AdminEventModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
