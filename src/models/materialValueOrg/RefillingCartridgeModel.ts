import {ReasonModel} from "../ReasonModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";

export interface RefillingCartridgeModel {
    contract: ReasonModel;
    cartridge: MaterialValueOrgModel[];
}

export interface RefillingCartridgeSendModel {
    contractId: string;
    cartridge: RefillingCartridgeListSendModel[];
}

export interface RefillingCartridgeListSendModel {
    id: string;
}