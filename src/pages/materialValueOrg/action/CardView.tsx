import React, {FC} from 'react';
import {Button, Collapse, Modal, Space, Tooltip} from "antd";
import {getDeviceName} from "../../../components/storage";
import {DeleteOutlined} from "@ant-design/icons";
import {AssembleModel} from "../../../models/materialValueOrg/AssembleModel";
import {StorageToCabinetModel} from "../../../models/materialValueOrg/StorageToCabinetModel";
import {UserModel} from "../../../models/spr/UserModel";
import {OrganizationModel} from "../../../models/spr/OrganizationModel";
import {MaterialValueTypeModel} from "../../../models/spr/MaterialValueTypeModel";
import {MaterialValueModel} from "../../../models/spr/MaterialValueModel";
import {LocationModel} from "../../../models/spr/LocationModel";
import {CounterpartyModel} from "../../../models/spr/CounterpartyModel";
import {BudgetAccountModel} from "../../../models/spr/BudgetAccountModel";
import {DisassembleModel} from "../../../models/materialValueOrg/DisassembleModel";
import {AddDeviceModel} from "../../../models/materialValueOrg/AddDeviceModel";
import {ReplacementDeviceModel} from "../../../models/materialValueOrg/ReplacementDeviceModel";
import {RepairDeviceModel} from "../../../models/materialValueOrg/RepairDeviceModel";
import {RepairCartridgeModel} from "../../../models/materialValueOrg/RepairCartridgeModel";
import {RefillingCartridgeModel} from "../../../models/materialValueOrg/RefillingCartridgeModel";
import {DisposeOfModel} from "../../../models/materialValueOrg/DisposeOfModel";
import {WriteOffModel} from "../../../models/materialValueOrg/WriteOffModel";
import {ReasonModel} from "../../../models/ReasonModel";
import {RegistryToStorageModel} from "../../../models/registy/action/RegistryToStorageModel";

const {Panel} = Collapse;

export type TypeModel =
    'AssembleModel'
    | 'StorageToCabinetModel'
    |'RegistryToStorageModel'
    | 'UserModel'
    | 'OrganizationModel'
    | 'MaterialValueTypeModel'
    | 'MaterialValueModel'
    | 'LocationModel'
    | 'CounterpartyModel'
    | 'BudgetAccountModel'
    | 'DisassembleModel'
    | 'AddDeviceModel'
    | 'ReplacementDeviceModel'
    | 'RepairDeviceModel'
    | 'RepairCartridgeModel'
    | 'RefillingCartridgeModel'
    | 'DisposeOfModel'
    | 'WriteOffModel'
    | 'ReasonModel';

interface CardViewProps {
    typeModel: TypeModel,
    values: AssembleModel[] | StorageToCabinetModel[] | RegistryToStorageModel[] | UserModel[] | OrganizationModel[] | MaterialValueTypeModel[] | MaterialValueModel[] | LocationModel[] | CounterpartyModel[] | BudgetAccountModel[] | DisassembleModel[] | AddDeviceModel[] | ReplacementDeviceModel[] | RepairDeviceModel[] | RepairCartridgeModel[] | RefillingCartridgeModel[] | DisposeOfModel[] | WriteOffModel[] | ReasonModel[],
    removeField?: (event: React.MouseEvent, index: number) => void,
    viewField: (loadSelect: boolean, deletedRecord: boolean, index: number) => any
}

const CardView: FC<CardViewProps> = (props) => {

    const x = (index: number) => {
        if (props.typeModel === 'LocationModel') {
            return ((props.values as LocationModel[])[index].type || '') + " " + ((props.values as LocationModel[])[index].name || '')
        }
        if (props.typeModel === 'OrganizationModel') {
            return ((props.values as LocationModel[])[index].type || '') + " " + ((props.values as LocationModel[])[index].name || '')
        }
        if (props.typeModel === 'UserModel') {
            return ((props.values as UserModel[])[index].lastName || '') + " " + ((props.values as UserModel[])[index].firstName || '') + " " + ((props.values as UserModel[])[index].middleNames || '')
        }
        if (props.typeModel === 'MaterialValueTypeModel') {
            return (props.values as MaterialValueTypeModel[])[index].name || ''
        }
        if (props.typeModel === 'MaterialValueModel') {
            return ((props.values as MaterialValueModel[])[index].materialValueType?.name || '') + " " + ((props.values as MaterialValueModel[])[index].nameInOrg || '') + " " + ((props.values as MaterialValueModel[])[index].nameFirm || '') + " " + ((props.values as MaterialValueModel[])[index].nameModel || '')
        }
        if (props.typeModel === 'CounterpartyModel') {
            return (props.values as CounterpartyModel[])[index].name || ''
        }
        if (props.typeModel === 'BudgetAccountModel') {
            return ((props.values as BudgetAccountModel[])[index].code || '') + " " + ((props.values as BudgetAccountModel[])[index].name || '')
        }
        if (props.typeModel === 'AssembleModel') {
            return getDeviceName((props.values as AssembleModel[])[index].materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'AddDeviceModel') {
            return getDeviceName((props.values as AddDeviceModel[])[index].inDevice?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'DisassembleModel') {
            return (props.values as DisassembleModel[])[index].location?.name || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'ReplacementDeviceModel') {
            return getDeviceName((props.values as ReplacementDeviceModel[])[index].replacementInDevice?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'RepairDeviceModel') {
            return getDeviceName((props.values as RepairDeviceModel[])[index].device?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'RepairCartridgeModel') {
            return getDeviceName((props.values as RepairCartridgeModel[])[index].cartridge?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'StorageToCabinetModel') {
            return getDeviceName((props.values as StorageToCabinetModel[])[index].materialValueOrg?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'RegistryToStorageModel') {
            return getDeviceName((props.values as RegistryToStorageModel[])[index].materialValueOrg?.materialValue) || 'Выберите материальную ценность'
        }
        if (props.typeModel === 'ReasonModel') {
            // return getDeviceName((props.values as StorageToCabinetModel[])[index].materialValueOrg?.materialValue) || 'Выберите материальную ценность'
        }
    }

    return (
        <>
            {props.values.map((item, index) => {
                let deletedRecord: boolean = false
                let loadSelect: boolean = true
                if (index !== 0) {
                    deletedRecord = true
                    loadSelect = false
                }

                return (
                    <div key={index}>
                        <Collapse defaultActiveKey={1}>
                            <Panel
                                header={x(index)}
                                key={1}
                                extra={
                                    <div onClick={(event) => {
                                        event.stopPropagation();
                                    }}>
                                        <Space>
                                            {deletedRecord &&
                                                <Tooltip title="Удалить">
                                                    <Button type="primary" danger icon={<DeleteOutlined/>}
                                                            onClick={(event) => {
                                                                Modal.confirm({
                                                                    centered: true,
                                                                    title: 'Вы точно хотите удалить запись?',
                                                                    okText: 'Да',
                                                                    okButtonProps: {danger: true},
                                                                    cancelText: 'Нет',
                                                                    onOk: () => {
                                                                        props.removeField!(event, index)
                                                                    }
                                                                })
                                                            }}
                                                    />
                                                </Tooltip>}
                                        </Space>
                                    </div>
                                }>
                                {props.viewField(loadSelect, deletedRecord, index)}
                            </Panel>
                        </Collapse>
                    </div>
                )
            })
            }
        </>
    );
};

export default CardView;