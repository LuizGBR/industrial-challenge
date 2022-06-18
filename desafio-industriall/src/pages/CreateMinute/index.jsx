import { useEffect, useState } from 'react';
import {Button, CardFooter, Form} from 'reactstrap';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Input, CardBody, Label, FormGroup} from './style'

export function CreateMinute(){

    const [meetingTypeOptions, setMeetingTypeOptions] = useState([]);

    async function getSelectOptions(){
        const myToken = await getToken();

        const response = await api.get('/TiposReuniao', {
            headers:{
                Authorization: `Bearer ${myToken}`
            }
        })
        setMeetingTypeOptions(response.data)

    }
    
    useEffect(()=>{
        getSelectOptions();
    })


    return(
        <div id="create-minute-form">
            <Card>
                <CardBody>
                    Identificação
                    <Form>
                        <FormGroup>
                            <Label for="title">Título *</Label>
                            <Input type="text" name="title" id="title" placeholder="Título" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Local *</Label>
                            <Input type="select" name="local" id="local" placeholder="Local">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option> 
                            </Input>
                        </FormGroup>
                        <div className="date-inputs">
                            <FormGroup>
                                <Label for="start-date">Data e Horário de Início *</Label>
                                <Input type="date" name="start-date" id="start-date" placeholder="Data e Horário de Início" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="end-date">Data e Horário de fim *</Label>
                                <Input type="date" name="end-date" id="end-date" placeholder="Data e Horário de fim" />
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Label for="exampleSelect">Select</Label>
                            <Input type="select" name="select" id="exampleSelect">
                                {meetingTypeOptions?.map((meetingType) => {
                                    return(
                                        <option key={meetingType.id}>{meetingType.nome}</option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                        Conteúdo da Reunião                        
                        <div className="meeting-content">
                            Selecione o tipo da reunião
                        </div>  
                    </Form>
                </CardBody>
                <CardFooter>
                    <Button>CANCELAR</Button>
                    <Button>SALVAR ATA</Button>
                </CardFooter>
            </Card>
        </div>
 
    )
}