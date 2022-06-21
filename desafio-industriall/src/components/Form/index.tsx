import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Form} from './style'
import Input from './components/Input';
import Select from './components/Select';
import Textarea from './components/TextArea';
import * as Yup from 'yup'
import {format} from 'date-fns'
import { FormHandles } from '@unform/core';

type FormData = {
    title: string,
    localId: number,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    meetingTypeId: Number,
    
    description?: string,
    todayWork?: string,
    tomorrowWork?: string,
    sprintEndDate?: string,
    sprintReview?: string,
    quarterStartDate?: string,
    objective?: string,
    keyResults?: string,
}

type MeetingField = {
    id: number,
    tipo: string,
    nome: string,
}

type MeetingType = {
        id: number,
        nome: string,
        campos: MeetingField[]
}

type Local = {
    id: number,
    nome: string,
}

type ErrorsObject = {
    [key: string]: any 
}

export function MinuteForm(){

    const navigate = useNavigate();
    const formRef = useRef<FormHandles>(null);


    const [token, setToken] = useState("")
    const [meetingTypeOptions, setMeetingTypeOptions] = useState<MeetingType[]>([]);
    const [localOptions, setLocalOptions] = useState<Local[]>([]);

    const [selectedMeetingType, setSelectedMeetingType] = useState<Number>(0)

    async function getSelectOptions(){
        const myToken = await getToken();
        
        const meetingTypesResponse = await api.get('/TiposReuniao', {
            headers:{
                Authorization: myToken,
            }
        })
        
        const locationsResponse = await api.get('/Locais', {
            headers:{
                Authorization: myToken,
            }
        })

        setMeetingTypeOptions(meetingTypesResponse.data)
        setLocalOptions(locationsResponse.data);

    }

    const renderMeetingType = useCallback(()=>{
        
        return(
            <>
                {selectedMeetingType === 0 && (
                    <div className="meeting-content">
                        Selecione o tipo da reunião
                    </div>
                )}
                {selectedMeetingType === 1 && (
                    <Textarea name="description" label="Descrição dos Occoridos *"/>    
                )}
                {selectedMeetingType === 2 && (
                    <>
                        <Textarea name="todayWork" label="O que foi feito hoje? *"/>
                        <Textarea name="tomorrowWork" label="O que será feito amanhã? *"/>
                    </>
                )}
                {selectedMeetingType === 3 && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="sprintEndDate" label="Data de Fim da Sprint *" />
                        </div>
                        <Textarea name="sprintReview" label="Avaliação do Sprint"/>
                    </>
                )}
                {selectedMeetingType === 4 && (
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
    },[selectedMeetingType])
    
    function getValuesForValidation(data: FormData){

        let formData: FormData = {
            title: data.title,
            localId: data.localId,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            meetingTypeId: data.meetingTypeId
        }

        let schemaObject: any = {
            title: Yup.string().required("Este campo é obrigatório."),
            localId: Yup.string().test("is-a-valid-local", "Escolha um local válido.", localId => Number(localId) > 0),
            startDate: Yup.string().required("Este campo é obrigatório."),
            endDate: Yup.string().required("Este campo é obrigatório."),
            startTime: Yup.string().required("Este campo é obrigatório."),
            endTime: Yup.string().required("Este campo é obrigatório."),
            meetingTypeId: Yup.string().test("is-a-valid-type", "Escolha um tipo válido.", meetingType => Number(meetingType) > 0)
        }

        if(data.meetingTypeId === 1){
            formData={
                ...formData,
                description: data.description,
            }
            schemaObject = {
                ...schemaObject,
                description: Yup.string().required("Este campo é obrigatório"),  
            } 
        }else if(data.meetingTypeId === 2){
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
        }else if(data.meetingTypeId === 3){
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
        }else if(data.meetingTypeId === 4){
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

        return {formData, schemaObject}
    }

    function parseData(data: FormData){

        const {startDate, endDate, startTime, endTime, title, localId, meetingTypeId} = data;

        const startDateElements = startDate.split('-');
        const startTimeElements = startTime.split(':');
        
        const parsedStartDate = format(new Date(
            Number(startDateElements[0]), 
            Number(startDateElements[1]) - 1,
            Number(startDateElements[2]),
            Number(startTimeElements[0]),
            Number(startTimeElements[1])
        ),  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        const endDateElements = endDate.split('-');
        const endTimeElements = endTime.split(':');
        
        const parsedEndDate = format(new Date(
            Number(endDateElements[0]), 
            Number(endDateElements[1]) - 1,
            Number(endDateElements[2]),
            Number(endTimeElements[0]),
            Number(endTimeElements[1])
        ),  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        let parsedData: any = {
            titulo: title,
            dataInicio: parsedStartDate,
            dataFim: parsedEndDate,
            tipoReuniaoId: meetingTypeId,
            localId: localId,
        }

        if(meetingTypeId === 1){
            const extraData = [{campoId: 1, valor: data.description}]
            parsedData = {...parsedData, camposAtaReuniao: extraData}
        }
        
        
        if(meetingTypeId === 2){
            const extraData = [{campoId: 2, valor: data.todayWork}, {campoId:3 , valor: data.tomorrowWork}]
            parsedData = {...parsedData, camposAtaReuniao: extraData}
        }
    
        
        if(meetingTypeId === 3){
            const extraData = [{campoId: 4, valor: data.sprintEndDate}, {campoId:5 , valor: data.sprintReview}]
            parsedData = {...parsedData, camposAtaReuniao: extraData}
        }
        
        if(meetingTypeId === 4){
            const extraData = [{campId: 6, valor: data.quarterStartDate}, {campoId:7 , valor: data.objective}, {campoId:8 , valor: data.keyResults}]
            parsedData = {...parsedData, camposAtaReuniao: extraData}
        }

        return parsedData;
    }


    async function handleSubmit(data: FormData){
        
        console.log(data);

        const {formData, schemaObject} = getValuesForValidation(data);

        try{
            const schema = Yup.object().shape(schemaObject)

            await schema.validate(formData, {abortEarly: false})

            const parsedData = parseData(data);

            // await api.post('/Atas', parsedData, {
            //     headers:{
            //         Authorization: token,
            //         "Content-Type": "application/json"
            //     }
            // })

            
        }catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errorMessages: ErrorsObject = {};

              err.inner.forEach(error => {
                    if(error.path){
                        errorMessages[error?.path] = error.message
                    }   
              })
            
              formRef.current?.setErrors(errorMessages);
            }
        }

    }

    useEffect(()=>{
        getSelectOptions();
    },[])

    return(
        <div id="create-minute-form">
            <Card>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <>
                    <h2>Identificação</h2>
                    <div>
                        <Input name="title" label="Título *" placeholder="Título"/>
                    </div>
                    <div>
                        <Select name="localId" label="Local *" placeholder="Local">
                            <option value={0}>Local</option>
                            {localOptions?.map((local) => {
                                return(
                                    <option key={local.id} value={local.id}>{local.nome}</option>
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
                            name="meetingTypeId" 
                            label="Tipo da Reunião *"
                            onChange={(e)=> setSelectedMeetingType(Number(e.target.value))}
                        >
                            <option value={0}>Tipo da Reunião</option>
                            {meetingTypeOptions?.map((meetingType) => {
                                return(
                                    <option key={meetingType.id} value={meetingType.id}>{meetingType.nome}</option>
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
                    </>
                </Form>
            </Card>
        </div>
 
    )
}
