import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {AutoComplete, Form, Input, Spin, Typography} from "antd";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

interface FirmSelectProps {
    load: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: string) => void;
}

let sprFirm: { value: string; label: string }[] = [];

const FirmSelect: FC<FirmSelectProps> = (props) => {

    const [sprFirmLoading, setSprFirmLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.load) {
            loadFirm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadFirm = () => {
        setSprFirmLoading(true)
        Request({
            url: UrlEnum.MaterialValueFirmList,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    for (let i = 0; i < response.data.length; i++) {
                        sprFirm = sprFirm.concat({label: response.data[i], value: response.data[i]})
                    }
                    setSprFirmLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Производитель</Text></> :
                <Text>Производитель</Text>}>
                <Spin size="small" spinning={sprFirmLoading}>
                    <Input.Group compact>
                        <Form.Item
                            noStyle
                            name={props.name}
                            rules={[
                                {
                                    required: props.rulesOn,
                                    message: 'Укажите производителя'
                                }
                            ]}
                        >

                            <AutoComplete
                                style={{width: '100%'}}
                                disabled={sprFirmLoading}
                                allowClear
                                options={sprFirm}
                                showSearch
                                filterOption={(inputValue, option) =>
                                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onChange={(value) => props.onChange(value)}
                            >
                            </AutoComplete>
                        </Form.Item>
                    </Input.Group>
                </Spin>
            </Form.Item>
        </>
    );
};

export default FirmSelect;