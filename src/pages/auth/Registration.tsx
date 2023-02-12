import React, {FC, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {Alert, Button, Form, Input, Modal, Row, Space} from "antd";

import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";

import {SignUpModel} from "../../models/auth/SignUpModel";
import {AuthActionCreators, resultSignUp} from "../../reducers/auth/authActionCreators";
import {routeNames} from "../../routes";

interface RegistrationModalProps {
    registrationOpenModal: boolean;
    registrationCloseModal: () => void;
}

const Registration: FC<RegistrationModalProps> = (props) => {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const {isLoading, error} = useTypedSelector(state => state.auth);
    const {signUpAction} = useActions(AuthActionCreators);

    const [values, setValues] = useState<SignUpModel>({email: "", firstName: "", lastName: "", password: ""});

    const signUp = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: resultSignUp = await signUpAction(values) as resultSignUp;
                    if (result.isOk) {
                        signUpOk();
                        props.registrationCloseModal();
                    }
                })();
            })
    };

    function signUpOk() {
        Modal.info({
            title: 'Пользователь успешно зарегистрирован!',
            content: (
                <div>
                    <p>Перейти по ссылке, высланной в письме для ативации учетной записи.</p>
                </div>
            ),
            onOk() {
                navigate(routeNames.MAIN)
            },
        });
    }

    return (
        <Modal title="Регистрация" open={props.registrationOpenModal} closable={false} footer={null}
               style={{maxWidth: '300px'}}>
            <Row justify="center" align="middle" style={{height: "-webkit-fill-available"}}>
                <Form form={form} layout="vertical">
                    {error &&
                        <Alert message={error} type="error"/>
                    }
                    <Form.Item
                        label="Имя"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста укажите имя'
                            }
                        ]}
                    >
                        <Input
                            value={'firstName'}
                            onChange={e => setValues({...values, firstName: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Фамилия"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста укажите фамилию'
                            }
                        ]}
                    >
                        <Input
                            value={'lastName'}
                            onChange={e => setValues({...values, lastName: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item
                        label="E-mail"
                        name="email"
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
                            value={'email: '}
                            onChange={e => setValues({...values, email: e.target.value})}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста укажите пароль'
                            }
                        ]}
                    >
                        <Input
                            value={'password: '}
                            onChange={e => setValues({...values, password: e.target.value})}
                            type={"password"}
                        />
                    </Form.Item>

                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <Button type="primary" onClick={() => signUp()} style={{width: '100%'}}
                                loading={isLoading}>
                            Регистрация
                        </Button>
                        <Button onClick={() => props.registrationCloseModal()} style={{width: '100%'}}>
                            Отмена
                        </Button>
                    </Space>
                </Form>

            </Row>
        </Modal>
    );
};

export default Registration;