import {
    Home,
    Box,
    UserPlus,
    Users,
    CheckCircle,
    ShoppingBag,
    List,
    BarChart, Settings, Archive, LogIn, Truck
} from 'react-feather';
import {getPermissionTypes} from "../utils/utils";


const PermissionTypes = window.permission_types !== 'undefined' ? getPermissionTypes() : null;

export const MENUITEMS = PermissionTypes ? [
    {
        path: '/', title: 'Dashboard', icon: Home, type: 'link', badgeType: 'primary', active: false,
        permissions: [PermissionTypes.USER.GET, PermissionTypes.USER.CREATE],
    },
    {
        title: 'Users', icon: UserPlus, type: 'sub', active: false,
        permissions: ['user get', 'user create'],
        children: [
            {
                path: '/list-users', title: 'User List', type: 'link',
                permissions: [PermissionTypes.USER.GET]
            },
            {path: '/list-admins', title: 'Admin List', type: 'link', permissions: [PermissionTypes.USER.GET]},
            {path: '/create-user', title: 'Add Admin', type: 'link', permissions: [PermissionTypes.USER.CREATE]},
        ]
    },
    {
        title: 'Roles', icon: CheckCircle, type: 'sub', active: false,
        permissions: [PermissionTypes.ROLE.CREATE, PermissionTypes.ROLE.GET],
        children: [
            {path: '/list-roles', title: 'Role List', type: 'link', permissions: [PermissionTypes.ROLE.GET]},
            {path: '/create-role', title: 'Add Role', type: 'link', permissions: [PermissionTypes.ROLE.CREATE]},
        ]
    },
    {
        title: 'Shops', icon: ShoppingBag, type: 'sub', active: false,
        permissions: [PermissionTypes.SHOP.GET, PermissionTypes.SHOP.CREATE],
        children: [
            {path: '/shops/list', title: 'Shop List', type: 'link', permissions: [PermissionTypes.SHOP.GET]},
            {path: '/shops/create', title: 'Add Shop', type: 'link', permissions: [PermissionTypes.SHOP.CREATE]},
        ]
    },
    {
        title: 'Categories', icon: List, type: 'sub', active: false,
        permissions: [PermissionTypes.PRODUCT_CATEGORY.GET],
        children: [
            {path: '/categories/list', title: 'Category List', type: 'link', permissions: [PermissionTypes.PRODUCT_CATEGORY.GET]},
            {path: '/category/create', title: 'Add Category', type: 'link', permissions: [PermissionTypes.PRODUCT_CATEGORY.CREATE]},
        ]
    },
    {
        title: 'Products', icon: Truck, type: 'sub', active: false,
        permissions: [PermissionTypes.UNIT.GET,PermissionTypes.BRAND.GET, PermissionTypes.PRODUCT.GET, PermissionTypes.SUPPLIER.GET],
        children: [
            {path: '/suppliers/list', title: 'Suppliers', type: 'link', permissions: [PermissionTypes.SUPPLIER.GET]},
            {path: '/brands/list', title: 'Brands', type: 'link', permissions: [PermissionTypes.BRAND.GET]},
            {path: '/units/list', title: 'Units', type: 'link', permissions: [PermissionTypes.UNIT.GET]},
            {path: '/products/list', title: 'Products', type: 'link', permissions: [PermissionTypes.PRODUCT.GET]},
        ]
    },
    {
        path: '/inventories/list', icon: Box,  title: 'Inventory', type: 'link', permissions: [PermissionTypes.INVENTORY.GET]
    },
    {
        title: 'Offer & Discount', icon: Truck, type: 'sub', active: false,
        permissions: [],
        children: [
            {path: '/offer/list', title: 'Offer', type: 'link', permissions: []},
        ]
    },
    /*{
        title: 'Products', icon: Box, type: 'sub', active: false, children: [
            {
                title: 'Physical', type: 'sub', active: false, children: [
                    { path: '/products/physical/category', title: 'Category', type: 'link' },
                    { path: '/products/physical/sub-category', title: 'Sub Category', type: 'link' },
                    { path: '/products/physical/product-list', title: 'Product List', type: 'link' },
                    { path: '/products/physical/product-detail', title: 'Product Detail', type: 'link' },
                    { path: '/products/physical/add-product', title: 'Add Product', type: 'link' },
                ]
            },
            {
                title: 'digital', type: 'sub', active: false, children: [
                    { path: '/products/digital/digital-category', title: 'Category', type: 'link' },
                    { path: '/products/digital/digital-sub-category', title: 'Sub Category', type: 'link' },
                    { path: '/products/digital/digital-product-list', title: 'Product List', type: 'link' },
                    { path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link' },
                ]
            },
        ]
    },*/
    /*{
        title: 'Menus', icon: AlignLeft, type: 'sub', active: false, children: [
            { path: '/menus/list-menu', title: 'List Menu', type: 'link' },
            { path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
        ]
    },
    {
        title: 'Sales', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/sales/orders', title: 'Orders', type: 'link' },
            { path: '/sales/transactions', title: 'Transactions', type: 'link' },
        ]
    },
    {
        title: 'Coupons', icon: Tag, type: 'sub', active: false, children: [
            { path: '/coupons/list-coupons', title: 'List Coupons', type: 'link' },
            { path: '/coupons/create-coupons', title: 'Create Coupons', type: 'link' },
        ]
    },
    {
        title: 'Pages', icon: Clipboard , type: 'sub', active: false, children: [
            { path: '/pages/list-page', title: 'List Page', type: 'link' },
            { path: '/pages/create-page', title: 'Create Page', type: 'link' },
        ]
    },
    {
        title: 'Media', path: '/media', icon: Camera, type: 'link', active: false
    },
    {
        title: 'Vendors', icon: Users, type: 'sub', active: false, children: [
            { path: '/vendors/list_vendors', title: 'Vendor List', type: 'link' },
            { path: '/vendors/create-vendors', title: 'Create Vendor', type: 'link' },
        ]
    },
    {
        title: 'Localization', icon: Chrome, type: 'sub', children: [
            { path: '/localization/transactions', title: 'Translations', type: 'link' },
            { path: '/localization/currency-rates', title: 'Currency Rates', type: 'link' },
            { path: '/localization/taxes', title: 'Taxes', type: 'link' }
        ]
    },
    {
        title: 'Reports',path:'/reports/report', icon: BarChart, type: 'link', active: false
    },
    {
        title: 'Settings', icon: Settings, type: 'sub', children: [
            { path: '/settings/profile', title: 'Profile', type: 'link' },
        ]
    },
    {
        title: 'Invoice',path:'/invoice', icon: Archive, type: 'link', active: false
    },
    {
        title: 'Login',path:'/auth/login', icon: LogIn, type: 'link', active: false
    }*/
] : [];
