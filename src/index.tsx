import React from 'react';
import ReactDOM from 'react-dom/client';

import {ConfigProvider} from 'antd';
import ru_RU from 'antd/es/locale/ru_RU';

import {Provider} from "react-redux";
import {BrowserRouter as BrowserRouter} from 'react-router-dom';
import {store} from "./store";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <ConfigProvider locale={ru_RU}>
                <App/>
            </ConfigProvider>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);
