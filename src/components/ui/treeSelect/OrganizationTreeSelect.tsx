import React, {FC, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, TreeSelect, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {OrganizationModel} from "../../../models/spr/OrganizationModel";
import OrganizationDrawer from "../../../pages/spr/drawer/OrganizationDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

export type OrganizationType = 'organization' | 'structure';

interface OrganizationSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: OrganizationModel | null) => void;
    organizationType: OrganizationType;
    enable?: boolean;
}

let sprOrganization: OrganizationModel[] = [];

const OrganizationTreeSelect: FC<OrganizationSelectProps> = (props) => {

    const [sprOrganizationLoading, setSprOrganizationLoading] = useState<boolean>(false);
    const [visibleOrganizationDrawer, setVisibleOrganizationDrawer] = useState<boolean>(false);

    const fieldNamesParent = {label: "name", value: "id", children: "children"};

    useEffect(() => {
        if (props.load) {
            loadOrganization();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadOrganization = () => {
        setSprOrganizationLoading(true)
        Request({
            url: props.organizationType === 'organization' ? UrlEnum.OrganizationOnlyOrgList : props.organizationType === 'structure' ? UrlEnum.OrganizationOnlyStrList : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    sprOrganization = response.data;
                    setSprOrganizationLoading(false);
                } else {

                }
            });
    }

    const selectData = (label: any, extra: any) => {
        if (label === undefined) {
            props.onChange(null)
        }
        const findRecordById = (list: OrganizationModel[]) => {
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
        findRecordById(sprOrganization)
    }

    return (
        <div>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;
                    <Text>{props.organizationType === 'organization' ? 'Оганизация' : props.organizationType === 'structure' ? 'Структура (управление, отдел)' : ''}</Text></> :
                <Text>{props.organizationType === 'organization' ? 'Оганизация' : props.organizationType === 'structure' ? 'Структура (управление, отдел)' : ''}</Text>}>
                <Input.Group compact style={{display: "flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: props.organizationType === 'organization' ? 'Укажите организацию' : props.organizationType === 'structure' ? 'Укажите структуру (управление, отдел)' : ''
                            }
                        ]}
                    >
                        <TreeSelect
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprOrganizationLoading}
                            disabled={sprOrganizationLoading || props.enable}
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
                            treeData={sprOrganization}
                            treeDefaultExpandAll
                            onChange={(value, label, extra) => selectData(value, extra)}
                        />
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} disabled={props.enable}
                                    style={{minWidth: "28.63px"}}
                                    onClick={() => setVisibleOrganizationDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleOrganizationDrawer &&
                <OrganizationDrawer organizationOpenDrawer={visibleOrganizationDrawer}
                                    organizationCloseDrawer={() => {
                                        setVisibleOrganizationDrawer(!visibleOrganizationDrawer);
                                        loadOrganization();
                                    }} organizationValues={{} as OrganizationModel}/>
            }
        </div>
    );
};

export default OrganizationTreeSelect;