import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {BudgetAccountModel} from "../../../models/spr/BudgetAccountModel";
import BudgetAccountDrawer from "../../../pages/spr/drawer/BudgetAccountDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

interface BudgetAccountSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: BudgetAccountModel) => void;
}

let sprBudgetAccount: BudgetAccountModel[] = [];

const BudgetAccountSelect: FC<BudgetAccountSelectProps> = (props) => {

    const [sprBudgetAccountLoading, setSprBudgetAccountLoading] = useState<boolean>(false);
    const [visibleBudgetAccountDrawer, setVisibleBudgetAccountDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadBudgetAccount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadBudgetAccount = () => {
        setSprBudgetAccountLoading(true)
        Request({
            url: UrlEnum.BudgetAccountList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprBudgetAccount = response.data;
                    setSprBudgetAccountLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Бюджетный счет</Text></> :
                <Text>Бюджетный счет</Text>}>
                <Input.Group compact style={{display:"flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: 'Укажите бюджетный счет'
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprBudgetAccountLoading}
                            disabled={sprBudgetAccountLoading}
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
                            {sprBudgetAccount.map((item: BudgetAccountModel) => {
                                return (
                                    <Select.Option value={item.id} key={item.id} object={item}>
                                        {item.code + " " + item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} style={{minWidth:"28.63px"}}
                                    onClick={() => setVisibleBudgetAccountDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleBudgetAccountDrawer &&
                <BudgetAccountDrawer budgetAccountOpenDrawer={visibleBudgetAccountDrawer}
                                     budgetAccountCloseDrawer={() => {
                                         setVisibleBudgetAccountDrawer(!visibleBudgetAccountDrawer);
                                         loadBudgetAccount();
                                     }} budgetAccountValues={{} as BudgetAccountModel}/>
            }
        </>
    );
};

export default BudgetAccountSelect;