import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Empty, Form, Select} from "antd";

import {LocationTypeModel} from "../../../models/spr/LocationTypeModel";
import {UrlEnum} from "../../../constants/urlEnum";

interface LocationTypeSelectProps {
    load: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: string) => void;
}

let sprLocationType: LocationTypeModel[] = [];

const LocationTypeSelect: FC<LocationTypeSelectProps> = (props) => {

    const [sprLocationTypeLoading, setSprLocationTypeLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadLocationType();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadLocationType = () => {
        setSprLocationTypeLoading(true)
        Request({
            url: UrlEnum.LocationTypeList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprLocationType = response.data;
                    setSprLocationTypeLoading(false);
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
                    loading={sprLocationTypeLoading}
                    disabled={sprLocationTypeLoading}
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
                    {sprLocationType.map((item: LocationTypeModel) => {
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

export default LocationTypeSelect;