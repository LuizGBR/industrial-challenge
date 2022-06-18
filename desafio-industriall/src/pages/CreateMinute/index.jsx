import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {Form} from '@unform/web';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Input, CardBody, Label, FormGroup, CardFooter} from './style'

export function CreateMinute(){

    const navigate = useNavigate();
    const formRef = useRef();

    const [meetingTypeOptions, setMeetingTypeOptions] = useState([]);
    const [meetingType, setMeetingType] = useState('');

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

    function getType(){
        console.log(formRef.current.getFieldValue());
    }

    return(
        <div id="create-minute-form">
            <Card>
                <Form ref={formRef} onSubmit={getType}>
                    <CardBody>
                        Identificação
                        
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
                                    <Label for="start-date">Data de Início *</Label>
                                    <Input type="date" name="start-date" id="start-date" placeholder="Data de Início" />
                                    <Label for="start-time">Horário de Início *</Label>
                                    <Input type="time" name="start-time" id="start-time" placeholder="Horário de Início" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="end-date">Data e Horário de fim *</Label>
                                    <Input type="date" name="end-date" id="end-date" placeholder="Data e Horário de fim" />
                                    <Label for="end-time">Horário de fim *</Label>
                                    <Input type="time" name="end-time" id="end-time" placeholder="Horário de fim" />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Label for="meetingTypeSelect">Select</Label>
                                <Input 
                                    type="select" 
                                    name="meetingTypeSelect" 
                                    id="meetingTypeSelect"
                                    value={meetingType}
                                    onChange={(e)=> setMeetingType(e.target.value)}
                                >
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
                    
                    </CardBody>
                    <CardFooter>
                        <button type="button" className="cancel" onClick={()=>{navigate('/')}}>CANCELAR</button>
                        <button type="submit" className="save" >SALVAR ATA</button>
                    </CardFooter>
                </Form>
            </Card>
        </div>
 
    )
}