import React from "react";

const Main = React.lazy(() => import("../pages/Main"));
const Location = React.lazy(() => import("../pages/spr/Location"));
const Organization = React.lazy(() => import("../pages/spr/Organization"));
const User = React.lazy(() => import("../pages/spr/User"));
const MaterialValueType = React.lazy(() => import("../pages/spr/MaterialValueType"));
const MaterialValue = React.lazy(() => import("../pages/spr/MaterialValue"));
const Counterparty = React.lazy(() => import("../pages/spr/Counterparty"));
const BudgetAccount = React.lazy(() => import("../pages/spr/BudgetAccount"));
const Contract = React.lazy(() => import("../pages/reason/Contract"));
const Statement = React.lazy(() => import("../pages/reason/Statement"));
const Storage = React.lazy(() => import("../pages/materialValueOrg/MaterialValueOrgStorage"));
const Registry = React.lazy(() => import("../pages/materialValueOrg/MaterialValueOrgCabinet"));
const Report = React.lazy(() => import("../pages/report/ReportMain"));
const AccountSetting = React.lazy(() => import("../pages/AccountSetting"));

export enum routeNames {

    MAIN = '/main',

    LOCATION = '/location',
    ORGANIZATION = '/organization',
    USER = '/user',
    DEVICE_TYPE = '/material_value_type',
    DEVICE = '/material_value',
    COUNTERPARTY = '/counterparty',
    BUDGET_ACCOUNT = '/budget_account',
    CONTRACT = '/contract',
    STATEMENT = '/statement',
    STORAGE = '/storage',
    REGISTRY = '/registry',
    REPORT = '/report',
    ACCOUNT_SETTING = '/account_setting',

    ACCOUNT_ACTIVATE_TUE = '/activate_account_true',
    ACCOUNT_ACTIVATE_FALSE = '/activate_account_false',
}

interface IRoute {
    path: string;
    element: React.ComponentType;
}

export const privateRoutes: IRoute[] = [
    {
        path: routeNames.LOCATION,
        element: Location
    },
    {
        path: routeNames.ORGANIZATION,
        element: Organization
    },
    {
        path: routeNames.USER,
        element: User
    },
    {
        path: routeNames.DEVICE_TYPE,
        element: MaterialValueType
    },
    {
        path: routeNames.DEVICE,
        element: MaterialValue
    },
    {
        path: routeNames.COUNTERPARTY,
        element: Counterparty
    },
    {
        path: routeNames.BUDGET_ACCOUNT,
        element: BudgetAccount
    },
    {
        path: routeNames.CONTRACT,
        element: Contract
    },
    {
        path: routeNames.STATEMENT,
        element: Statement
    },
    {
        path: routeNames.STORAGE,
        element: Storage
    },
    {
        path: routeNames.REGISTRY,
        element: Registry
    },
    {
        path: routeNames.REPORT,
        element: Report
    },
    {
        path: routeNames.ACCOUNT_SETTING,
        element: AccountSetting
    }
];

export const publicRoutes: IRoute[] = [
    {
        path: routeNames.MAIN,
        element: Main
    },
    {
        path: routeNames.ACCOUNT_ACTIVATE_TUE,
        element: Main
    },
    {
        path: routeNames.ACCOUNT_ACTIVATE_FALSE,
        element: Main
    }
];