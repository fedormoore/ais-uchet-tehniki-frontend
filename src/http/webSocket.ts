import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

import {useState} from "react";
import {UrlEnum} from "../constants/urlEnum";

var stompClient: any = null

interface ConnectWSProps {
    modalWait: any;
    setNotification: any;
    setWebSocketCon: any;
}

export function useScanner(connectWSProps: ConnectWSProps) {

    const [responseRet, setResponseRet] = useState<any>('');
    const connect = () => {
        try {
            connectWSProps.modalWait({visible: true, message: 'Пожалуйста, подождите...'})
            stompClient = Stomp.client('')
            stompClient.webSocketFactory = () => {
                const socket = new SockJS(UrlEnum.Server + "/websocket");
                return socket
            }
            stompClient.debug = function (str: any) {
                if (str.match(/STOMP*/)) {
                    connectWSProps.setNotification({
                        type: 'error',
                        message: 'Ошибка',
                        description: 'Сервер не отвечает. Следующая попытка через 10 сек.'
                    })
                    connectWSProps.modalWait({visible: true, message: 'Пожалуйста, подождите...'})
                    connectWSProps.setWebSocketCon(false);
                }
                stompClient.reconnectDelay = 10000;
            }
            const auth = localStorage.getItem("accessToken");
            stompClient.connect({"Authorization": "Bearer " + auth}, onConnected, onError)
        } catch (err: any) {
            console.log(err)
            connectWSProps.modalWait({visible: false, message: ''})
        }
    };

    const disconnect = () => {
        connectWSProps.setWebSocketCon(false);
        stompClient.disconnect();
    };

    const onConnected = (err: any) => {
        console.log(err)
        connectWSProps.modalWait({visible: false, message: ''})
        connectWSProps.setWebSocketCon(true);
        const email = localStorage.getItem("email") as string;
        stompClient.subscribe("/topic/scanner/" + email, (message: any) => {
            setResponseRet(JSON.parse(message.body))
        });
    };

    const onError = (err: any) => {
        console.log(err);
    };

    return {
        connect,
        disconnect,
        responseRet
    }
}