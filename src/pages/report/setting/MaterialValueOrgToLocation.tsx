import React, {FC, useEffect, useState} from 'react';
import {Button, Layout, Typography} from "antd";
import {RequestPDF} from "../../../http/network";
import {UrlEnum} from "../../../constants/urlEnum";
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import TableCustom from "../../../components/ui/table/TableCustom";
import {locationColumns} from "../../../components/ui/table/column/LocationColumns";
import {LocationActionCreators} from "../../../reducers/spr/location/locationActionCreators";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {LocationModel} from "../../../models/spr/LocationModel";

const {Title} = Typography;

interface MaterialValueOrgToLocationProps {
    createReport: (response: any) => void;
}

interface ParamModel {
    idLocation: string[];
}

const MaterialValueOrgToLocation: FC<MaterialValueOrgToLocationProps> = (props) => {

    const {loadLocation} = useActions(LocationActionCreators);
    const {locationList} = useTypedSelector(state => state.location)
    const [selectRecord, setSelectRecord] = useState<LocationModel[]>([]);
    let params: ParamModel;

    const {modalWait} = useActions(AppActionCreators);

    useEffect(() => {
        if (locationList.length === 0) {
            loadLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateReport = () => {
        modalWait({visible: true, message: "Формирование отчета..."})

        let idList: string[] = [];
        for (let i = 0; i < selectRecord.length; i++) {
            idList = idList.concat(selectRecord[i].id)
        }
        params = {...params, idLocation: idList};

        RequestPDF({
            url: UrlEnum.ReportMaterialValueOrgToLocation,
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
                <Title level={2} style={{margin: "0px"}}>Материальные ценности по кабинетам</Title>
            </div>
            <Button type="primary" onClick={() => generateReport()}>Сформировать</Button>
            <TableCustom multiSelect={true} dataSource={locationList} expandable={true} columns={locationColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                         }}
            />
        </Layout>
    );
};

export default MaterialValueOrgToLocation;