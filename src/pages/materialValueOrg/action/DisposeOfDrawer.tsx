import React, {FC, useEffect, useState} from 'react';
import {Button, Collapse, Drawer, Form, Layout, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {DisposeOfModel} from "../../../models/materialValueOrg/DisposeOfModel";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import TableCustom from "../../../components/ui/table/TableCustom";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {materialValueOrgColumns} from "../../../components/ui/table/column/MaterialValueOrgColumns";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";
import CardView from "./CardView";
import MaterialValueOrgListListDrawer from "../../../components/ui/MaterialValueOrgListDrawer";

const {Panel} = Collapse;

interface DisposeOfDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    valueSpec: MaterialValueOrgModel[];
    resetSelect: () => void;
}

let indexSpecificationGlobal: number;

const DisposeOfDrawer: FC<DisposeOfDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {setNotification} = useActions(AppActionCreators);
    const {saveDisposeOf, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<DisposeOfModel[]>([{} as DisposeOfModel]);

    const [viewDisposeOfDeviceListDrawer, setViewDisposeOfDeviceListDrawer] = useState<boolean>(false);

    const [button, setButton] = useState<buttonInterface[]>([initButton])

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([{} as MaterialValueOrgModel]);

    const [excludeData, setExcludeData] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        if (props.valueSpec.length > 0) {
            values[0].specification = props.valueSpec;
            setValues([...values]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        let nullSpecification: boolean = false;
        for (let i = 0; i < values.length; i++) {
            if (values[i].specification === undefined || values[i].specification?.length === 0) {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Заполните состав"
                })
                nullSpecification = true
            }
        }
        if (!nullSpecification) {
            form.validateFields()
                .then(() => {
                    (async function () {
                        const result: storageResult = await saveDisposeOf(values) as storageResult;
                        if (result.isOk) {
                            storageLoadFromServer();
                            props.resetSelect();
                            props.closeDrawer();
                        }
                    })();
                })
        }
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as DisposeOfModel)])
        button.push(initButton)
        selectRecord.push({} as MaterialValueOrgModel)
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

            button.splice(index, 1);
            setButton([...button])

            selectRecord.splice(index, 1);
            setSelectRecord([...selectRecord])
            setExclude();
        }

        const refreshField = (newArr: DisposeOfModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'contract']: newArr[i].contract?.id,
                        [i + 'specification']: newArr[i].specification
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
            <CardView typeModel={"AssembleModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={true} buttonAdd={true} name={index + 'contract'} rulesOn={false}
                                            onChange={(value) => changeField(index, "contract", value)} reasonType={'contract'}/>
                              {/*Состав*/}
                              <Collapse>
                                  <Panel header={`В составе`} key={1}>
                                      <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                          <ButtonGroup button={{
                                              ...button[index], buttonVoid: {
                                                  addRecord: () => {
                                                      indexSpecificationGlobal = index;
                                                      setViewDisposeOfDeviceListDrawer(true);
                                                      x(index, [{} as MaterialValueOrgModel], true);
                                                  },
                                                  deleteRecord: () => {
                                                      let newArrDelete: MaterialValueOrgModel[] = [...values[index].specification];
                                                      newArrDelete.splice(values[index].specification.indexOf(selectRecord[index]), 1)
                                                      values[index].specification = newArrDelete;
                                                      setValues([...values]);
                                                      x(index, [{} as MaterialValueOrgModel], true);
                                                      setExclude();
                                                  }
                                              }
                                          }}/>
                                          <TableCustom multiSelect={false}
                                                       dataSource={values[index].specification}
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
        if (values[indexSpecificationGlobal].specification !== undefined) {
            values[indexSpecificationGlobal].specification = values[indexSpecificationGlobal].specification.concat(value)
            setValues([...values]);
        } else {
            values[indexSpecificationGlobal].specification = value
            setValues([...values]);
        }
        setExclude()
    }

    const setExclude = () => {
        let tmp: MaterialValueOrgModel[] = []
        values.forEach((item) => {
            if (item.specification !== undefined) {
                tmp = tmp.concat(item.specification.flatMap(item2 => item2))
            }
        })
        setExcludeData(tmp)
    }

    return (
        <Drawer
            title={'Списать'}
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
            {viewDisposeOfDeviceListDrawer &&
                <MaterialValueOrgListListDrawer
                    selectRecords={excludeData} openDrawer={viewDisposeOfDeviceListDrawer} selectChildren={false}
                    closeDrawer={() => setViewDisposeOfDeviceListDrawer(!viewDisposeOfDeviceListDrawer)}
                    saveRecord={(value) => saveSpec(value)} typeUrl={'allAllMaterialValueOrgDisposeOf'}
                    multiSelect={true}/>
            }
        </Drawer>
    );
};

export default DisposeOfDrawer;