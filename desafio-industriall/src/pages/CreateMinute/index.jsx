import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Form} from './style'
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/TextArea';


export function CreateMinute(){

    const navigate = useNavigate();
    const formRef = useRef();

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

    const renderMeetingType = useCallback(()=>{

        const type = formRef.current?.getFieldValue('meeting-type-Select');

        return(
            <>
                {type === "Tipo de Reunião" && (
                    <div className="meeting-content">
                        Selecione o tipo da reunião
                    </div>
                )}
                {type === 'Resumida' && (
                    <Textarea name="description" label="Descrição dos Occoridos"/>    
                )}
                {type === "Daily Scrum" && (
                    <>
                        <Textarea name="today-work" label="O que foi feito hoje?"/>
                        <Textarea name="tomorrow-work" label="O que será feito amanhã?"/>
                    </>
                )}
                {type === "Sprint Retrospective" && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="sprint-end-date" label="Data de Fim da Sprint" />
                        </div>
                        <Textarea name="sprint-review" label="Avaliação do Sprint"/>
                    </>
                )}
                {type === "Acompanhamento de OKRs (Objectives and Key Results)" && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="quarter-start-date" label="Data de Início do Trimestre" />
                        </div>
                        <Input name="objective" label="Objetivo Principal do Trimestre  "/>
                        <Textarea name="key-results" label="Resultados Obtidos Durante os Meses"/>
                    </>
                )}
                
            </>
        )
    },[])   
        

    function handleSubmit(data){
        console.log(data);
    }

    useEffect(()=>{
        getSelectOptions();
    })

    return(
        <div id="create-minute-form">
            <Card>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h2>Identificação</h2>
                    <Input name="title" label="Título *" placeholder="Título"/>
                    <Select type="select" name="local" label="Local *" placeholder="Local">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option> 
                    </Select>
                    <div className="date-time-inputs">
                        <div>
                            <Input type="date" name="start-date" label="Data de Início *" />
                            <Input type="date" name="end-date" label="Data de Fim *" />
                        </div>
                        <div>           
                            <Input type="time" name="start-time" label="Horário de Início *" />
                            <Input type="time" name="end-time" label="Horário de Fim *" />
                        </div>    
                    </div>
                    <Select
                        type="select" 
                        name="meeting-type-Select" 
                        label="Tipo da Reunião *"
                    >
                        <option>Tipo de Reunião</option>
                        {meetingTypeOptions?.map((meetingType) => {
                            return(
                                <option key={meetingType.id}>{meetingType.nome}</option>
                            )
                        })}
                        
                    </Select>
                    <h2>Conteúdo da Reunião</h2>                        
                    {renderMeetingType()}
                    <div className='form-footer'>
                        <button type="button" className="cancel" onClick={()=>{navigate('/')}}>CANCELAR</button>
                        <button type="submit" className="save" >SALVAR ATA</button>
                    </div>
                </Form>
            </Card>
        </div>
 
    )
}