import React, {FC} from 'react';

import {
    ApartmentOutlined,
    BgColorsOutlined,
    ClusterOutlined,
    DeleteOutlined,
    PlusOutlined,
    RedoOutlined,
    RetweetOutlined,
    SyncOutlined,
    ToolOutlined,
    UndoOutlined,
    VerticalAlignBottomOutlined
} from "@ant-design/icons";
import type {MenuProps} from 'antd';
import {Menu} from 'antd';

interface StorageMenuProps {
    onClickMenu: (e: any) => void;
    buttonDisable: buttonDisableStorageMenu;
    buttonVisible?: buttonVisibleStorageMenu;
}

export interface buttonDisableStorageMenu {
    toRegistryDisable: boolean,
    assembleDisable: boolean,
    disassembleDisable: boolean,
    addDisable: boolean,
    removeDisable: boolean,
    replacementDisable: boolean,
    repairDisable: boolean,
    replacementCartridgeDisable: boolean,
    refillingCartridgesDisable: boolean,
    writeOffDisable: boolean,
    disposeOfDisable: boolean
}

export interface buttonVisibleStorageMenu {
    refreshVisible?: boolean,
    incomeVisible?: boolean,
    toRegistryVisible?: boolean,
    assembleDisassembleVisible?: boolean,
    // addDisable: boolean,
    // removeDisable: boolean,
    // replacementDisable: boolean,
    // repairDisable: boolean,
    replacementRefillingCartridgesVisible?: boolean,
    writeOffDisposeOfVisible?: boolean,
}

const StorageMenu: FC<StorageMenuProps> = (props) => {

    const refreshRecord = () => {
        if (props.buttonVisible?.refreshVisible || props.buttonVisible?.refreshVisible === undefined) {
            return {
                label: 'Обновить',
                key: 'refresh',
                icon: <SyncOutlined/>,
            }
        }
        return null
    }

    const income = () => {
        if (props.buttonVisible?.incomeVisible || props.buttonVisible?.incomeVisible === undefined) {
            return {
                label: 'Добавить',
                key: 'income',
                icon: <PlusOutlined/>,
            }
        }
        return null
    }

    const toRegistry = () => {
        if (props.buttonVisible?.toRegistryVisible || props.buttonVisible?.toRegistryVisible === undefined) {
            return {
                label: 'Выдать',
                key: 'toRegistry',
                icon: <VerticalAlignBottomOutlined/>,
                disabled: props.buttonDisable.toRegistryDisable
            }
        }
        return null
    }

    const assembleDisassemble = () => {
        if (props.buttonVisible?.assembleDisassembleVisible || props.buttonVisible?.assembleDisassembleVisible === undefined) {
            return {
                label: 'Комплектация МЦ',
                key: 'device',
                icon: <ApartmentOutlined/>,
                children: [
                    {
                        label: 'Собрать из комплектующих',
                        key: 'assemble',
                        icon: <ApartmentOutlined/>,
                        disabled: props.buttonDisable.assembleDisable
                    },
                    {
                        label: 'Разобрать на комплектующие',
                        key: 'disassemble',
                        icon: <ApartmentOutlined/>,
                        disabled: props.buttonDisable.disassembleDisable
                    },
                ]
            }
        }
        return null
    }

    const replacementRefillingCartridges = () => {
        if (props.buttonVisible?.replacementRefillingCartridgesVisible || props.buttonVisible?.replacementRefillingCartridgesVisible === undefined) {
            return {
                label: 'Картриджи',
                key: 'сartridge',
                icon: <BgColorsOutlined/>,
                children: [
                    {
                        label: 'Замена картриджа',
                        key: 'replacementCartridge',
                        icon: <RedoOutlined/>,
                        disabled: props.buttonDisable.replacementCartridgeDisable
                    },
                    {
                        label: 'Заправка картриджей',
                        key: 'refillingCartridges',
                        icon: <UndoOutlined/>,
                        disabled: props.buttonDisable.refillingCartridgesDisable
                    }
                ]
            }
        }
        return null
    }

    const writeOffDisposeOf = () => {
        if (props.buttonVisible?.writeOffDisposeOfVisible || props.buttonVisible?.writeOffDisposeOfVisible === undefined) {
            return {
                label: 'Списать',
                key: 'deleted',
                icon: <DeleteOutlined/>,
                children: [
                    {
                        label: 'Списать',
                        key: 'writeOff',
                        icon: <DeleteOutlined/>,
                        disabled: props.buttonDisable.writeOffDisable
                    },
                    {
                        label: 'Утилизировать',
                        key: 'disposeOf',
                        icon: <DeleteOutlined/>,
                        disabled: props.buttonDisable.disposeOfDisable
                    }
                ]
            }
        }
        return null
    }

    const items: MenuProps['items'] = [
        refreshRecord(),
        income(),
        toRegistry(),
        assembleDisassemble(),
        {
            label: 'Изменение состава',
            key: 'changeComposition',
            icon: <ClusterOutlined/>,
            children: [
                {
                    label: 'Включить в состав',
                    key: 'addDevice',
                    icon: <ClusterOutlined/>,
                    disabled: props.buttonDisable.addDisable
                },
                {
                    label: 'Вывести из состава',
                    key: 'removeDevice',
                    icon: <ClusterOutlined/>,
                    disabled: props.buttonDisable.removeDisable
                },
                {
                    label: 'Замена',
                    key: 'replacement',
                    icon: <RetweetOutlined/>,
                    disabled: props.buttonDisable.replacementDisable
                }
            ]
        },
        {
            label: 'Ремонт',
            key: 'repair',
            icon: <ToolOutlined/>,
            disabled: props.buttonDisable.repairDisable
        },
        replacementRefillingCartridges(),
        writeOffDisposeOf()
    ];

    return (
        <div style={{display: "flex"}}>
            <Menu onClick={(e) => props.onClickMenu(e)} mode="horizontal" selectable={false} items={items}
                  style={{minWidth: 0, flex: "auto"}}/>
        </div>
    )
};

export default StorageMenu;