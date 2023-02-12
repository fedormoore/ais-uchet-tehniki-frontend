import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Drawer, Form, Input, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import OrganizationTreeSelect from "../../../components/ui/treeSelect/OrganizationTreeSelect";

import {UserModel} from "../../../models/spr/UserModel";
import {UserActionCreators, userResult} from "../../../reducers/spr/user/userActionCreators";
import CardView from "../../materialValueOrg/action/CardView";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";

interface UserDrawerProps {
    userOpenDrawer: boolean;
    userCloseDrawer: () => void;
    userValues: UserModel;
}

const UserDrawer: FC<UserDrawerProps> = (props) => {

    const [form] = Form.useForm();
    const {setNotification} = useActions(AppActionCreators);
    const {saveUser, loadUser} = useActions(UserActionCreators);

    const [values, setValues] = useState<UserModel[]>([props.userValues]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0lastName': values[0].lastName,
                '0firstName': values[0].firstName,
                '0middleNames': values[0].middleNames,
                '0email': values[0].email,
                '0telephone': values[0].telephone,
                '0organizationFunction': values[0].organizationFunction,
                '0organization': values[0].organization?.id,
                '0location': values[0].location?.id
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: userResult = await saveUser(values) as userResult;
                    if (result.isOk) {
                        loadUser();
                        props.userCloseDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        let newArr = [...values];
        newArr = newArr.concat({} as UserModel);
        setValues(newArr);
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            if (name === 'location' && value !== null && value.type !== 'Кабинет') {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Необходимо выбрать кабинет"
                })
                form.resetFields([index + name]);
            }
            if (name === 'organization' && value !== null && value.type !== 'Структура (управление, отдел)') {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Необходимо выбрать структуру"
                })
                form.resetFields([index + name]);
            }
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
                        [i + 'lastName']: newArr[i].lastName,
                        [i + 'firstName']: newArr[i].firstName,
                        [i + 'middleNames']: newArr[i].middleNames,
                        [i + 'email']: newArr[i].email,
                        [i + 'telephone']: newArr[i].telephone,
                        [i + 'organizationFunction']: newArr[i].organizationFunction,
                        [i + 'organization']: newArr[i].organization !== undefined && newArr[i].organization!.id,
                        [i + 'location']: newArr[i].location !== undefined && newArr[i].location!.id
                    }
                );
            }
        }

        return (
            <CardView typeModel={"UserModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={12}>
                                      <Form.Item
                                          label="E-mail"
                                          name={index + 'email'}
                                          rules={[
                                              {
                                                  type: 'email',
                                                  message: 'Неверный E-mail',
                                              },
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите E-mail'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "email", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item
                                          label="Телефон"
                                          name={index + 'telephone'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "telephone", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={8}>
                                      <Form.Item
                                          label="Фамилия"
                                          name={index + 'lastName'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите фамилию'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "lastName", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item
                                          label="Имя"
                                          name={index + 'firstName'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите имя'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "firstName", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item
                                          label="Отчество"
                                          name={index + 'middleNames'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "middleNames", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <Form.Item
                                          label="Должность"
                                          name={index + 'organizationFunction'}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "organizationFunction", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <OrganizationTreeSelect load={loadSelect} buttonAdd={true}
                                                              name={index + 'organization'}
                                                              rulesOn={false} organizationType={'structure'}
                                                              onChange={(value) => changeField(index, "organization", value)}/>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <LocationTreeSelect load={loadSelect} buttonAdd={true} name={index + 'location'}
                                                          rulesOn={false} locationType={'cabinet'}
                                                          onChange={(label) => changeField(index, "location", label)}/>
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
            open={props.userOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.userCloseDrawer}>Отмена</Button>
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

export default UserDrawer;