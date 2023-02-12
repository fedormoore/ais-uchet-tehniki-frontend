import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

import {Avatar, Col, Dropdown, Layout, Menu, MenuProps, Row, Typography} from "antd";

import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";

import {routeNames} from "../../routes";
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {AuthActionCreators} from "../../reducers/auth/authActionCreators";
import Login from "../../pages/auth/Login";
import Registration from "../../pages/auth/Registration";

const {Header} = Layout;
const {Link} = Typography;

const HeaderMenu = () => {

    const [viewLogin, setViewLogin] = useState<boolean>(false);
    const [viewRegistration, setViewRegistration] = useState<boolean>(false);

    const navigate = useNavigate();

    const {logoutAction} = useActions(AuthActionCreators);
    const {isAuth} = useTypedSelector(state => state.auth)

    const menuItemsPublic: MenuProps['items'] = [
        {
            key: "item-1",
            label: 'Логин',
            onClick: () => setViewLogin(true),
        },
        {
            key: "item-2",
            label: 'Регистрация',
            onClick: () => setViewRegistration(true),
        }
    ]

    const items: MenuProps['items'] = [
        {
            key: "item-1",
            label: 'Профиль',
            icon: <UserOutlined/>
        },
        {
            key: "item-2",
            label: 'Настройка',
            icon: <SettingOutlined/>,
            onClick: () => navigate(routeNames.ACCOUNT_SETTING),
        },
        {
            key: "item-3",
            label: 'Выход',
            icon: <LogoutOutlined/>,
            onClick: () => logoutAction(),
        }
    ]

    return (
        <>
            {isAuth
                ?
                <Header className="header" style={{paddingLeft: 30}}>
                    <Row gutter={24}>
                        <Col span={22}>
                            <Link onClick={() => navigate(routeNames.MAIN)}>
                                <Typography.Title level={4} style={{margin: '15px', color: "white"}}
                                >АИС "Учет материальных ценностей"</Typography.Title>
                            </Link>
                        </Col>
                        <Col span={2}>
                            <Row justify={"center"}>
                                <Dropdown menu={{items}} placement="bottomRight">
                                    <Avatar size={64} icon={<UserOutlined/>}/>
                                </Dropdown>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                :
                <Header className="header" style={{paddingLeft: 30, paddingRight: 60}}>
                    <Row gutter={24}>
                        <Col span={22}>
                            <Link onClick={() => navigate(routeNames.MAIN)}>
                                <Typography.Title level={4} style={{margin: '15px', color: "white"}}
                                >АИС "Учет материальных ценностей"</Typography.Title>
                            </Link>
                        </Col>
                        <Col span={2}>
                            <Row justify={"center"}>
                                <Menu theme={"dark"} mode="horizontal" selectable={false}
                                      style={{justifyContent: "end"}}
                                      items={menuItemsPublic}/>
                            </Row>
                        </Col>
                    </Row>
                </Header>
            }
            {viewLogin &&
                <Login loginOpenModal={viewLogin} loginCloseModal={() => setViewLogin(!viewLogin)}/>
            }
            {viewRegistration &&
                <Registration registrationOpenModal={viewRegistration}
                              registrationCloseModal={() => setViewRegistration(!viewRegistration)}/>
            }
        </>
    );
};

export default HeaderMenu;