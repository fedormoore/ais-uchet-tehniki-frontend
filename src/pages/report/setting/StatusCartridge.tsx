import React, {FC, useState} from 'react';
import {Button, Layout, Typography} from "antd";
import {RequestPDF} from "../../../http/network";
import {UrlEnum} from "../../../constants/urlEnum";
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import TableCustom from "../../../components/ui/table/TableCustom";

const {Title} = Typography;

interface StatusCartridgeProps {
    createReport: (response: any) => void;
}

interface ParamModel {
    status: string[];
}

interface DataModel {
    name: string;
}

const columns = [
    {
        title: 'Статус',
        dataIndex: ['name'],
        key: 'name',
        width: '170px',
    }
];

const dataSource = [
    {
        id: '1',
        name: 'Новый',
    },
    {
        id: '2',
        name: 'Пустой',
    },
    {
        id: '3',
        name: 'Запрпавлен',
    },
    {
        id: '4',
        name: 'Установлен в принтер',
    },
];

const StatusCartridge: FC<StatusCartridgeProps> = (props) => {

    const [selectRecord, setSelectRecord] = useState<DataModel[]>([]);
    let params: ParamModel;

    const {modalWait} = useActions(AppActionCreators);

    const generateReport = () => {
        modalWait({visible: true, message: "Формирование отчета..."})

        let idList: string[] = [];
        for (let i = 0; i < selectRecord.length; i++) {
            idList = idList.concat(selectRecord[i].name)
        }
        params = {...params, status: idList};

        RequestPDF({
            url: UrlEnum.ReportStatusCartridge,
            method: "GET",
            params: params
        })
            .then((response: any) => {
                if (response.isOk) {
                    props.createReport(response.data);
                } else {

                }
            });
    }

    return (
        <Layout>
            <div style={{
                background: "white",
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Title level={2} style={{margin: "0px"}}>Состояние картриджей</Title>
            </div>
            <Button type="primary" onClick={() => generateReport()}>Сформировать</Button>
            <TableCustom multiSelect={true} dataSource={dataSource} expandable={true} columns={columns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                         }}
            />
        </Layout>
    );
};

export default StatusCartridge;