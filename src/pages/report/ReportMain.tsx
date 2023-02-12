import React, {FC, useRef, useState} from 'react';
import {Tabs} from 'antd';
import ReportList from "./ReportList";
import {useActions} from "../../hooks/useActions";
import {AppActionCreators} from "../../reducers/app/appActionCreators";

const ReportMain: FC = () => {

    const {modalWait} = useActions(AppActionCreators);

    const [activeKey, setActiveKey] = useState('1');
    const [items, setItems] = useState([{} as any]);
    const newTabIndex = useRef(0);

    const onChange = (key: string) => {
        setActiveKey(key);
    };

    const add = (response: any, name: string) => {
        const newActiveKey = newTabIndex.current++;
        setItems([...items, {
            label: name,
            // eslint-disable-next-line jsx-a11y/iframe-has-title
            children: <iframe src={window.URL.createObjectURL(response)} className="reportTab"></iframe>,
            key: name + newActiveKey,
            closable: true
        }]);
        setActiveKey(name + newActiveKey);
        modalWait({visible: false, message: ""})
    };

    const remove = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
        const targetIndex = items.findIndex((pane: any) => pane.key === targetKey);
        const newPanes = items.filter((pane: any) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const {key} = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setItems(newPanes);
    };

    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            // add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={[{
                    label: 'Отчеты',
                    children: <ReportList createReport={(response: any, name: string) => add(response, name)}/>,
                    key: '1',
                    closable: false
                }].concat(items)}
            />
        </>
    );
};

export default ReportMain;