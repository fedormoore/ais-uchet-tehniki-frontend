import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Collapse, Drawer, Form, Input, Layout, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import {LocationModel} from "../../../models/spr/LocationModel";
import {LocationActionCreators, locationResult} from "../../../reducers/spr/location/locationActionCreators";
import LocationTypeSelect from "../../../components/ui/select/LocationTypeSelect";
import TableCustom from "../../../components/ui/table/TableCustom";
import {locationColumns} from "../../../components/ui/table/column/LocationColumns";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";
import {deleteRecord, locationSaveRecord, undoRecord} from "../../../dataPreparation/local/locationLocal";
import CardView from "../../materialValueOrg/action/CardView";

const {Panel} = Collapse;

interface LocationDrawerProps {
    locationOpenDrawer: boolean;
    locationCloseDrawer: () => void;
    locationValues: LocationModel;
    saveChildren?: (value: LocationModel[]) => void;
}

interface LocationChildrenSelectRecord {
    selectRecord: LocationModel[];
}

let indexGlobal: number;

const LocationDrawer: FC<LocationDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {loadLocation, saveLocation} = useActions(LocationActionCreators);

    const [values, setValues] = useState<LocationModel[]>([Object.assign([], props.locationValues)]);

    const [locationChildrenSelectRecord, setLocationChildrenSelectRecord] = useState<LocationChildrenSelectRecord[]>([{
        selectRecord: [{} as LocationModel]
    }]);

    const [button, setButton] = useState<buttonInterface[]>([initButton])

    const [visibleLocationDrawer, setVisibleLocationDrawer] = useState<boolean>(false);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0type': values[0].type,
                '0name': values[0].name,
                '0children': values[0].children
            }
        );

        button[0] = {
            ...button[0], buttonVisible: {...button[0].buttonVisible}, buttonDisable: {
                ...button[0].buttonDisable, addRecord: values[0].type === undefined
            }
        }
        setButton([...button])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: locationResult = await saveLocation(values) as locationResult;
                    if (result.isOk) {
                        loadLocation();
                        props.locationCloseDrawer();
                    }
                })();
            })
    }

    const onClickSaveChildren = (value: LocationModel[]) => {
        values[indexGlobal].children = locationSaveRecord(values[indexGlobal].children!, value);
        setValues(values)
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as LocationModel)]);
        button.push(initButton)
        locationChildrenSelectRecord.push({selectRecord: []})
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            values[index] = {...values[index], [name]: value};
            setValues([...values])

            const buttonDisable = (values[index].type !== '' && values[index].type !== undefined) && (values[index].name !== '' && values[index].name !== undefined)

            button[index] = {
                ...button[index],
                buttonVisible: {...button[index].buttonVisible},
                buttonDisable: {...button[index].buttonDisable, addRecord: !buttonDisable}
            }
            setButton([...button])
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()

            button.splice(index, 1);
            setButton([...button])

            locationChildrenSelectRecord.splice(index, 1);
            setLocationChildrenSelectRecord([...locationChildrenSelectRecord])

            values.splice(index, 1);
            setValues([...values])

            for (let i = 0; i < values.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'type']: values[i].type,
                        [i + 'name']: values[i].name,
                        [i + 'children']: values[i].children
                    }
                );
            }
        }

        return (
            <CardView typeModel={"LocationModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <LocationTypeSelect load={loadSelect} name={index + 'type'}
                                                          rulesOn={true}
                                                          onChange={(value) => changeField(index, "type", value)}/>
                                  </Col>
                                  <Col span={24}>
                                      <Form.Item
                                          label="Наименование"
                                          name={index + 'name'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите наименование'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "name", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                      {/*Состав*/}
                                      <Collapse>
                                          <Panel header={`В составе`} key={1}>
                                              <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                                  <ButtonGroup button={{
                                                      ...button[index], buttonVoid: {
                                                          addRecord: () => {
                                                              indexGlobal = index;
                                                              setVisibleLocationDrawer(true);
                                                              locationChildrenSelectRecord[index] = {
                                                                  selectRecord: [{} as LocationModel]
                                                              }
                                                              setLocationChildrenSelectRecord(locationChildrenSelectRecord)
                                                          },
                                                          editRecord: () => {
                                                              indexGlobal = index;
                                                              setVisibleLocationDrawer(true);
                                                          },
                                                          deleteRecord: () => {
                                                              values[index].children = deleteRecord(values[index].children, values[index].children.indexOf(locationChildrenSelectRecord[index].selectRecord[0]));
                                                              setValues([...values]);

                                                              locationChildrenSelectRecord[index] = {
                                                                  selectRecord: []
                                                              }
                                                              setLocationChildrenSelectRecord(locationChildrenSelectRecord)

                                                              button[index] = {
                                                                  ...button[index],
                                                                  buttonVisible: {
                                                                      ...button[index].buttonVisible,
                                                                      undoRecord: true,
                                                                      deleteRecord: false
                                                                  },
                                                                  buttonDisable: {
                                                                      ...button[index].buttonDisable,
                                                                      deleteRecord: true,
                                                                      undoRecord: true
                                                                  }
                                                              }
                                                              setButton([...button])
                                                          },
                                                          undoRecord: () => {
                                                              values[index].children = undoRecord(values[index].children, values[index].children.indexOf(locationChildrenSelectRecord[index].selectRecord[0]));
                                                              setValues([...values]);

                                                              locationChildrenSelectRecord[index] = {
                                                                  selectRecord: []
                                                              }
                                                              setLocationChildrenSelectRecord(locationChildrenSelectRecord)

                                                              button[index] = {
                                                                  ...button[index],
                                                                  buttonVisible: {
                                                                      ...button[index].buttonVisible,
                                                                      undoRecord: false,
                                                                      deleteRecord: true
                                                                  },
                                                                  buttonDisable: {
                                                                      ...button[index].buttonDisable,
                                                                      deleteRecord: true,
                                                                      undoRecord: true
                                                                  }
                                                              }
                                                              setButton([...button])
                                                          }
                                                      }
                                                  }}/>
                                                  <TableCustom multiSelect={false} expandable={true}
                                                               dataSource={values[index].children}
                                                               columns={locationColumns}
                                                               spinningLoading={false} selectChildren={false}
                                                               selectRecordIn={locationChildrenSelectRecord[index].selectRecord}
                                                               returnSelectRecords={(selectRecordIn) => {
                                                                   locationChildrenSelectRecord[index] = {
                                                                       selectRecord: selectRecordIn
                                                                   }
                                                                   button[index] = {
                                                                       ...button[index], buttonVisible: {
                                                                           ...button[0].buttonVisible,
                                                                           undoRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: !selectRecordIn[0].deleted
                                                                       }, buttonDisable: {
                                                                           editRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: selectRecordIn[0].deleted
                                                                       }
                                                                   }
                                                                   setButton([...button])
                                                               }}
                                                               returnDoubleClick={() => {
                                                                   if (!locationChildrenSelectRecord[index].selectRecord[0].deleted) {
                                                                       indexGlobal = index;
                                                                       setVisibleLocationDrawer(true);
                                                                   }
                                                               }}
                                                  />
                                              </Layout>
                                          </Panel>
                                      </Collapse>
                                  </Col>
                              </Row>
                          </>}
            />
        )
    }

    return (
        <Drawer
            title={values[0].id !== undefined ? 'Редактировать запись' : 'Добавить запись'}
            width={'500px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.locationOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.locationCloseDrawer}>Отмена</Button>
                    {values[0].id === undefined &&
                        <Button onClick={() => onClickAddField()}>Добавить</Button>}
                    <Button type="primary" onClick={() => {
                        if (props.saveChildren === undefined) {
                            onClickSaveRecord()
                        } else {
                            form.validateFields()
                                .then(() => {
                                    props.saveChildren?.(values)
                                    props.locationCloseDrawer();
                                })
                        }
                    }}>
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
            {visibleLocationDrawer &&
                <LocationDrawer locationOpenDrawer={visibleLocationDrawer}
                                saveChildren={(value) => onClickSaveChildren(value)}
                                locationCloseDrawer={() => setVisibleLocationDrawer(!visibleLocationDrawer)}
                                locationValues={locationChildrenSelectRecord[indexGlobal].selectRecord[0]}/>
            }
        </Drawer>
    );
};

export default LocationDrawer;