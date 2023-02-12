import React, {FC, useState} from 'react';
import {Card, Col, Collapse, Empty, Input, Row, Select, Tag} from "antd";
import {FilterModel} from "../../../../models/FilterModel";
import {FilterTagModel} from "../../../../models/FilterTagModel";

const {Panel} = Collapse;

interface FilterViewProps {
    filterIn: { filterColumns: any, applyFilter: (filterListServer: any, filterList: FilterTagModel[]) => void, filterList: FilterTagModel[] };
}

interface FilterValue {
    column: FilterModel;
    param: string;
}

const FilterCollapse: FC<FilterViewProps> = (props) => {

    const [filterValue, setFilterValue] = useState<FilterValue>({} as FilterValue);
    const [filterList, setFilterList] = useState<FilterTagModel[]>(props.filterIn.filterList);

    const filterTag = (tag: FilterTagModel) => {

        const deleteTag = (e: any, id: string) => {
            e.stopPropagation();
            const tempArr = filterList.filter((el: any) => el.id !== id)
            setFilterList(tempArr)

            const tempArrToServer = new URLSearchParams()
            for (let i = 0; i < tempArr.length; i++) {
                tempArrToServer.append(tempArr[i].column.server, tempArr[i].param)
            }

            props.filterIn.applyFilter(tempArrToServer, tempArr)
        };

        return (
            <span key={tag.id} style={{display: 'inline-block'}}>
                <Tag color="green" closable
                     onClose={(e) => deleteTag(e, tag.id)}>{tag.column.title + " содержит " + tag.param}</Tag>
            </span>
        )
    }

    return (
        <div className="table-collapse">
            <Collapse key={"2"} defaultActiveKey={filterList.length > 0 ? 1 : 0}>
                <Panel header="Фильтр" key="1">
                    <Row wrap={false}>
                        <Col flex="none">
                            <Card>
                                <Select
                                    style={{minWidth: "200px", marginBottom: "10px"}}
                                    size="small"
                                    placeholder="Колонка"
                                    value={filterValue.column?.title}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    notFoundContent={
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                               description="Нет данных"/>
                                    }
                                    onChange={(value, objectValues: any) => setFilterValue({
                                        ...filterValue,
                                        column: objectValues?.object
                                    })}
                                >
                                    {props.filterIn.filterColumns.map((item: FilterModel) => {
                                        return (
                                            <Select.Option value={item.title} key={item.title} object={item}>
                                                {item.title}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                                <Input style={{maxWidth: "200px"}}
                                       size="small"
                                       placeholder="Критерий"
                                       value={filterValue.param}
                                       onChange={(value) => setFilterValue({...filterValue, param: value.target.value})}
                                       onPressEnter={() => {
                                           filterList.push(
                                               {
                                                   id: Date.now().toString(),
                                                   column: filterValue.column,
                                                   param: filterValue.param
                                               }
                                           )

                                           const tempArrToServer = new URLSearchParams()
                                           for (let i = 0; i < filterList.length; i++) {
                                               tempArrToServer.append(filterList[i].column.server, filterList[i].param)
                                           }

                                           props.filterIn.applyFilter(tempArrToServer, filterList)
                                           setFilterValue({} as FilterValue)
                                       }}/>
                            </Card>
                        </Col>
                        <Col flex="auto">
                            <div style={{
                                maxHeight: "80px",
                                minHeight: "80px",
                                overflow: "-moz-scrollbars-vertical",
                                overflowY: "scroll"
                            }}>
                                {filterList.map(filterTag)}
                            </div>
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        </div>
    );
};

export default FilterCollapse;