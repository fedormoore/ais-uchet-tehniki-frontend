import React, {FC, useEffect, useState} from 'react';
import {Button, Layout, Typography} from "antd";
import {RequestPDF} from "../../../http/network";
import {UrlEnum} from "../../../constants/urlEnum";
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import TableCustom from "../../../components/ui/table/TableCustom";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {ReasonActionCreators} from "../../../reducers/reason/reasonActionCreators";
import {ReasonModel} from "../../../models/ReasonModel";
import {reasonColumns} from "../../../components/ui/table/column/ReasonColumns";

const {Title} = Typography;

interface ContractProps {
    createReport: (response: any) => void;
}

interface ParamModel {
    idContract: string[];
}

const Contract: FC<ContractProps> = (props) => {

    const {contractLoadFromServer} = useActions(ReasonActionCreators);
    const {contractList} = useTypedSelector(state => state.reason)
    const [selectRecord, setSelectRecord] = useState<ReasonModel[]>([]);
    let params: ParamModel;

    const {modalWait} = useActions(AppActionCreators);

    useEffect(() => {
        if (contractList.length === 0) {
            contractLoadFromServer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateReport = () => {
        modalWait({visible: true, message: "Формирование отчета..."})

        let idList: string[] = [];
        for (let i = 0; i < selectRecord.length; i++) {
            idList = idList.concat(selectRecord[i].id)
        }
        params = {...params, idContract: idList};

        RequestPDF({
            url: UrlEnum.ReportContract,
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
                <Title level={2} style={{margin: "0px"}}>Контракты</Title>
            </div>
            <Button type="primary" onClick={() => generateReport()}>Сформировать</Button>
            <TableCustom multiSelect={true} dataSource={contractList} expandable={true}
                         columns={reasonColumns({interfaceType: 'contract'})}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                         }}
            />
        </Layout>
    );
};

export default Contract;