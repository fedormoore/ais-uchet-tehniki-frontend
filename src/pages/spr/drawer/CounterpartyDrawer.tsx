import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Drawer, Form, Input, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import {CounterpartyModel} from "../../../models/spr/CounterpartyModel";
import {
    CounterpartyActionCreators,
    counterpartyResult
} from "../../../reducers/spr/counterparty/counterpartyActionCreators";
import CardView from "../../materialValueOrg/action/CardView";

interface CounterpartyDrawerProps {
    counterpartyOpenDrawer: boolean;
    counterpartyCloseDrawer: () => void;
    counterpartyValues: CounterpartyModel;
}

const CounterpartyDrawer: FC<CounterpartyDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {saveCounterparty, loadCounterparty} = useActions(CounterpartyActionCreators);

    const [values, setValues] = useState<CounterpartyModel[]>([props.counterpartyValues]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0name': values[0].name,
                '0inn': values[0].inn,
                '0telephone': values[0].telephone,
                '0email': values[0].email,
                '0contact': values[0].contact
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: counterpartyResult = await saveCounterparty(values) as counterpartyResult;
                    if (result.isOk) {
                        loadCounterparty();
                        props.counterpartyCloseDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        let newArr = [...values];
        newArr = newArr.concat({} as CounterpartyModel);
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
                        [i + 'inn']: newArr[i].inn,
                        [i + 'telephone']: newArr[i].telephone,
                        [i + 'email']: newArr[i].email,
                        [i + 'contact']: newArr[i].contact
                    }
                );
            }
        }

        return (
            <CardView typeModel={"CounterpartyModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={12}>
                                      <Form.Item
                                          label="???????????????????????? ??????????????????????"
                                          name={index + 'name'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: '???????????????????? ?????????????? ???????????????????????? ??????????????????????'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "name", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item
                                          label="??????"
                                          name={index + 'inn'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "inn", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={8}>
                                      <Form.Item
                                          label="??????????????"
                                          name={index + 'telephone'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "telephone", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item
                                          label="e-mail"
                                          name={index + 'email'}
                                          rules={[
                                              {
                                                  type: 'email',
                                                  message: '???????????????? E-mail',
                                              },
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "email", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item
                                          label="???????????????????? ????????"
                                          name={index + 'contact'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "contact", e.target.value)}
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
            title={values[0].id !== undefined ? '?????????????????????????? ????????????' : '???????????????? ????????????'}
            width={'500px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.counterpartyOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.counterpartyCloseDrawer}>????????????</Button>
                    {values[0].id === undefined &&
                        <Button onClick={() => onClickAddField()}>????????????????</Button>}
                    <Button type="primary" onClick={() => onClickSaveRecord()}>
                        ??????????????????
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

export default CounterpartyDrawer;