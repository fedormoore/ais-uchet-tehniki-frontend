import React, {FC, useEffect, useState} from 'react';
import {Button, Collapse, Drawer, Form, Layout, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {RefillingCartridgeModel} from "../../../models/materialValueOrg/RefillingCartridgeModel";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {getDeviceName} from "../../../components/storage";
import CardView from "./CardView";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";
import TableCustom from "../../../components/ui/table/TableCustom";
import {materialValueOrgColumns} from "../../../components/ui/table/column/MaterialValueOrgColumns";
import MaterialValueOrgListListDrawer from "../../../components/ui/MaterialValueOrgListDrawer";

const {Panel} = Collapse;

interface RefillingCartridgeDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    cartridge: MaterialValueOrgModel[];
    resetSelect: () => void;
}

let indexSpecificationGlobal: number;

const RefillingCartridgeDrawer: FC<RefillingCartridgeDrawerProps> = (props) => {

    const [form] = Form.useForm();

    // const {setNotification} = useActions(AppActionCreators);
    const {saveRefillingCartridge, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<RefillingCartridgeModel[]>([{} as RefillingCartridgeModel]);

    const [button, setButton] = useState<buttonInterface[]>([initButton])
    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([{} as MaterialValueOrgModel]);
    const [excludeData, setExcludeData] = useState<MaterialValueOrgModel[]>([]);
    const [viewRefillingCartridgeCartridgeListDrawer, setViewRefillingCartridgeCartridgeListDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (props.cartridge.length > 0) {
            let newArrValue: RefillingCartridgeModel[] = [];
            for (let i = 0; i < props.cartridge.length; i++) {
                newArrValue = newArrValue.concat({cartridge: props.cartridge} as RefillingCartridgeModel)
                form.setFieldsValue(
                    {
                        [i + 'cartridge']: getDeviceName(props.cartridge[i].materialValue)
                    }
                );
            }
            setValues(newArrValue)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: storageResult = await saveRefillingCartridge(values) as storageResult;
                    if (result.isOk) {
                        storageLoadFromServer();
                        props.resetSelect();
                        props.closeDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as RefillingCartridgeModel)])
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            values[index] = {...values[index], [name]: value};
            setValues([...values])
        }

        const removeField = (event: React.MouseEvent, index: number) => {
            event.stopPropagation()

            values.splice(index, 1);

            refreshField(values);
        }

        const refreshField = (newArr: RefillingCartridgeModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'contract']: newArr[i].contract?.id,
                        [i + 'cartridge']: newArr[i].cartridge,
                    }
                );
            }
        }

        const x = (indexSpecification: number, selectRecordIn: any, deleteRecordIn: boolean) => {
            selectRecord[indexSpecification] = selectRecordIn
            setSelectRecord([...selectRecord])

            button[indexSpecification] = {
                ...button[indexSpecification],
                buttonVisible: {...button[indexSpecification].buttonVisible},
                buttonDisable: {...button[indexSpecification].buttonDisable, deleteRecord: deleteRecordIn}
            }
            setButton([...button])
        }

        return (
            <CardView typeModel={"RepairDeviceModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={true} buttonAdd={true} name={index + 'contract'} rulesOn={false}
                                            reasonType={'contract'}
                                            onChange={(value) => changeField(index, "contract", value)}/>
                              {/*Состав*/}
                              <Collapse>
                                  <Panel header={`В составе`} key={1}>
                                      <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                          <ButtonGroup button={{
                                              ...button[index], buttonVoid: {
                                                  addRecord: () => {
                                                      indexSpecificationGlobal = index;
                                                      setViewRefillingCartridgeCartridgeListDrawer(true);
                                                      x(index, [{} as MaterialValueOrgModel], true);
                                                  },
                                                  deleteRecord: () => {
                                                      let newArrDelete: MaterialValueOrgModel[] = [...values[index].cartridge];
                                                      newArrDelete.splice(values[index].cartridge.indexOf(selectRecord[index]), 1)
                                                      values[index].cartridge = newArrDelete;
                                                      setValues([...values]);
                                                      x(index, [{} as MaterialValueOrgModel], true);
                                                      setExclude();
                                                  }
                                              }
                                          }}/>
                                          <TableCustom multiSelect={false}
                                                       dataSource={values[index].cartridge}
                                                       columns={materialValueOrgColumns({interfaceType: 'any'})}
                                                       spinningLoading={false} selectChildren={false}
                                                       selectRecordIn={[selectRecord[index]]}
                                                       returnSelectRecords={(selectRecordIn) => {
                                                           x(index, selectRecordIn[0], false);
                                                       }}
                                          />
                                      </Layout>
                                  </Panel>
                              </Collapse>

                          </>}
            />
        )
    }

    const saveSpec = (value: MaterialValueOrgModel[]) => {
        if (values[indexSpecificationGlobal].cartridge !== undefined) {
            values[indexSpecificationGlobal].cartridge = values[indexSpecificationGlobal].cartridge.concat(value)
            setValues([...values]);
        } else {
            values[indexSpecificationGlobal].cartridge = value
            setValues([...values]);
        }
        setExclude();
    }

    const setExclude = () => {
        let tmp: MaterialValueOrgModel[] = []
        values.forEach((item) => {
            if (item.cartridge !== undefined) {
                tmp = tmp.concat(item.cartridge.flatMap(item2 => item2))
            }
        })
        setExcludeData(tmp)
    }

    return (
        <Drawer
            title={'Замена оборудования'}
            width={'650px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.openDrawer}
            extra={
                <Space>
                    <Button onClick={props.closeDrawer}>Отмена</Button>
                    <Button onClick={() => onClickAddField()}>Добавить</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
            {viewRefillingCartridgeCartridgeListDrawer &&
                <MaterialValueOrgListListDrawer
                    selectRecords={excludeData} openDrawer={viewRefillingCartridgeCartridgeListDrawer}
                    selectChildren={false}
                    closeDrawer={() => setViewRefillingCartridgeCartridgeListDrawer(!viewRefillingCartridgeCartridgeListDrawer)}
                    saveRecord={(value) => saveSpec(value)} typeUrl={'allCartridgeNeedRefilling'}
                    multiSelect={true}/>
            }
        </Drawer>
    );
};

export default RefillingCartridgeDrawer;