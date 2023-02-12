import {combineReducers} from "redux";

import {authReducer} from "./auth/authReducer";
import {appReducer} from "./app/appReducer";
import {userReducer} from "./spr/user/userReducer";
import {locationReducer} from "./spr/location/locationReducer";
import {materialValueTypeReducer} from "./spr/materialValueType/materialValueTypeReducer";
import {materialValueReducer} from "./spr/materialValue/materialValueReducer";
import {counterpartyReducer} from "./spr/counterparty/counterpartyReducer";
import {budgetAccountReducer} from "./spr/budgetAccount/budgetAccountReducer";
import {organizationReducer} from "./spr/organization/organizationReducer";
import {materialValueOrgReducer} from "./materialValueOrg/materialValueOrgReducer";
import {reasonReducer} from "./reason/reasonReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    user: userReducer,
    location: locationReducer,
    materialValueType: materialValueTypeReducer,
    materialValue: materialValueReducer,
    counterparty: counterpartyReducer,
    budgetAccount: budgetAccountReducer,
    organization: organizationReducer,
    reason: reasonReducer,
    registry: materialValueOrgReducer
})

export type RootState = ReturnType<typeof rootReducer>
