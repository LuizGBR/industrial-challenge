import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Form} from './style'
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/TextArea';
import * as Yup from 'yup'


export function CreateMinute(){

    const navigate = useNavigate();
    const formRef = useRef();

    const [meetingTypeOptions, setMeetingTypeOptions] = useState([]);
    const [localOptions, setLocalOptions] = useState([]);

    async function getSelectOptions(){
        const myToken = await getToken();

        const meetingTypesResponse = await api.get('/TiposReuniao', {
            headers:{
                Authorization: `Bearer ${myToken}`
            }
        })

        
        const locationsResponse = await api.get('/Locais', {
            headers:{
                Authorization: `Bearer ${myToken}`
            }
        })

        setMeetingTypeOptions(meetingTypesResponse.data)
        setLocalOptions(locationsResponse.data);

    }

    const renderMeetingType = useCallback(()=>{

        const type = formRef.current?.getFieldValue('meetingTypeSelect');
        
        return(
            <>
                {type === "Tipo da Reunião" && (
                    <div className="meeting-content">
                        Selecione o tipo da reunião
                    </div>
                )}
                {type === 'Resumida' && (
                    <Textarea name="description" label="Descrição dos Occoridos *"/>    
                )}
                {type === "Daily Scrum" && (
                    <>
                        <Textarea name="todayWork" label="O que foi feito hoje? *"/>
                        <Textarea name="tomorrowWork" label="O que será feito amanhã? *"/>
                    </>
                )}
                {type === "Sprint Retrospective" && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="sprintEndDate" label="Data de Fim da Sprint *" />
                        </div>
                        <Textarea name="sprintReview" label="Avaliação do Sprint"/>
                    </>
                )}
                {type === "Acompanhamento de OKRs (Objectives and Key Results)" && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="quarterStartDate" label="Data de Início do Trimestre *" />
                        </div>
                        <Input name="objective" label="Objetivo Principal do Trimestre *"/>
                        <Textarea name="keyResults" label="Resultados Obtidos Durante os Meses *"/>
                    </>
                )}
                
            </>
        )
    },[])
    
    function validateLocal(local){
        if(local === 'Local'){
            return false;
        }
        return true;
    }

    function validateMeetingType(meetingType){
        if(meetingType === 'Tipo da Reunião'){
            return false;
        }
        return true;
    }

    async function handleSubmit(data){

        let formData = {
            title: data.title,
            local: data.local,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            meetingTypeSelect: data.meetingTypeSelect
        }

        let schemaObject = {
            title: Yup.string().required("Este campo é obrigatório."),
            local: Yup.string().test("is-a-valid-local", "Escolha um local válido.", validateLocal),
            startDate: Yup.string().required("Este campo é obrigatório."),
            endDate: Yup.string().required("Este campo é obrigatório."),
            startTime: Yup.string().required("Este campo é obrigatório."),
            endTime: Yup.string().required("Este campo é obrigatório."),
            meetingTypeSelect: Yup.string().test("is-a-valid-type", "Escolha um tipo válido.", validateMeetingType)
        }

        if(data.meetingTypeSelect === 'Resumida'){
            formData={
                ...formData,
                description: data.description,
            }
            schemaObject = {
                ...schemaObject,
                description: Yup.string().required("Este campo é obrigatório"),  
            } 
        }else if(data.meetingTypeSelect === 'Daily Scrum'){
            formData={
                ...formData,
                todayWork: data.todayWork,
                tomorrowWork: data.tomorrowWork
            }
            schemaObject = {
                ...schemaObject,
                todayWork: Yup.string().required("Este campo é obrigatório"),
                tomorrowWork: Yup.string().required("Este campo é obrigatório"),  
            } 
        }else if(data.meetingTypeSelect === 'Sprint Retrospective'){
            formData={
                ...formData,
                sprintEndDate: data.sprintEndDate,
                sprintReview: data.sprintReview
            }
            schemaObject = {
                ...schemaObject,
                sprintEndDate: Yup.string().required("Este campo é obrigatório"),
                sprintReview: Yup.string().required("Este campo é obrigatório"),  
            } 
        }else if(data.meetingTypeSelect === 'Acompanhamento de OKRs (Objectives and Key Results)'){
            formData={
                ...formData,
                quarterStartDate: data.quarterStartDate,
                objective: data.objective,
                keyResults: data.keyResults
            }
            schemaObject = {
                ...schemaObject,
                quarterStartDate: Yup.string().required("Este campo é obrigatório"),
                objective: Yup.string().required("Este campo é obrigatório"),
                keyResults: Yup.string().required("Este campo é obrigatório")  
            } 
        }

        try{
            const schema = Yup.object().shape(schemaObject)

            await schema.validate(formData, {abortEarly: false})

            console.log(data);
        }catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errorMessages = {};

              err.inner.forEach(error => {
                errorMessages[error.path] = error.message
              })

              formRef.current.setErrors(errorMessages);
            }
        }

    }

    useEffect(()=>{
        getSelectOptions();
    })

    return(
        <div id="create-minute-form">
            <Card>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h2>Identificação</h2>
                    <div>
                        <Input name="title" label="Título *" placeholder="Título"/>
                    </div>
                    <div>
                        <Select type="select" name="local" label="Local *" placeholder="Local">
                            <option>Local</option>
                            {localOptions?.map((local) => {
                                return(
                                    <option key={local.id}>{local.nome}</option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="date-time-inputs">
                        <div>
                            <Input type="date" name="startDate" label="Data de Início *" />
                        </div>
                        <div>
                            <Input type="date" name="endDate" label="Data de Fim *" />
                        </div>
                    </div>
                    <div className="date-time-inputs">
                        <div>           
                            <Input type="time" name="startTime" label="Horário de Início *" />
                        </div>
                        <div>
                            <Input type="time" name="endTime" label="Horário de Fim *" />    
                        </div>
                    </div>
                    <div>
                        <Select
                            type="select" 
                            name="meetingTypeSelect" 
                            label="Tipo da Reunião *"
                        >
                            <option>Tipo da Reunião</option>
                            {meetingTypeOptions?.map((meetingType) => {
                                return(
                                    <option key={meetingType.id}>{meetingType.nome}</option>
                                )
                            })}
                        </Select>
                    </div>
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