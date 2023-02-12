import React, {FC, useEffect, useState} from 'react';
import {Request, RequestPDF} from "../../../http/network";
import {Button, Form, Layout, Typography} from "antd";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import TableCustom from "../../../components/ui/table/TableCustom";
import {materialValueOrgColumns} from "../../../components/ui/table/column/MaterialValueOrgColumns";
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import {UrlEnum} from "../../../constants/urlEnum";

const {Title} = Typography;

interface HistoryProps {
    createReport: (response: any) => void;
}

interface ParamModel {
    device: string[];
}

const History: FC<HistoryProps> = (props) => {

    const [form] = Form.useForm();

    let params: ParamModel;
    const {setNotification, modalWait} = useActions(AppActionCreators);

    const [deviceList, setDeviceList] = useState<MaterialValueOrgModel[]>([]);
    const [loadingStorageList, setLoadingStorageList] = useState<boolean>(false);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        setLoadingStorageList(true)
        Request({
            url: UrlEnum.SprAllMaterialValueOrgNotExpandable,
            // props.typeUrl === 'getAllMaterialValueOrgParentIsNull' ? UrlEnum.SprAllMaterialValueOrgParentIsNull :
            //     props.typeUrl === 'getAllMaterialValueOrgNameInOrgIsNull' ? UrlEnum.SprAllMaterialValueOrgNameInOrgIsNotNull : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    setDeviceList(response.data);
                    setLoadingStorageList(false);
                } else {

                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateReport = () => {
        if (deviceList.length === 0) {
            setNotification({
                type: "error",
                message: "Ошибка",
                description: "Укажите материальную ценность"
            })
            return;
        }
        form.validateFields()
            .then(() => {
                modalWait({visible: true, message: "Формирование отчета..."})
                let idList: string[] = [];
                for (let i = 0; i < selectRecord.length; i++) {
                    idList = idList.concat(selectRecord[i].id)
                }
                params = {...params, device: idList};

                RequestPDF({
                    url: UrlEnum.ReportHistory,
                    method: "GET",
                    params: params
                })
                    .then((response: any) => {
                        if (response.isOk) {
                            props.createReport(response.data)
                        } else {

                        }
                    });
            })
    }

    return (
        <>
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
                <Title level={2} style={{margin: "0px"}}>История</Title>
            </div>
            <Form form={form} layout="vertical" preserve={false}>
                <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                    <TableCustom multiSelect={true}
                                 dataSource={deviceList}
                                 columns={materialValueOrgColumns({interfaceType: 'any'})}
                                 spinningLoading={loadingStorageList}
                                 selectRecordIn={selectRecord}
                                 returnSelectRecords={(selectRecordIn) => {
                                     setSelectRecord(selectRecordIn)
                                 }}
                    />
                </Layout>
                <Button onClick={() => generateReport()}>Сформировать</Button>
            </Form>
        </>
    );
};

export default History;