import React, {FC} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {SyncOutlined, VerticalAlignTopOutlined} from "@ant-design/icons";

interface RegistryMenuProps {
    onClickMenu: (e: any) => void;
    toStorageDisable: boolean;
}

const CabinetMenu: FC<RegistryMenuProps> = (props) => {

    const items: MenuProps['items'] = [
        {
            label: 'Обновить',
            key: 'refresh',
            icon: <SyncOutlined/>,
        },
        {
            label: 'На склад',
            key: 'toStorage',
            icon: <VerticalAlignTopOutlined/>,
            disabled: props.toStorageDisable
        }
    ];

    return (
        <div style={{display: "flex"}}>
            <Menu onClick={(e) => props.onClickMenu(e)} mode="horizontal" selectable={false} items={items}
                  style={{minWidth: 0, flex: "auto"}}/>
        </div>
    )
};

export default CabinetMenu;