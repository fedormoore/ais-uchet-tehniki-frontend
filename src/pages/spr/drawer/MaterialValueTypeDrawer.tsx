import React, {FC, useEffect, useState} from 'react';

import {Button, Checkbox, Drawer, Form, Input, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import {MaterialValueTypeModel} from "../../../models/spr/MaterialValueTypeModel";
import {
    materialValueTypeResult,
    MaterialValueTypeActionCreators
} from "../../../reducers/spr/materialValueType/materialValueTypeActionCreators";
import CardView from "../../materialValueOrg/action/CardView";

interface DeviceTypeDrawerProps {
    materialValueTypeOpenDrawer: boolean;
    materialValueTypeCloseDrawer: () => void;
    materialValueTypeValues: MaterialValueTypeModel;
}

const MaterialValueTypeDrawer: FC<DeviceTypeDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {saveMaterialValueType, loadMaterialValueType} = useActions(MaterialValueTypeActionCreators);

    const [values, setValues] = useState<MaterialValueTypeModel[]>([props.materialValueTypeValues]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0name': values[0].name,
                '0addToOther': values[0].addToOther,
                '0addOther': values[0].addOther
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: materialValueTypeResult = await saveMaterialValueType(values) as materialValueTypeResult;
                    if (result.isOk) {
                        loadMaterialValueType();
                        props.materialValueTypeCloseDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        let newArr = [...values];
        newArr = newArr.concat({} as MaterialValueTypeModel);
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
                        [i + 'name']: newArr[i].name
                    }
                );
            }
        }

        return (
            <CardView typeModel={"MaterialValueTypeModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              {/*<Row gutter={24}>*/}
                              {/*    <Col span={24}>*/}
                              <Form.Item
                                  label="Наименование"
                                  name={index + 'name'}
                                  rules={[
                                      {
                                          required: true,
                                          message: 'Пожалуйста укажите наименование'
                                      }
                                  ]}
                              >
                                  <Input
                                      onChange={e => changeField(index, "name", e.target.value)}
                                  />
                              </Form.Item>
                              <Form.Item
                                  name={index + 'addToOther'}
                                  valuePropName="checked"
                              >
                                  <Checkbox onChange={e => changeField(index, "addToOther", e.target.checked)}>Возможность
                                      добавления в состав других МЦ</Checkbox>
                              </Form.Item>
                              <Form.Item
                                  name={index + 'addOther'}
                                  valuePropName="checked"
                              >
                                  <Checkbox onChange={e => changeField(index, "addOther", e.target.checked)}>Возможность
                                      добавления в себя других МЦ</Checkbox>
                              </Form.Item>
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
            open={props.materialValueTypeOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.materialValueTypeCloseDrawer}>Отмена</Button>
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

export default MaterialValueTypeDrawer;