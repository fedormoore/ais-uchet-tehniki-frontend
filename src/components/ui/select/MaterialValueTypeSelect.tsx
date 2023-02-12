import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import MaterialValueTypeDrawer from "../../../pages/spr/drawer/MaterialValueTypeDrawer";
import {MaterialValueTypeModel} from "../../../models/spr/MaterialValueTypeModel";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

interface DeviceTypeSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: MaterialValueTypeModel) => void;
}

let sprDeviceType: MaterialValueTypeModel[] = [];

const MaterialValueTypeSelect: FC<DeviceTypeSelectProps> = (props) => {

    const [sprDeviceTypeLoading, setSprDeviceTypeLoading] = useState<boolean>(false);
    const [visibleDeviceTypeDrawer, setVisibleDeviceTypeDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadDeviceTypeType();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadDeviceTypeType = () => {
        setSprDeviceTypeLoading(true)
        Request({
            url: UrlEnum.MaterialValueTypeList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprDeviceType = response.data;
                    setSprDeviceTypeLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Тип оборудования</Text></> :
                <Text>Тип оборудования</Text>}>
                <Input.Group compact style={{display:"flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: 'Укажите тип оборудования'
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprDeviceTypeLoading}
                            disabled={sprDeviceTypeLoading}
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
                            {sprDeviceType.map((item: MaterialValueTypeModel) => {
                                return (
                                    <Select.Option value={item.id} key={item.name} object={item}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} style={{minWidth:"28.63px"}}
                                    onClick={() => setVisibleDeviceTypeDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleDeviceTypeDrawer &&
                <MaterialValueTypeDrawer materialValueTypeOpenDrawer={visibleDeviceTypeDrawer}
                                         materialValueTypeCloseDrawer={() => {
                                      setVisibleDeviceTypeDrawer(!visibleDeviceTypeDrawer);
                                      loadDeviceTypeType();
                                  }} materialValueTypeValues={{} as MaterialValueTypeModel}/>
            }
        </>
    )
        ;
};

export default MaterialValueTypeSelect;