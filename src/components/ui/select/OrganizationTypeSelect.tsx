import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Empty, Form, Select} from "antd";

import {OrganizationTypeModel} from "../../../models/spr/OrganizationTypeModel";
import {UrlEnum} from "../../../constants/urlEnum";

interface OrganizationTypeSelectProps {
    load: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: string) => void;
}

let sprOrganizationType: OrganizationTypeModel[] = [];

const OrganizationTypeSelect: FC<OrganizationTypeSelectProps> = (props) => {

    const [sprOrganizationTypeLoading, setSprOrganizationTypeLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadOrganizationType();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadOrganizationType = () => {
        setSprOrganizationTypeLoading(true)
        Request({
            url: UrlEnum.OrganizationTypeList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprOrganizationType = response.data;
                    setSprOrganizationTypeLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item
                label="Тип"
                name={props.name}
                rules={[
                    {
                        required: props.rulesOn,
                        message: 'Укажите бюджетный счет'
                    }
                ]}
            >
                <Select
                    style={{width: '100%'}}
                    loading={sprOrganizationTypeLoading}
                    disabled={sprOrganizationTypeLoading}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                               description="Нет данных"/>
                    }
                    onChange={(value) => props.onChange(value)}
                >
                    {sprOrganizationType.map((item: OrganizationTypeModel) => {
                        return (
                            <Select.Option value={item.name} key={item.name}>
                                {item.name}
                            </Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>
        </>
    );
};

export default OrganizationTypeSelect;