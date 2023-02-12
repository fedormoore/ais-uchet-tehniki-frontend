import React, {FC, useEffect, useState} from 'react';
import {Button, Drawer, Layout, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {Request} from "../../../http/network";
import {reasonSpecColumns} from "../../../components/ui/table/column/ReasonSpecColumns";
import TableCustom from "../../../components/ui/table/TableCustom";
import {MaterialValueOrgHistoryModel} from "../../../models/MaterialValueOrgHistoryModel";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import {UrlEnum} from "../../../constants/urlEnum";

export type InterfaceType = 'contract' | 'statement';

interface ContractSpecDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    saveRecord: (value: MaterialValueOrgHistoryModel[]) => void;
    selectRecords: MaterialValueOrgHistoryModel[];
    excludeRecordsByReasonId: string;
    interfaceType: InterfaceType;
}

const ReasonSpecDrawer: FC<ContractSpecDrawerProps> = (props) => {

    const {setNotification} = useActions(AppActionCreators);

    const [registryListFromServer, setRegistryListFromServer] = useState<MaterialValueOrgHistoryModel[]>([]);
    const [sprContractTypeLoading, setSprContractTypeLoading] = useState<boolean>(true);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgHistoryModel[]>([]);

    useEffect(() => {
        Request({
            url: props.interfaceType === 'contract' ?
                props.excludeRecordsByReasonId !== undefined ? UrlEnum.ReasonSpecContractByReasonId + props.excludeRecordsByReasonId : UrlEnum.ReasonSpecContract
                :
                props.excludeRecordsByReasonId !== undefined ? UrlEnum.ReasonSpecStatementByReasonId + props.excludeRecordsByReasonId : UrlEnum.ReasonSpecStatement,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    let tempArr: MaterialValueOrgHistoryModel[] = response.data;
                    if (props.selectRecords !== undefined) {
                        setRegistryListFromServer(tempArr.filter((item1) =>
                            !props.selectRecords.map((item2) => item2.id).includes(item1.id)));
                    } else {
                        setRegistryListFromServer(tempArr);
                    }

                    setSprContractTypeLoading(false);
                } else {

                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        if (selectRecord.length === 0) {
            setNotification({
                type: "error",
                message: "Ошибка",
                description: "Выберите материальную ценность"
            })
        } else {
            props.saveRecord(selectRecord);
            props.closeDrawer();
        }
    }

    return (
        <Drawer
            title={'Добавить запись'}
            width={'80%'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.openDrawer}
            extra={
                <Space>
                    <Button onClick={props.closeDrawer}>Отмена</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Layout className={"parentTable"} style={{maxHeight: "100%"}}>
                <TableCustom multiSelect={true} dataSource={registryListFromServer}
                             columns={reasonSpecColumns({interfaceType: props.interfaceType})}
                             spinningLoading={sprContractTypeLoading} selectChildren={false}
                             selectRecordIn={selectRecord}
                             returnSelectRecords={(selectRecordIn) => {
                                 setSelectRecord(selectRecordIn);
                             }}
                />
            </Layout>
        </Drawer>
    );
};

export default ReasonSpecDrawer;