import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {CounterpartyModel} from "../../../models/spr/CounterpartyModel";
import CounterpartyDrawer from "../../../pages/spr/drawer/CounterpartyDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

interface CounterpartySelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: CounterpartyModel) => void;
}

let sprCounterparty: CounterpartyModel[] = [];

const CounterpartySelect: FC<CounterpartySelectProps> = (props) => {

    const [sprCounterpartyLoading, setSprCounterpartyLoading] = useState<boolean>(false);
    const [visibleCounterpartyDrawer, setVisibleCounterpartyDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadCounterparty();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadCounterparty = () => {
        setSprCounterpartyLoading(true)
        Request({
            url: UrlEnum.CounterpartyList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprCounterparty = response.data;
                    setSprCounterpartyLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Контрагент</Text></> :
                <Text>Контрагент</Text>}>
                <Input.Group compact style={{display: "flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: 'Укажите контрагента'
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprCounterpartyLoading}
                            disabled={sprCounterpartyLoading}
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
                            {sprCounterparty.map((item: CounterpartyModel) => {
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
                                    onClick={() => setVisibleCounterpartyDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleCounterpartyDrawer &&
                <CounterpartyDrawer counterpartyOpenDrawer={visibleCounterpartyDrawer}
                                    counterpartyCloseDrawer={() => {
                                        setVisibleCounterpartyDrawer(!visibleCounterpartyDrawer);
                                        loadCounterparty();
                                    }} counterpartyValues={{} as CounterpartyModel}/>
            }
        </>
    );
};

export default CounterpartySelect;