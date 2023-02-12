import React, {FC, useState} from 'react';
import {Button, Collapse, Space, Tag} from "antd";
import Scanner from "../../../pages/Scanner";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {getDeviceName} from "../../storage";

const {Panel} = Collapse;

interface SelectRecordProps {
    multiSelect: boolean;
    changeSelectRecord: (record: any) => void;
    selectRow: (record: any) => void;
    unSelect: (id: any) => void;
    selectRecordIn: MaterialValueOrgModel[];
}

const SelectRecordCollapse: FC<SelectRecordProps> = (props) => {

    const [scannerModal, setScannerModal] = useState<boolean>(false);

    const selectRecordTag = (tag: MaterialValueOrgModel) => {

        const deleteTag = (e: any, id: string) => {
            e.stopPropagation();
            props.unSelect(id);
        };

        return (
            <span key={tag.id} style={{display: 'inline-block'}}>
                <Tag color="green" closable
                     onClose={(e) => deleteTag(e, tag.id)}>{getDeviceName(tag.materialValue)}</Tag>
            </span>
        )
    }

    const scannerResponse = (valueResponse: any) => {
        if (props.multiSelect) {
            props.changeSelectRecord(valueResponse);
        } else {
            props.selectRow(valueResponse);
        }
    }

    return (
        <Collapse key={"1"}>
            <Panel style={{background: "white", borderRadius: "5px"}}
                   header={"Выбранные записи"}
                   key="2"
                   extra={
                       <Space>
                           <Button size="small" type="primary" danger onClick={(e) => {
                               e.stopPropagation();
                               setScannerModal(true)
                           }}>Сканер</Button>
                       </Space>
                   }
            >
                <div style={{maxHeight: "44px", overflow: "-moz-scrollbars-vertical", overflowY: "scroll"}}>
                    {props.selectRecordIn.map(selectRecordTag)}
                </div>
            </Panel>
            {scannerModal &&
                <Scanner scannerOpenModal={scannerModal} scannerCloseModal={() => setScannerModal(!scannerModal)}
                         scannerResponse={(valueResponse: MaterialValueOrgModel) => scannerResponse(valueResponse)}/>
            }
        </Collapse>
    );
};

export default SelectRecordCollapse;