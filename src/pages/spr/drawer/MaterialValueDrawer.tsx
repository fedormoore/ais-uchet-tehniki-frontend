import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Drawer, Form, Input, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import FirmSelect from "../../../components/ui/select/FirmSelect";
import MaterialValueTypeSelect from "../../../components/ui/select/MaterialValueTypeSelect";

import {MaterialValueModel} from "../../../models/spr/MaterialValueModel";
import {
    MaterialValueActionCreators,
    materialValueResult
} from "../../../reducers/spr/materialValue/materialValueActionCreators";
import CardView from "../../materialValueOrg/action/CardView";

interface ModelDrawerProps {
    modelOpenDrawer: boolean;
    modelCloseDrawer: () => void;
    modelValues: MaterialValueModel;
}

const MaterialValueDrawer: FC<ModelDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {saveMaterialValue, loadMaterialValue} = useActions(MaterialValueActionCreators);

    const [values, setValues] = useState<MaterialValueModel[]>([props.modelValues]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0nameInOrg': values[0].nameInOrg,
                '0nameFirm': values[0].nameFirm,
                '0nameModel': values[0].nameModel
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: materialValueResult = await saveMaterialValue(values) as materialValueResult;
                    if (result.isOk) {
                        loadMaterialValue();
                        props.modelCloseDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        let newArr = [...values];
        newArr = newArr.concat({} as MaterialValueModel);
        setValues(newArr);
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            let newArr = [...values];
            newArr[index] = {...newArr[index], [name]: value};
            setValues(newArr);
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()
            let newArr = [...values];
            newArr.splice(index, 1);
            setValues(newArr);
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'deviceType']: newArr[i].materialValueType?.id,
                        [i + 'nameInOrg']: newArr[i].nameInOrg,
                        [i + 'nameFirm']: newArr[i].nameFirm,
                        [i + 'nameModel']: newArr[i].nameModel
                    }
                );
            }
        }

        return (
            <CardView typeModel={"MaterialValueModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <MaterialValueTypeSelect load={loadSelect} buttonAdd={true}
                                                               name={index + 'materialValueType'}
                                                               rulesOn={true}
                                                               onChange={(value) => changeField(index, "materialValueType", value)}/>
                                  </Col>
                                  <Col span={24}>
                                      <Form.Item
                                          label="Наименование в организации"
                                          name={index + 'nameInOrg'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "nameInOrg", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                      <FirmSelect load={loadSelect} name={index + 'nameFirm'} rulesOn={false}
                                                  onChange={e => changeField(index, "nameFirm", e)}/>
                                  </Col>
                                  <Col span={24}>
                                      <Form.Item
                                          label="Наименование модели"
                                          name={index + 'nameModel'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "nameModel", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                          </>}
            />
        )
    }

    return (
        <Drawer
            title={values[0].id !== undefined ? 'Редактировать запись' : 'Добавить запись'}
            width={'500px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.modelOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.modelCloseDrawer}>Отмена</Button>
                    {values[0].id === undefined &&
                        <Button onClick={() => onClickAddField()}>Добавить</Button>
                    }
                    <Button type="primary" onClick={() => onClickSaveRecord()}>
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
        </Drawer>
    );
};

export default MaterialValueDrawer;