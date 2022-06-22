import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router'
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
import toast, { Toaster } from 'react-hot-toast';

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
    const params = useParams()
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

        const meetingTypes: MeetingType[] = meetingTypesResponse.data;
        const locations: Local[] = locationsResponse.data;

        const meetingTypePlaceholder: MeetingType = {id: 0, nome: "Tipo da Reunião"}
        const localPlaceholder: Local = {id:0, nome: "Local"}

        meetingTypes.unshift(meetingTypePlaceholder);
        locations.unshift(localPlaceholder);

        setMeetingTypeOptions(meetingTypes)
        setLocalOptions(locations);

    }

    const getInitialData = useCallback(async () =>{
        if(params.id){

            const token = await getToken();
            const response = await api.get(`/Atas/${params.id}`,{
                headers:{
                    Authorization: token
                }
            })
       
            const initialData: MinuteProps = response.data;

            const {dataInicio, dataFim} = initialData

            const startDate = format(new Date(dataInicio), 'yyyy-MM-dd');
            const startTime = format(new Date(dataInicio), 'HH:mm');

            const endDate = format(new Date(dataFim), 'yyyy-MM-dd');
            const endTime = format(new Date(dataFim), 'HH:mm');

            formRef.current?.setData({
                title: initialData.titulo,
                localId: String(initialData.localId),
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                meetingTypeId: String(initialData.tipoReuniaoId)
            })
        }   
    },[params.id]) 

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
            const parsedSprintEndDate = format(new Date(data.sprintEndDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            const extraData = [{campoId: 4, valor: parsedSprintEndDate}, {campoId:6 , valor: data.sprintReview}]
            parsedData.camposAtaReuniao = extraData;
        }
        
        if(meetingTypeId == 4){
            const extraData = [{campoId: 7, valor: data.quarterStartDate}, {campoId:8 , valor: data.objective}, {campoId:9 , valor: data.keyResults}]
            parsedData.camposAtaReuniao = extraData;
        }

        return parsedData;
    }


    async function handleSubmit(data: FormData){

        const token = await getToken();
        
        const schemaObject = getSchema(data.meetingTypeId);
        
        try{
            const schema = Yup.object().shape(schemaObject);

            await schema.validate(data, {abortEarly: false});
            const parsedData = parseData(data);
            
            const response = api.post('/Atas', parsedData, {
                headers:{
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            })

            toast.promise(response, {
                loading: 'Loading ...',
                success: (data) => {
                  if (data.status === 500) throw new Error('server error');
                  
                  navigate('/');
                  return 'Ata Criada com Sucesso!';
                },
                error: 'Ocorreu um erro!',
              });

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
        if(meetingTypeOptions.length !== 0 && localOptions.length !== 0){
            getInitialData();
        }
        
    }, [getInitialData, localOptions.length, meetingTypeOptions.length])

    return(
        <div id="create-minute-form">
            <Toaster />
            <Card>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <>
                    <h2>Identificação</h2>
                    <div>
                        <Input name="title" label="Título *" placeholder="Título"/>
                    </div>
                    <div>
                        <Select name="localId" label="Local *" placeholder="Local">
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
