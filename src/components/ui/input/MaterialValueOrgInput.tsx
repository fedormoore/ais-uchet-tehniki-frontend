import React, {FC, useState} from 'react';
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import MaterialValueOrgListListDrawer, {UrlType} from "../MaterialValueOrgListDrawer";
import {Button, Form, Input, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const {Text} = Typography;

interface MaterialValueOrgInputProps {
    name: string;
    label: string;
    rulesOn: boolean;
    onChange: (value: MaterialValueOrgModel) => void;
    typeUrl: UrlType;
    excludeData: MaterialValueOrgModel[]
    selectChildren?: boolean;
    selectParent?: boolean;
}

const MaterialValueOrgInput: FC<MaterialValueOrgInputProps> = (props) => {

    const [visibleSprMaterialValueOrg, setVisibleSprMaterialValueOrg] = useState<boolean>(false);

    return (
        <>
            <Form.Item label={props.rulesOn ? <><Text type="danger">*</Text>&nbsp;<Text>{props.label}</Text></> :
                <Text>{props.label}</Text>}>
                <Input.Group compact style={{display: "flex"}}>
                    <Form.Item
                        noStyle
                        name={props.name}
                        rules={[
                            {
                                required: props.rulesOn,
                                message: `Укажите ${props.label}`
                            }
                        ]}
                    >
                        <Input readOnly={true}/>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type="primary" icon={<SearchOutlined/>}
                                onClick={() => setVisibleSprMaterialValueOrg(true)}
                        ></Button>
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            {visibleSprMaterialValueOrg &&
                <MaterialValueOrgListListDrawer
                    openDrawer={visibleSprMaterialValueOrg} selectRecords={props.excludeData}
                    selectChildren={props.selectChildren!} selectParent={props.selectParent!}
                    closeDrawer={() => setVisibleSprMaterialValueOrg(!visibleSprMaterialValueOrg)}
                    saveRecord={(value) => {
                        props.onChange(value[0])
                    }}
                    typeUrl={props.typeUrl} multiSelect={false}/>
            }
        </>
    );
};

export default MaterialValueOrgInput;