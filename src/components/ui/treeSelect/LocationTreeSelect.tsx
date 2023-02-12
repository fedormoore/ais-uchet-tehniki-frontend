import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, TreeSelect, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {LocationModel} from "../../../models/spr/LocationModel";
import LocationDrawer from "../../../pages/spr/drawer/LocationDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

export type LocationType = 'storage' | 'cabinet';

interface LocationTreeSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: LocationModel | null) => void;
    locationType: LocationType;
    enable?: boolean;
}

let sprLocation: LocationModel[] = [];

const LocationTreeSelect: FC<LocationTreeSelectProps> = (props) => {

    const [sprLocationLoading, setSprLocationLoading] = useState<boolean>(false);
    const [visibleLocationDrawer, setVisibleLocationDrawer] = useState<boolean>(false);

    const fieldNamesParent = {label: "name", value: "id", children: "children"};

    useEffect(() => {
        if (props.load) {
            loadLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadLocation = () => {
        setSprLocationLoading(true)
        Request({
            url: props.locationType === 'cabinet' ? UrlEnum.LocationOnlyCabinetList : props.locationType === 'storage' ? UrlEnum.LocationOnlyStorageList : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprLocation = response.data;
                    setSprLocationLoading(false);
                } else {

                }
            });
    }

    const selectData = (label: any, extra: any) => {
        if (label === undefined) {
            props.onChange(null)
        }
        const findRecordById = (list: LocationModel[]) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === label) {
                    props.onChange(list[i])
                } else {
                    if (list[i].children !== undefined) {
                        findRecordById(list[i].children!)
                    }
                }
            }
        }
        findRecordById(sprLocation)
    }

    return (
        <div>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;
                    <Text>{props.locationType === 'cabinet' ? 'Кабинет' : props.locationType === 'storage' ? 'Склад' : ''}</Text></> :
                <Text>{props.locationType === 'cabinet' ? 'Кабинет' : props.locationType === 'storage' ? 'Склад' : ''}</Text>}>
                <Input.Group compact style={{display: "flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: props.locationType === 'cabinet' ? 'Укажите кабинет' : props.locationType === 'storage' ? 'Укажите склад' : ''
                            }
                        ]}
                    >
                        <TreeSelect
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprLocationLoading}
                            disabled={sprLocationLoading || props.enable}
                            allowClear
                            showSearch
                            filterTreeNode={(search, item) => {
                                return item.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                            }}
                            notFoundContent={
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                       description="Нет данных"/>
                            }
                            fieldNames={fieldNamesParent}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            treeData={sprLocation}
                            treeDefaultExpandAll
                            onChange={(value, label, extra) => selectData(value, extra)}
                        />
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} disabled={props.enable}
                                    style={{minWidth: "28.63px"}}
                                    onClick={() => setVisibleLocationDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleLocationDrawer &&
                <LocationDrawer locationOpenDrawer={visibleLocationDrawer}
                                locationCloseDrawer={() => {
                                    setVisibleLocationDrawer(!visibleLocationDrawer);
                                    loadLocation();
                                }}
                                locationValues={{} as LocationModel}/>
            }
        </div>
    );
};

export default LocationTreeSelect;