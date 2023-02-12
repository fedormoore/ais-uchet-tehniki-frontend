import React from 'react';

import {Layout, Menu, MenuProps} from 'antd';
import {CreditCardOutlined, FileDoneOutlined, PrinterOutlined, UnorderedListOutlined} from '@ant-design/icons';

import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useNavigate} from "react-router-dom";
import {routeNames} from "../../routes";

const {Sider} = Layout;

const menuItems: MenuProps['items'] = [
    {
        key: 'spr',
        label: 'Справочник',
        icon: <UnorderedListOutlined/>,
        children: [
            {
                key: "location",
                label: 'Кабинеты и склады'
            },
            {
                key: "organization",
                label: 'Организации и отделы'
            },
            {
                key: "user",
                label: 'Сотрудники'
            },
            {
                key: "device_type",
                label: 'Тип материальных ценностей'
            },
            {
                key: "device",
                label: 'Материальные ценности'
            },
            {
                key: "counterparty",
                label: 'Контрагенты'
            },
            {
                key: "budget_account",
                label: 'Учетный счет'
            }
        ]
    },
    {
        key: 'cs',
        label: 'Основание',
        icon: <FileDoneOutlined/>,
        children: [
            {
                key: 'contract',
                label: 'Контракты',
            },
            {
                key: 'statement',
                label: 'Заявления',
            }
        ]
    },
    {
        key: 'mv',
        label: 'Материальные ценности',
        icon: <CreditCardOutlined/>,
        children: [
            {
                key: 'storage',
                label: 'На складе',
            },
            {
                key: 'registry',
                label: 'В кабинете',
            }
        ]
    },
    {
        key: 'report',
        label: 'Отчеты',
        icon: <PrinterOutlined/>,
    }
]

const LeftMenu = () => {

    const navigate = useNavigate();

    const {isAuth} = useTypedSelector(state => state.auth)

    const onClickMenu: MenuProps['onClick'] = e => {
        switch (e.key) {
            case "location": {
                navigate(routeNames.LOCATION);
                break;
            }
            case "organization": {
                navigate(routeNames.ORGANIZATION);
                break;
            }
            case "user": {
                navigate(routeNames.USER);
                break;
            }
            case "device_type": {
                navigate(routeNames.DEVICE_TYPE);
                break;
            }
            case "device": {
                navigate(routeNames.DEVICE);
                break;
            }
            case "counterparty": {
                navigate(routeNames.COUNTERPARTY);
                break;
            }
            case "budget_account": {
                navigate(routeNames.BUDGET_ACCOUNT);
                break;
            }
            case "contract": {
                navigate(routeNames.CONTRACT);
                break;
            }
            case "statement": {
                navigate(routeNames.STATEMENT);
                break;
            }
            case "storage": {
                navigate(routeNames.STORAGE);
                break;
            }
            case "registry": {
                navigate(routeNames.REGISTRY);
                break;
            }
            case "report": {
                navigate(routeNames.REPORT);
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <>
            {
                isAuth &&
                <Sider
                    className="leftMenu"
                    collapsible
                    width={300}
                    theme={"dark"}
                >
                    <Menu
                        mode="inline"
                        items={menuItems}
                        onClick={onClickMenu}
                        theme={"dark"}
                    >
                    </Menu>
                </Sider>
            }
        </>
    );
};

export default LeftMenu;