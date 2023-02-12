import React, {FC} from 'react';
import {Menu, MenuProps, Modal} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, SyncOutlined, UndoOutlined,} from "@ant-design/icons";

interface ButtonGroupProps {
    button: buttonInterface
}

export interface buttonInterface {
    buttonDisable: buttonDisableMenu,
    buttonVisible: buttonVisibleMenu
    buttonVoid?: buttonVoidMenu,
}

interface buttonDisableMenu {
    addRecord?: boolean,
    editRecord: boolean,
    deleteRecord: boolean,
    refreshRecord?: boolean,
    undoRecord?: boolean
}

interface buttonVisibleMenu {
    addRecord?: boolean,
    editRecord?: boolean,
    deleteRecord?: boolean,
    refreshRecord?: boolean,
    undoRecord?: boolean
}

interface buttonVoidMenu {
    addRecord?: () => void,
    editRecord?: () => void,
    deleteRecord?: () => void,
    refreshRecord?: () => void
    undoRecord?: () => void,
}

export const initButtonList: buttonInterface = {
    buttonDisable: {
        editRecord: true,
        deleteRecord: true
    },
    buttonVisible: {}
}

export const initButton: buttonInterface = {
    buttonDisable: {
        editRecord: true,
        deleteRecord: true
    },
    buttonVisible: {
        editRecord: false,
        refreshRecord: false,
        undoRecord: false
    }
}

const ButtonGroup: FC<ButtonGroupProps> = (props) => {

    const deleteRecordModal = () => {
        Modal.confirm({
            centered: true,
            title: 'Вы точно хотите удалить запись?',
            okText: 'Да',
            okButtonProps: {danger: true},
            cancelText: 'Нет',
            onOk: () => {
                props.button.buttonVoid?.deleteRecord?.()
            }
        })
    }

    const editRecord = () => {
        if (props.button.buttonVisible?.editRecord || props.button.buttonVisible?.editRecord === undefined) {
            return {
                label: 'Редактировать',
                key: 'edit',
                icon: <EditOutlined/>,
                disabled: props.button.buttonDisable.editRecord
            }
        }
        return null
    }

    const deletedRecord = () => {
        if (props.button.buttonVisible?.deleteRecord || props.button.buttonVisible?.deleteRecord === undefined) {
            return {
                label: 'Удалить',
                key: 'deleted',
                icon: <DeleteOutlined/>,
                disabled: props.button.buttonDisable.deleteRecord
            }
        }
        return null
    }

    const refreshRecord = () => {
        if (props.button.buttonVisible?.refreshRecord || props.button.buttonVisible?.refreshRecord === undefined) {
            return {
                label: 'Обновить',
                key: 'refresh',
                icon: <SyncOutlined/>,
            }
        }
        return null
    }

    const undoRecord = () => {
        if (props.button.buttonVisible?.undoRecord && props.button.buttonVisible?.undoRecord !== undefined) {
            return {
                label: 'Востановить',
                key: 'undo',
                icon: <UndoOutlined/>,
                disabled: props.button.buttonDisable.undoRecord
            }
        }
        return null
    }

    const items: MenuProps['items'] = [
        {
            label: 'Добавить',
            key: 'add',
            icon: <PlusOutlined/>,
            disabled: props.button.buttonDisable.addRecord
        },
        editRecord(),
        deletedRecord(),
        undoRecord(),
        refreshRecord()
    ];

    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case "add": {
                props.button.buttonVoid?.addRecord?.()
                break;
            }
            case "edit": {
                props.button.buttonVoid?.editRecord?.()
                break;
            }
            case "deleted": {
                deleteRecordModal();
                break;
            }
            case "undo": {
                props.button.buttonVoid?.undoRecord?.()
                break;
            }
            case "refresh": {
                props.button.buttonVoid?.refreshRecord?.()
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <div style={{display: "flex"}}>
            <Menu onClick={(e) => onClickTopMenu(e)} mode="horizontal" selectable={false} items={items}
                  style={{minWidth: 0, flex: "auto"}}/>
        </div>
    )
};

export default ButtonGroup;