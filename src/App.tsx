import React, {FC, Suspense, useEffect} from 'react';
import {Layout, Modal, notification, Row, Spin, Typography} from 'antd';
import './App.css';

import HeaderMenu from "./components/ui/HeaderMenu";
import LeftMenu from "./components/ui/LeftMenu";
import AppRouter from "./components/AppRouter";
import {useTypedSelector} from "./hooks/useTypedSelector";
import {useActions} from "./hooks/useActions";
import {AppActionCreators} from "./reducers/app/appActionCreators";
import {AuthActionCreators} from "./reducers/auth/authActionCreators";
import {inDispatch} from "./http/network";

const {Content} = Layout;

const {Text} = Typography;

const App: FC = () => {

    const {resetNotification} = useActions(AppActionCreators);
    const {appNotification, appModalWait} = useTypedSelector(state => state.app)
    const {logoutAction} = useActions(AuthActionCreators);

    useEffect(() => {
        if (appNotification) {
            notification[appNotification.type]({
                message: appNotification.message,
                description: appNotification.description,
                onClose: resetNotification
            });
        }
        inDispatch(logoutAction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appNotification])

    return (
        <Layout>
            {appModalWait?.visible &&
                <Modal transitionName="" centered={true} closable={false} footer={null} open={appModalWait.visible}
                       style={{maxWidth: "300px"}}><Spin/><Text>{"     " + appModalWait.message}</Text></Modal>}
            <HeaderMenu/>
            <Layout>
                <LeftMenu/>
                <Suspense
                    fallback={<Row style={{height: "calc(100vh-64px)", width: "100vw"}} align="middle" justify="center"><Spin
                        size="large" tip="Загрузка..."/></Row>}>
                    <Content className="contentH100">
                        <AppRouter/>
                    </Content>
                </Suspense>
            </Layout>
        </Layout>
    );
}

export default App;
