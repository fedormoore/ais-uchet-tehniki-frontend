import React, {FC} from 'react';
import {Button, Modal, Result} from "antd";
import {useNavigate} from "react-router-dom";
import {routeNames} from "../../routes";

interface AccountActivateModalProps {
    accountActivateOpenModal: boolean;
    accountActivateCloseModal: () => void;
    result: boolean;
    return?: () => void;
}

const AccountActivate: FC<AccountActivateModalProps> = (props) => {

    const navigate = useNavigate();

    return (
        <Modal open={props.accountActivateOpenModal} closable={false} footer={null} style={{maxWidth: '300px'}}>
            {
                props.result ?
                    <Result
                        status="success"
                        title="Успешная активация учетной записи!"
                        subTitle="Теперь вы можете зайти под своим логином и паролем"
                        extra={[
                            <Button type="primary" key="console" onClick={() => {
                                navigate(routeNames.MAIN)
                                props.accountActivateCloseModal();
                                props.return!();
                            }}>
                                Вход
                            </Button>,
                            <Button key="buy" onClick={() => {
                                navigate(routeNames.MAIN)
                                props.accountActivateCloseModal()
                            }}>Отмена</Button>,
                        ]}
                    />
                    :
                    <Result
                        status="warning"
                        title="Активация учетной записи прошла с ошибкой!"
                        extra={[
                            <Button key="buy" onClick={() => {
                                navigate(routeNames.MAIN)
                                props.accountActivateCloseModal()
                            }}>Закрыть</Button>,
                        ]}
                    />
            }
        </Modal>
    );
};

export default AccountActivate;