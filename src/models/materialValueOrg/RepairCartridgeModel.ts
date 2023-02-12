import {LocationModel} from "../spr/LocationModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface RepairCartridgeModel {
    statement: ReasonModel;
    location: LocationModel;
    printer: MaterialValueOrgModel;
    cartridge: MaterialValueOrgModel;
}

export interface RepairCartridgeSendModel {
    statementId: string;
    locationId: string;
    printerId: string;
    cartridgeId: string;
}