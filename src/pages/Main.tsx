import React, {useState} from 'react';
import {Button, Card, Col, Image, Layout, Row, Typography} from "antd";
import Registration from "./auth/Registration";
import AccountActivate from "./auth/AccountActivate";
import Login from "./auth/Login";

const {Content} = Layout;
const {Title, Text} = Typography;

const Main = () => {

    const [viewLogin, setViewLogin] = useState<boolean>(false);
    const [viewRegistration, setViewRegistration] = useState<boolean>(false);
    const [viewAccountActivate, setViewAccountActivate] = useState<boolean>(true);

    return (
        <Content style={{marginLeft: '100px', marginRight: '100px'}}>
            <Row wrap={false} style={{display: 'flex', justifyContent: 'center'}}>
                <Col flex="400px">
                    <Row>
                        <Title>Учет материальные ценностей на предприятиях в облаке</Title>
                    </Row>
                    <Row>
                        <Title level={4}>Полный жизненный цикл МЦ — в одной системе: поступления,
                            изменение состава, утилизация, история движения</Title>
                    </Row>
                    <Row>
                        <Button type={'primary'} style={{width: '100%', height: '50px'}} onClick={() => setViewRegistration(true)}>Регистрация</Button>
                    </Row>
                </Col>
                <Col flex="auto" style={{marginLeft: '100px', maxWidth: '540px'}}>
                    <Image style={{marginTop: '50px'}} src={require('.././resurse/image/scrin.png')} preview={false}/>
                </Col>
            </Row>
            <br/>
            <br/>
            <br/>
            <br/>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <Col>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Title>Кому поможет данный сайт</Title>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}} gutter={16}>
                        <Col flex="200px">
                            <Card style={{width: 300, height:150}}>
                                <Title level={4} style={{textAlign: 'center'}}>Материально ответсвенным лицам</Title>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:150}}>
                                <Title level={4} style={{textAlign: 'center'}}>Бухгалтерам материального стола</Title>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:150}}>
                                <Title level={4} style={{textAlign: 'center'}}>Заведующим складом</Title>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <br/>
            <br/>
            <br/>
            <Row style={{display: 'flex', justifyContent: 'center'}} >
                <Col>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Title>Основные возможности</Title>
                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'center'}} gutter={16}>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>Формирование заявлений</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>Больше не придется создавать вручную заявления: программа самостоятельно на основании изменения материальных ценностей сформирует заявления для бухгалтерии. Гибкие настройки позволят настроить внешний вид под ваши запросы.</Text>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>История движения</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>Полная история состояния материальных ценностей - с момента поступления на предприятие до  утилизации. Вы больше не потеряете и точно будете знать что происходило с материальной ценностью.</Text>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>Генерация штрих кодов</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>Благодаря штрихкодам поиск материальных ценностей станет гораздо проще. Программа позволит сгенерировать штрихкод, а мобильное устройство отсканирует и найдет материальную ценность.</Text>
                            </Card>
                        </Col>
                    </Row>
                    <br/>
                    <Row style={{display: 'flex', justifyContent: 'center'}} gutter={16}>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>Жизненный цикл</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>Мы предусмотрели все возможные варианты изменения материальных ценностей, но вы всегда можете обратиться в службу поддержки для доработки программы по вашим предложениям.</Text>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>Учет картриджей</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>Специальный интерфейс для учета картриджей: теперь вы точно будете знать сколько у вас находится новых картриджей, а какие необходимо отдать на заправку.</Text>
                            </Card>
                        </Col>
                        <Col flex="200px">
                            <Card style={{width: 300, height:320}}>
                                <Title level={4} style={{textAlign: 'left'}}>Справочники</Title>
                                <br/>
                                <Text strong style={{textAlign: 'left'}}>В программе существуют множество справочников, которые облегчат работу. Достаточно один раз заполнить справочники, чтобы постоянно использовать их в работе.</Text>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <br/>
            <Row style={{display: 'flex', justifyContent: 'center'}} >
                <Col>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Title><a href="mailto:support@ais-uchet.ru">Техническая поддержка - support@ais-uchet.ru</a></Title>
                        <br/>
                    </Row>
                </Col>
            </Row>
            {viewLogin &&
                <Login loginOpenModal={viewLogin} loginCloseModal={() => setViewLogin(!viewLogin)}/>
            }
            {viewRegistration &&
                <Registration registrationOpenModal={viewRegistration}
                              registrationCloseModal={() => setViewRegistration(!viewRegistration)}/>
            }
            {window.location.pathname === '/activate_account_true' &&
                <AccountActivate accountActivateOpenModal={viewAccountActivate} result={true} return={()=>setViewLogin(true)}
                                 accountActivateCloseModal={() => setViewAccountActivate(!viewAccountActivate)}/>
            }
            {window.location.pathname === '/activate_account_false' &&
                <AccountActivate accountActivateOpenModal={viewAccountActivate} result={false}
                                 accountActivateCloseModal={() => setViewAccountActivate(!viewAccountActivate)}/>
            }
        </Content>
    );
};

export default Main;