import React, {FC, memo, useEffect, useState} from 'react';
import {Request} from "../../../http/network";

import {Button, Empty, Form, Input, Select, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {MaterialValueModel} from "../../../models/spr/MaterialValueModel";
import MaterialValueDrawer from "../../../pages/spr/drawer/MaterialValueDrawer";
import {UrlEnum} from "../../../constants/urlEnum";

const {Text} = Typography;

export type UrlType = 'nameInOrgIsNotNull' | 'allMaterialValue' | 'allMaterialValueByAddToOtherTrue';

interface ModelSelectProps {
    load: boolean;
    buttonAdd: boolean;
    name: string;
    rulesOn: boolean;
    onChange: (value: MaterialValueModel) => void;
    typeUrl:UrlType;
}

let sprAllMaterialValue: MaterialValueModel[] = [];
let sprNameInOrgIsNotNull: MaterialValueModel[] = [];
let sprAllMaterialValueByAddToOtherTrue: MaterialValueModel[] = [];

const MaterialValueSprSelect: FC<ModelSelectProps> = memo((props) => {

    const [sprModelLoading, setSprModelLoading] = useState<boolean>(false);
    const [visibleModelDrawer, setVisibleModelDrawer] = useState<boolean>(false);
    const [sprModel, serSprModel]= useState<MaterialValueModel[]>([]);
    useEffect(() => {
        if (props.load) {
            loadModel();
        }else{
            if (props.typeUrl === 'allMaterialValue'){
                serSprModel(sprAllMaterialValue);
            }else if(props.typeUrl === 'nameInOrgIsNotNull'){
                serSprModel(sprNameInOrgIsNotNull);
            }else if(props.typeUrl === 'allMaterialValueByAddToOtherTrue'){
                serSprModel(sprAllMaterialValueByAddToOtherTrue);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadModel = () => {
        setSprModelLoading(true)
        Request({
            url: props.typeUrl === 'allMaterialValue' ? UrlEnum.MaterialValueList :
                props.typeUrl === 'nameInOrgIsNotNull' ? UrlEnum.MaterialValueNameInOrgIsNotNullList :
                    props.typeUrl === 'allMaterialValueByAddToOtherTrue' ? UrlEnum.MaterialValueByAddToOtherTrueList : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    if (props.typeUrl === 'allMaterialValue'){
                        sprAllMaterialValue=response.data;
                    }else if(props.typeUrl === 'nameInOrgIsNotNull'){
                        sprNameInOrgIsNotNull=response.data;
                    }else if(props.typeUrl === 'allMaterialValueByAddToOtherTrue'){
                        sprAllMaterialValueByAddToOtherTrue=response.data;
                    }
                    serSprModel(response.data);
                    setSprModelLoading(false);
                } else {

                }
            });
    }

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>Материальная ценность</Text></> :
                <Text>Материальная ценность</Text>}>
                <Input.Group compact style={{display:"flex", paddingRight:'30px'}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: 'Укажите материальнцю ценность'
                            }
                        ]}
                    >
                        <Select
                            style={{maxWidth: '100%', minWidth:'100%'}}
                            loading={sprModelLoading}
                            disabled={sprModelLoading}
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
                            {sprModel.map((item: MaterialValueModel) => {
                                return (
                                    <Select.Option value={item.id} key={item.id} object={item}>
                                        {item.materialValueType.name + " " + item.nameInOrg + " " + item.nameFirm + " " + item.nameModel}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle>
                        {props.buttonAdd &&
                            <Button type="primary" icon={<PlusOutlined/>} style={{minWidth:"28.63px"}}
                                    onClick={() => setVisibleModelDrawer(true)}
                            ></Button>
                        }
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleModelDrawer &&
                <MaterialValueDrawer modelOpenDrawer={visibleModelDrawer}
                                     modelCloseDrawer={() => {
                                 setVisibleModelDrawer(!visibleModelDrawer);
                                 loadModel();
                             }} modelValues={{} as MaterialValueModel}/>
            }
        </>
    );
});

export default MaterialValueSprSelect;