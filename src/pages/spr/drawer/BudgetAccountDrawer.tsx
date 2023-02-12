import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Drawer, Form, Input, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import {BudgetAccountModel} from "../../../models/spr/BudgetAccountModel";
import {
    BudgetAccountActionCreators,
    budgetAccountResult
} from "../../../reducers/spr/budgetAccount/budgetAccountActionCreators";
import CardView from "../../materialValueOrg/action/CardView";

interface BudgetAccountDrawerProps {
    budgetAccountOpenDrawer: boolean;
    budgetAccountCloseDrawer: () => void;
    budgetAccountValues: BudgetAccountModel;
}

const BudgetAccountDrawer: FC<BudgetAccountDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {saveBudgetAccount, loadBudgetAccount} = useActions(BudgetAccountActionCreators);

    const [values, setValues] = useState<BudgetAccountModel[]>([props.budgetAccountValues]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0name': values[0].name,
                '0code': values[0].code
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: budgetAccountResult = await saveBudgetAccount(values) as budgetAccountResult;
                    if (result.isOk) {
                        loadBudgetAccount();
                        props.budgetAccountCloseDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        let newArr = [...values];
        newArr = newArr.concat({} as BudgetAccountModel);
        setValues(newArr);
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: string) => {
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
                        [i + 'name']: newArr[i].name,
                        [i + 'code']: newArr[i].code
                    }
                );
            }
        }

        return (
            <CardView typeModel={"BudgetAccountModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={8}>
                                      <Form.Item
                                          label="Код"
                                          name={index + 'code'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите код'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "code", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
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
            open={props.budgetAccountOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.budgetAccountCloseDrawer}>Отмена</Button>
                    {values[0].id === undefined &&
                        <Button onClick={() => onClickAddField()}>Добавить</Button>}
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

export default BudgetAccountDrawer;