import React, {FC, useEffect, useState} from 'react';
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import {Button, Form, InputNumber, Layout, Typography} from "antd";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {Request, RequestPDF} from "../../../http/network";
import {UrlEnum} from "../../../constants/urlEnum";
import TableCustom from "../../../components/ui/table/TableCustom";
import {materialValueOrgColumns} from "../../../components/ui/table/column/MaterialValueOrgColumns";

const {Title} = Typography;

interface BarcodeProps {
    createReport: (response: any) => void;
}

interface ParamModel {
    size: number;
    device: string[];
}

const Barcode: FC<BarcodeProps> = (props) => {

    const [form] = Form.useForm();
    const {setNotification, modalWait} = useActions(AppActionCreators);

    const [deviceList, setDeviceList] = useState<MaterialValueOrgModel[]>([]);
    const [loadingStorageList, setLoadingStorageList] = useState<boolean>(false);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    const [size, setSize] = useState<number>(1);
    let params: ParamModel;

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
        if (deviceList === undefined || deviceList.length === 0) {
            setNotification({
                type: "error",
                message: "Ошибка",
                description: "Укажите материальную ценность"
            })
            return;
        }
        modalWait({visible: true, message: "Формирование отчета..."})
        form.validateFields()
            .then(() => {
                modalWait({visible: true, message: "Формирование отчета..."})
                let idList: string[] = [];
                for (let i = 0; i < selectRecord.length; i++) {
                    idList = idList.concat(selectRecord[i].id)
                }
                params = {...params, device: idList};
                params = {...params, size: size};

                RequestPDF({
                    url: UrlEnum.ReportGenerateBarcode,
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
                <Title level={2} style={{margin: "0px"}}>Генерация штихкодов</Title>
            </div>
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item
                    label="Размер штрихкода"
                    name={'size'}
                    initialValue={size}
                    rules={[
                        {
                            required: true,
                            message: 'Укажите размер штрихкода'
                        }
                    ]}
                >
                    <InputNumber style={{minWidth: "100%"}} min={1} value={size}
                                 onChange={(value) => setSize(Number(value))}
                    />
                </Form.Item>
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

export default Barcode;