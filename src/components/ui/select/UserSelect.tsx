import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {UserModel} from "../../../models/spr/UserModel";
import UserDrawer from "../../../pages/spr/drawer/UserDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

interface UserSelectProps {
    load: boolean;
    buttonAdd: boolean;
    label: string;
    name: string;
    rulesOn: boolean;
    onChange: (value: UserModel) => void;
    enable?:boolean;
}

let sprUser: UserModel[] = [];

const UserSelect: FC<UserSelectProps> = (props) => {

    const [sprUserLoading, setSprUserLoading] = useState<boolean>(false);
    const [visibleUserDrawer, setVisibleUserDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadUser = () => {
        setSprUserLoading(true)
        Request({
            url: UrlEnum.UserList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprUser = response.data;
                    setSprUserLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>{props.label}</Text></> :
                <Text>{props.label}</Text>}>
                <Input.Group compact style={{display:"flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: `Укажите ${props.label}`
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprUserLoading}
                            disabled={sprUserLoading || props.enable}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                            notFoundContent={
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                       description="Нет данных"/>
                            }
                            onChange={(value, objectValues: any) => props.onChange(objectValues?.object)}
                        >
                            {sprUser.map((item: UserModel) => {
                                return (
                                    <Select.Option value={item.id} key={item.id} object={item}>
                                        {item.lastName + " " + item.firstName + " " + item.middleNames}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} disabled={props.enable} style={{minWidth:"28.63px"}}
                                    onClick={() => setVisibleUserDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleUserDrawer &&
                <UserDrawer userOpenDrawer={visibleUserDrawer}
                            userCloseDrawer={() => {
                                 setVisibleUserDrawer(!visibleUserDrawer);
                                 loadUser();
                             }} userValues={{} as UserModel}/>
            }
        </>
    );
};

export default UserSelect;