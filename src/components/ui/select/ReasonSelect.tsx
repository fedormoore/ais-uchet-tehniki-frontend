import React, {FC, memo, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {ReasonModel} from "../../../models/ReasonModel";
import ReasonDrawer from "../../../pages/reason/drawer/ReasonDrawer";
import dayjs from "dayjs";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

export type ReasonType = 'contract' | 'statement';

interface ReasonSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: ReasonModel) => void;
    reasonType: ReasonType;
}

let sprContract: ReasonModel[] = [];

const ReasonSelect: FC<ReasonSelectProps> = memo((props) => {

    const [sprContractLoading, setSprContractLoading] = useState<boolean>(false);
    const [visibleContractDrawer, setVisibleContractDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadContract();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadContract = () => {
        setSprContractLoading(true)
        Request({
            url: props.reasonType === 'contract' ? UrlEnum.ReasonContractList : props.reasonType === 'statement' ? UrlEnum.ReasonStatementList : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprContract = response.data;
                    setSprContractLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Основание</Text></> :
                <Text>Основание</Text>}>
                <Input.Group compact style={{display:"flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: 'Укажите основание'
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprContractLoading}
                            disabled={sprContractLoading}
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
                            {sprContract.map((item: ReasonModel) => {
                                return (
                                    <Select.Option value={item.id} key={item.id} object={item}>
                                        { props.reasonType === 'contract' ?
                                            "Контракт от " + dayjs(item.date).format("DD.MM.YYYY") + " №" + item.number + " сумма " + item.sum
                                        :
                                            "Заявление от " + dayjs(item.date).format("DD.MM.YYYY") + " №" + item.number
                                        }
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} style={{minWidth:"28.63px"}}
                                    onClick={() => setVisibleContractDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleContractDrawer &&
            props.reasonType === 'contract' ?
                <ReasonDrawer openDrawer={visibleContractDrawer} interfaceType={'contract'}
                              closeDrawer={() => {
                                    setVisibleContractDrawer(!visibleContractDrawer);
                                    loadContract();
                                }} values={{} as ReasonModel}
                              viewContractSpec={false}/>
                :
                <ReasonDrawer openDrawer={visibleContractDrawer} interfaceType={'statement'}
                              closeDrawer={() => {
                                     setVisibleContractDrawer(!visibleContractDrawer);
                                     loadContract();
                                 }} values={{} as ReasonModel}
                              viewContractSpec={false}/>
            }
        </>
    );
});

export default ReasonSelect;