import React from 'react';

export const getLocalStorageItem = (key) => {
    return localStorage.getItem(key) || null;
};

export const isValid = (key) => {
    return window[key] !== null && window[key] !== "" && window[key] !== undefined && window[key] !== "undefined";
}

export const getUserPermissions = () => {
    return isValid("permissions") ? JSON.parse(decodeURIComponent(window.permissions)) : [];
};

export const getUserRoles = () => {
    return isValid("roles") ? JSON.parse(decodeURIComponent(window.roles)) : [];
};

export const getPermissionTypes = () => {
    return isValid("permission_types") ? JSON.parse(decodeURIComponent(window.permission_types)) : {};
};

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const userHasPermission = (permission) => {
    const permissions = getUserPermissions();
    const roles = getUserRoles();

    if (roles.includes("Super Admin")) {
        return true;
    }
    return permissions.includes(permission);
}
