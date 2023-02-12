import React, {FC, useEffect, useState} from 'react';

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

import {LocationModel} from "../../models/spr/LocationModel";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {Layout} from "antd";
import LocationDrawer from "./drawer/LocationDrawer";
import {LocationActionCreators, locationResult} from "../../reducers/spr/location/locationActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {locationColumns} from "../../components/ui/table/column/LocationColumns";
import {filterLocation} from "../../components/ui/table/filter/paramFilter/LocationFilter";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataLocation = {} as LocationModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const Location: FC = () => {

    const {loadLocation, deleteLocation} = useActions(LocationActionCreators);
    const {locationList} = useTypedSelector(state => state.location)

    const [visibleLocationDrawer, setVisibleLocationDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)

    const [selectRecord, setSelectRecord] = useState<LocationModel[]>([]);

    useEffect(() => {
        if (locationList.length === 0) {
            loadLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onFilter(filterListServer: URLSearchParams, filterListIn: FilterTagModel[]) {
        filter = filterListServer;
        filterList = filterListIn;
        applyFilterChangePage();
    }

    function applyFilterChangePage() {
        loadLocation(filter);
    }

    return (
        <Layout>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataLocation = {} as LocationModel;
                        setVisibleLocationDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleLocationDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: locationResult = await deleteLocation(selectRecord) as locationResult;
                            if (result.isOk) {
                                loadLocation();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataLocation = {} as LocationModel;
                        loadLocation(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={locationList} expandable={true} columns={locationColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnDoubleClick={() => {
                             setVisibleLocationDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataLocation = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}})
                         }}
                         filterIn={{
                             filterColumns: filterLocation,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleLocationDrawer &&
                <LocationDrawer locationOpenDrawer={visibleLocationDrawer}
                                locationCloseDrawer={() => setVisibleLocationDrawer(!visibleLocationDrawer)}
                                locationValues={selectDataLocation}/>
            }
        </Layout>
    );
};

export default Location;