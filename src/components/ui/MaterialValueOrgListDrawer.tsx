import React, {FC, useEffect, useState} from 'react';

import {Button, Drawer, Layout, Space} from "antd";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";
import TableCustom from "./table/TableCustom";
import {materialValueOrgColumns} from "./table/column/MaterialValueOrgColumns";
import {Request} from "../../http/network";
import {UrlEnum} from "../../constants/urlEnum";

export type UrlType =
    'getAllMaterialValueOrgNotExpandable'
    | 'getAllMaterialValueOrgParentIsNull'
    | 'getAllMaterialValueOrgChildrenIsNull'
    | 'getAllMaterialValueOrgNameInOrgIsNull'
    | 'getAllMaterialValueOrgByAddToOtherTrueAndParentIsNull'
    | 'allPrinterInCabinet'
    | 'allCartridgeFull'
    | 'allCartridgeNeedRefilling'
    | 'allAllMaterialValueOrgDisposeOf'
    | 'getAllMaterialValueOrgByAddOtherTrue'
    | 'allDeviceStorage';

interface MaterialValueOrgListListDrawerProps {
    selectRecords?: MaterialValueOrgModel[];
    openDrawer: boolean;
    closeDrawer: () => void;
    saveRecord: (value: MaterialValueOrgModel[]) => void;
    typeUrl: UrlType;
    multiSelect: boolean;
    selectChildren?: boolean;
    selectParent?: boolean;
}

const MaterialValueOrgListListDrawer: FC<MaterialValueOrgListListDrawerProps> = (props) => {

    const [storageList, setStorageList] = useState<MaterialValueOrgModel[]>([]);
    const [loadingStorageList, setLoadingStorageList] = useState<boolean>(false);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        setLoadingStorageList(true)
        Request({
            url: props.typeUrl === 'getAllMaterialValueOrgNotExpandable' ? UrlEnum.SprAllMaterialValueOrgNotExpandable :
                props.typeUrl === 'getAllMaterialValueOrgParentIsNull' ? UrlEnum.SprAllMaterialValueOrgParentIsNull :
                    props.typeUrl === 'getAllMaterialValueOrgNameInOrgIsNull' ? UrlEnum.SprAllMaterialValueOrgNameInOrgIsNotNull :
                        props.typeUrl === 'getAllMaterialValueOrgByAddToOtherTrueAndParentIsNull' ? UrlEnum.SprAllMaterialValueOrgByAddToOtherTrueAndParentIsNull :
                            props.typeUrl === 'getAllMaterialValueOrgChildrenIsNull' ? UrlEnum.getAllMaterialValueOrgChildrenIsNull :
                                props.typeUrl === 'getAllMaterialValueOrgByAddOtherTrue' ? UrlEnum.SprAllMaterialValueOrgByAddOtherTrue :
                                    props.typeUrl === 'allPrinterInCabinet' ? UrlEnum.SprAllPrinterInCabinet :
                                        props.typeUrl === 'allCartridgeFull' ? UrlEnum.SprAllCartridgeFull :
                                            props.typeUrl === 'allDeviceStorage' ? UrlEnum.SprAllMaterialValueOrgParentIsNull :
                                                props.typeUrl === 'allCartridgeNeedRefilling' ? UrlEnum.SprAllCartridgeNeedRefilling :
                                                    props.typeUrl === 'allAllMaterialValueOrgDisposeOf' ? UrlEnum.MaterialValueOrgDisposeOf : "",
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    let tempArr: MaterialValueOrgModel[] = response.data;
                    if (props.selectRecords !== undefined && props.selectRecords!.length > 0) {
                        const x = (inData: MaterialValueOrgModel[]) => {

                            const x1 = (inData: MaterialValueOrgModel[]) => {
                                let tmp = inData.filter((item1) =>
                                    !props.selectRecords?.map((item2) => item2.id).includes(item1.id));
                                return tmp
                            }

                            for (let i = 0; i < inData.length; i++) {
                                if (inData[i].children !== undefined) {
                                    inData[i].children = x(inData[i].children)
                                }
                            }
                            inData = x1(inData)
                            return inData;
                        }
                        setStorageList(x(tempArr))
                        // setStorageList(tempArr.filter((item1) =>
                        //     !props.selectRecords?.map((item2) => item2.id).includes(item1.id)));
                    } else {
                        setStorageList(tempArr);
                    }
                    setLoadingStorageList(false);
                } else {

                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        props.saveRecord(selectRecord);
        props.closeDrawer();
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
                <TableCustom multiSelect={props.multiSelect} dataSource={storageList} selectRecordView={true}
                             columns={materialValueOrgColumns({interfaceType: 'storage'})}
                             spinningLoading={loadingStorageList} selectChildren={props.selectChildren!}
                             selectParent={props.selectParent!}
                             selectRecordIn={selectRecord}
                             returnSelectRecords={(selectRecord) => {
                                 setSelectRecord(selectRecord);
                             }}
                             expandable={!(props.typeUrl === 'getAllMaterialValueOrgNotExpandable')}
                />
            </Layout>
        </Drawer>
    );
};

export default MaterialValueOrgListListDrawer;