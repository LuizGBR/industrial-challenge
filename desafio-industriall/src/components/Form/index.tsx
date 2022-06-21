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
import { createDateTime } from '../../utils/createDateTime';

type FormData = {
    title: string,
    localId: number,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    meetingTypeId: number,
    
    description: string,
    todayWork: string,
    tomorrowWork: string,
    sprintEndDate: string,
    sprintEndTime: string,
    sprintReview: string,
    quarterStartDate: string,
    objective: string,
    keyResults: string,
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

type MinuteExclusiveProps = {
    campoId: number,
    valor: string | undefined,
}

type MinuteProps = {
    titulo: string,
    dataInicio: string,
    dataFim: string,
    tipoReuniaoId: number,
    localId: number,
    camposAtaReuniao: MinuteExclusiveProps[]
}

export function MinuteForm(){

    const navigate = useNavigate();
    const formRef = useRef<FormHandles>(null);

    const [meetingTypeOptions, setMeetingTypeOptions] = useState<MeetingType[]>([]);
    const [localOptions, setLocalOptions] = useState<Local[]>([]);

    const [selectedMeetingType, setSelectedMeetingType] = useState<Number>(0)

    async function getSelectOptions(){
        const token = await getToken();
        
        const meetingTypesResponse = await api.get('/TiposReuniao', {
            headers:{
                Authorization: token,
            }
        })
        
        const locationsResponse = await api.get('/Locais', {
            headers:{
                Authorization: token,
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
                        <div className='date-time-inputs'>
                            <div>
                                <Input type="date" name="sprintEndDate" label="Data de Fim da Sprint *" />
                            </div>
                            <div>
                                <Input type="time" name="sprintEndTime" label="Horário de Fim da Sprint *" />
                            </div>
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

    function checkMeetingType1Values(value: any, meetingType: number){
        if(meetingType == 1){
            if(value && value.trim() !== ''){
                return true;
            }
            return false;
        }

        return true;
    }

    function checkMeetingType2Values(value: any, meetingType: number){
        if(meetingType == 2){
            if(value && value.trim() !== ''){
                return true;
            }
            return false;
        }
        return true;
    }
    
    function checkMeetingType3Values(value: any, meetingType: number){
        if(meetingType == 3){
            if(value && value.trim() !== ''){
                return true;
            }
            return false;
        }
        return true;
    }

    function checkMeetingType4Values(value: any, meetingType: number){
        if(meetingType == 4){
            if(value && value.trim() !== ''){
                return true;
            }
            return false;
        }
        return true;
    }

    function getSchema(meetingType: number){

        const schemaObject: any = {
            title: Yup.string().required("Este campo é obrigatório."),
            localId: Yup.string().test("is-a-valid-local", "Escolha um local válido.", localId => Number(localId) > 0),
            startDate: Yup.string().required("Este campo é obrigatório."),
            endDate: Yup.string().required("Este campo é obrigatório."),
            startTime: Yup.string().required("Este campo é obrigatório."),
            endTime: Yup.string().required("Este campo é obrigatório."),
            meetingTypeId: Yup.string().test("is-valid", "Escolha um tipo válido.", meetingType => Number(meetingType) > 0),
            
            description: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType1Values(value, meetingType)),
            todayWork: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType2Values(value, meetingType)),
            tomorrowWork: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType2Values(value, meetingType)),
            sprintEndDate: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType3Values(value, meetingType)),
            sprintEndTime: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType3Values(value, meetingType)),
            sprintReview: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType3Values(value, meetingType)),
            quarterStartDate: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType4Values(value, meetingType)),
            objective: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType4Values(value, meetingType)),
            keyResults: Yup.string().test("is-valid", "Este campo é obrigatório", value => checkMeetingType4Values(value, meetingType)),   
        }

        return schemaObject
    }

    function parseData(data: FormData){

        const {startDate, endDate, startTime, endTime, title, localId, meetingTypeId} = data;

        const parsedStartDateTime = createDateTime(startDate, startTime);
        const parsedEndDateTime = createDateTime(endDate, endTime);
        console.log(parsedStartDateTime);

        let parsedData: MinuteProps = {
            titulo: title,
            dataInicio: parsedStartDateTime,
            dataFim: parsedEndDateTime,
            tipoReuniaoId: meetingTypeId,
            localId: localId,
            camposAtaReuniao: []
        }


        if(meetingTypeId == 1){
            const extraData = [{campoId: 1, valor: data.description}]
            parsedData.camposAtaReuniao = extraData;
        }
        
        
        if(meetingTypeId == 2){
            const extraData = [{campoId: 2, valor: data.todayWork}, {campoId:3 , valor: data.tomorrowWork}]
            parsedData.camposAtaReuniao = extraData;
        }
    
        
        if(meetingTypeId == 3){
            const parsedSprintEndDateTime = createDateTime(data.sprintEndDate, data.sprintEndTime)
            const extraData = [{campoId: 4, valor: parsedSprintEndDateTime}, {campoId:5 , valor: data.sprintReview}]
            parsedData.camposAtaReuniao = extraData;
        }
        
        if(meetingTypeId == 4){
            const extraData = [{campoId: 6, valor: data.quarterStartDate}, {campoId:7 , valor: data.objective}, {campoId:8 , valor: data.keyResults}]
            parsedData.camposAtaReuniao = extraData;
        }

        return parsedData;
    }


    async function handleSubmit(data: FormData){
        const token = await getToken();
        
        const schemaObject = getSchema(data.meetingTypeId);
        
        try{
            const schema = Yup.object().shape(schemaObject)

            await schema.validate(data, {abortEarly: false})
            const parsedData = parseData(data);
            
            await api.post('/Atas', parsedData, {
                headers:{
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            })
            
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
