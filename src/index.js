import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './index.scss';
// import {ScrollContext} from 'react-router-scroll-4';
// Components
import Dashboard from './components/dashboard';

// Products physical

//Product Digital

//Sales
//Coupons

//Pages
import List_user from './components/users/list-user';
import Create_user from './components/users/create-user';
import UserDetails from './components/users/user-details';
import Profile from './components/settings/profile';
import Login from './components/auth/login';
import ListAdmin from "./components/users/list-admin";
import ListRole from "./components/roles/list-roles";
import CreateRole from "./components/roles/create-role";
import EditRole from "./components/roles/edit-role";
import RoleDetails from "./components/roles/role-details";
import NotFound from "./components/404/not-found";
import CreateShop from "./components/shops/create-shop"
import {getPermissionTypes, getUserPermissions, getUserRoles} from "./utils/utils";
import ListShop from "./components/shops/list-shops";
import ListUnit from './components/unit/list-unit';
import {CreateUnit} from './components/unit/create-unit';
import CreateSupplier from './components/suppliers/create-supplier';
import ListSupplier from './components/suppliers/list-supplier';
import ListCategory from "./components/categories/list-category";
import CreateCategory from "./components/categories/create-category";
import EditCategory from "./components/categories/edit-category";
import CreateBrand from './components/brands/create-brand';
import ListBrand from './components/brands/list-brand';
import ListProduct from "./components/products/list-product";
import CreateProduct from "./components/products/create-product";
import ListProductVariance from "./components/product-variance/list-product-variance";
import CreateProductVariance from "./components/product-variance/create-product-variance";
import ListInventory from "./components/Inventory/list-inventory";
import CreateInventory from "./components/Inventory/create-inventory";
import {CreateOffer} from './components/offer/create-offer';
import ListOffer from "./components/offer/list-offer";
import ListDiscount from "./components/discount/list-discount";
import CreateDiscount from "./components/discount/create-discount";
import AssignDiscount from "./components/discount/assign-discount";

class Root extends Component {
    permissions = [];
    roles = [];
    PermissionTypes = {};

    constructor(props) {
        super(props);
        this.permissions = getUserPermissions();
        this.roles = getUserRoles();
        this.PermissionTypes = getPermissionTypes();
    }

    hasPermission = (permission) => {
        if (this.roles.includes("Super Admin")) {
            return true;
        }
        return this.permissions.includes(permission);
    }

    render() {
        return (
            <BrowserRouter basename={'/'}>
                <div>
                    <Switch>
                        <Route exact path={`${process.env.PUBLIC_URL}/auth/login`} component={Login} />
                        <Route exact path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} />

                        {/*<Route exact path={`${process.env.PUBLIC_URL}/products/physical/category`}
                               component={Category}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/physical/sub-category`}
                               component={Sub_category}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/physical/product-list`}
                               component={Product_list}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/physical/product-detail`}
                               component={Product_detail}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/physical/add-product`}
                               component={Add_product}/>

                        <Route path={`${process.env.PUBLIC_URL}/products/digital/digital-category`}
                               component={Digital_category}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/digital/digital-sub-category`}
                               component={Digital_sub_category}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/digital/digital-product-list`}
                               component={Digital_pro_list}/>
                        <Route path={`${process.env.PUBLIC_URL}/products/digital/digital-add-product`}
                               component={Digital_add_pro}/>*/}

                        {/*    <Route path={`${process.env.PUBLIC_URL}/sales/orders`} component={Orders}/>*/}
                        {/*    <Route path={`${process.env.PUBLIC_URL}/sales/transactions`}*/}
                        {/*           component={Transactions_sales}/>*/}

                        {/*    <Route path={`${process.env.PUBLIC_URL}/coupons/list-coupons`} component={ListCoupons}/>*/}
                        {/*    <Route path={`${process.env.PUBLIC_URL}/coupons/create-coupons`}*/}
                        {/*           component={Create_coupons}/>*/}

                        {/*    <Route path={`${process.env.PUBLIC_URL}/pages/list-page`} component={ListPages}/>*/}
                        {/*    <Route path={`${process.env.PUBLIC_URL}/pages/create-page`} component={Create_page}/>*/}

                        {/*    <Route path={`${process.env.PUBLIC_URL}/media`} component={Media}/>*/}

                        {/*    <Route path={`${process.env.PUBLIC_URL}/menus/list-menu`} component={List_menu}/>*/}
                        {/*    <Route path={`${process.env.PUBLIC_URL}/menus/create-menu`} component={Create_menu}/>*/}

                        {this.hasPermission(this.PermissionTypes.USER.GET) &&
                            <Route
                                exact
                                path={`${process.env.PUBLIC_URL}/list-users`}
                                component={List_user}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.USER.GET) &&
                            <Route
                                exact
                                path={`${process.env.PUBLIC_URL}/list-admins`}
                                component={ListAdmin}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.USER.CREATE) &&
                            <Route
                                exact
                                path={`${process.env.PUBLIC_URL}/create-user`}
                                component={Create_user}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.USER.UPDATE) &&
                            <Route
                                exact
                                path={`${process.env.PUBLIC_URL}/edit-user/:id`}
                                component={Create_user}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.USER.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/users/:id`}
                                component={UserDetails}
                            />
                        }

                        {this.hasPermission(this.PermissionTypes.ROLE.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/list-roles`}
                                component={ListRole} exact={true}
                            />
                        }

                        {this.hasPermission(this.PermissionTypes.ROLE.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/create-role`}
                                component={CreateRole}
                                exact={true}
                            />
                        }

                        {this.hasPermission(this.PermissionTypes.ROLE.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/roles/:id/edit`}
                                component={EditRole}
                                exact={true}
                            />
                        }

                        {this.hasPermission(this.PermissionTypes.ROLE.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/roles/:id/details`}
                                component={RoleDetails}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SHOP.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/shops/create`}
                                component={CreateShop}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SHOP.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/shops/edit/:id`}
                                component={CreateShop}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SHOP.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/shops/list`}
                                component={ListShop}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.UNIT.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/units/create`}
                                component={CreateUnit}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.UNIT.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/units/edit/:id`}
                                component={CreateUnit}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.UNIT.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/units/list`}
                                component={ListUnit}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.BRAND.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/brands/create`}
                                component={CreateBrand}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.BRAND.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/brands/edit/:id`}
                                component={CreateBrand}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.BRAND.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/brands/list`}
                                component={ListBrand}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SUPPLIER.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/suppliers/create`}
                                component={CreateSupplier}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SUPPLIER.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/suppliers/edit/:id`}
                                component={CreateSupplier}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.SUPPLIER.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/suppliers/list`}
                                component={ListSupplier}
                                exact={true}
                            />
                        }

                        //Category
                        {this.hasPermission(this.PermissionTypes.PRODUCT_CATEGORY.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/categories/list`}
                                component={ListCategory}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT_CATEGORY.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/category/create`}
                                component={CreateCategory}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT_CATEGORY.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/categories/:id/edit`}
                                component={EditCategory}
                                exact={true}
                            />
                        }

                        //Inventory
                        {this.hasPermission(this.PermissionTypes.INVENTORY.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/inventories/list`}
                                component={ListInventory}
                                exact={true}
                            />
                        }

                        {this.hasPermission(this.PermissionTypes.INVENTORY.CREATE) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/inventories/create/:id`}
                            component={CreateInventory}
                            exact={true}
                        />}

                        //Product
                        {this.hasPermission(this.PermissionTypes.PRODUCT.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/products/list`}
                                component={ListProduct}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/products/create`}
                                component={CreateProduct}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/products/edit/:id`}
                                component={CreateProduct}
                                exact={true}
                            />
                        }
                        //Product Variance
                        {this.hasPermission(this.PermissionTypes.PRODUCT.GET) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/product/:productId/variance/list`}
                                component={ListProductVariance}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/product/:productId/variance/create`}
                                component={CreateProductVariance}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.UPDATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/product/:productId/variance/edit/:id`}
                                component={CreateProductVariance}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.CREATE) &&
                            <Route
                                path={`${process.env.PUBLIC_URL}/offer/create`}
                                component={CreateOffer}
                                exact={true}
                            />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.UPDATE) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/offer/edit/:id`}
                            component={CreateOffer}
                            exact={true}
                        />
                        }
                        {this.hasPermission(this.PermissionTypes.PRODUCT.GET) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/offer/list`}
                            component={ListOffer}
                            exact={true}
                        />
                        }

                        {this.hasPermission(this.PermissionTypes.DISCOUNT.GET) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/discount/list`}
                            component={ListDiscount}
                            exact={true}
                        />
                        }
                        {this.hasPermission(this.PermissionTypes.DISCOUNT.CREATE) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/discounts/create`}
                            component={CreateDiscount}
                            exact={true}
                        />
                        }
                        {this.hasPermission(this.PermissionTypes.DISCOUNT.UPDATE) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/discounts/edit/:id`}
                            component={CreateDiscount}
                            exact={true}
                        />
                        }
                        {this.hasPermission(this.PermissionTypes.DISCOUNT.ASSIGN) &&
                        <Route
                            path={`${process.env.PUBLIC_URL}/discounts/assign`}
                            component={AssignDiscount}
                            exact={true}
                        />
                        }
                        {/*<Route path={`${process.env.PUBLIC_URL}/vendors/list_vendors`} component={List_vendors}/>*/}
                        {/*<Route path={`${process.env.PUBLIC_URL}/vendors/create-vendors`}*/}
                        {/*       component={Create_vendors}/>*/}

                        {/*<Route path={`${process.env.PUBLIC_URL}/localization/transactions`}*/}
                        {/*       component={Translations}/>*/}
                        {/*<Route path={`${process.env.PUBLIC_URL}/localization/currency-rates`} component={Rates}/>*/}
                        {/*<Route path={`${process.env.PUBLIC_URL}/localization/taxes`} component={Taxes}/>*/}

                        {/*<Route path={`${process.env.PUBLIC_URL}/reports/report`} component={Reports}/>*/}

                        <Route path={`${process.env.PUBLIC_URL}/settings/profile`} component={Profile} />

                        {/*<Route path={`${process.env.PUBLIC_URL}/invoice`} component={Invoice}/>*/}

                        {/*<Route path={`${process.env.PUBLIC_URL}/data-table`} component={Datatable}/>*/}

                        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Dashboard} />
                        {/*<Redirect to="/" />*/}
                        {/*</Switch>*/}
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


