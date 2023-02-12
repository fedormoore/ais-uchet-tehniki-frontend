import React, {FC, useEffect, useState} from 'react';
import {Button, Modal, Typography} from "antd";
import {MaterialValueOrgModel} from "../models/MaterialValueOrgModel";
import {useActions} from "../hooks/useActions";
import {AppActionCreators} from "../reducers/app/appActionCreators";
import {getDeviceName} from "../components/storage";
import {useScanner} from "../http/webSocket";

const {Text} = Typography;

interface ScannerModalProps {
    scannerOpenModal: boolean;
    scannerCloseModal: () => void;
    scannerResponse: (valueResponse: MaterialValueOrgModel) => void;
}

const Scanner: FC<ScannerModalProps> = (props) => {

    const {setNotification, modalWait, setWebSocketCon} = useActions(AppActionCreators);
    const [responseServer, setResponseServer] = useState<MaterialValueOrgModel>({} as MaterialValueOrgModel)
    const {connect, disconnect, responseRet} = useScanner({modalWait, setNotification, setWebSocketCon});

    useEffect(() => {
        connect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (responseRet !== '') {
            setResponseServer(responseRet)
            props.scannerResponse(responseRet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseRet])

    // const scannerResponse = (valueResponse: MaterialValueOrgModel) => {
    //     setResponseServer(valueResponse)
    //     props.scannerResponse(valueResponse);
    // }

    return (
        <Modal title="Материальная ценность" open={props.scannerOpenModal} centered
               footer={[
                   <Button key="ok" onClick={() => {
                       props.scannerCloseModal();
                       disconnect();
                       setResponseServer({} as MaterialValueOrgModel);
                   }}>
                       Закрыть
                   </Button>,
               ]}
        >
            <p>{getDeviceName(responseServer.materialValue)}</p>
            <Text disabled>Откройте сайт на мобильном устройсте. Войдите под своей учетной записью. Запустите сканер и отсканируйте штрихкод.</Text>
        </Modal>
    );
};

export default Scanner;