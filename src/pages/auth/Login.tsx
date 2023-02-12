import React, {FC, useState} from 'react';
import {Alert, Button, Form, Input, Modal, Row, Space} from "antd";

import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";
import {SignInModel} from "../../models/auth/SignInModel";
import {AuthActionCreators, resultSignUp} from "../../reducers/auth/authActionCreators";

interface LoginModalProps {
    loginOpenModal: boolean;
    loginCloseModal: () => void;
}

const Login: FC<LoginModalProps> = (props) => {

    const [form] = Form.useForm();

    const {isLoading, error} = useTypedSelector(state => state.auth);
    const {signInAction} = useActions(AuthActionCreators);

    const [values, setValues] = useState<SignInModel>({email: "", password: ""});

    const signIn = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: resultSignUp = await signInAction(values) as resultSignUp;
                    if (result.isOk) {
                        props.loginCloseModal();
                    }
                })();
            })
    };

    return (
        <Modal title="Вход" open={props.loginOpenModal} closable={false} footer={null} style={{maxWidth: '300px'}}>
            <Row justify="center" align="middle">
                <Form form={form} layout="vertical">
                    {error &&
                        <Alert message={error} type="error"/>
                    }
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
                            value={'email'}
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
                        <Button type="primary" onClick={() => signIn()} style={{width: '100%'}}
                                loading={isLoading}>Вход</Button>
                        <Button onClick={() => props.loginCloseModal()} style={{width: '100%'}}>
                            Отмена
                        </Button>
                    </Space>
                </Form>
            </Row>
        </Modal>
    );
};

export default Login;