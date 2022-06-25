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

type FieldType = {
    id: number,
    tipo: string,
    nome: string,
}

type MeetingType = {
    id: number,
    nome: string,
    campos: FieldType[];
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
    nome?: string,
    tipo?: string,
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

    const [selectedMeetingType, setSelectedMeetingType] = useState<number>(0)
    const [initialData, setInitialData] = useState<MinuteProps>()

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

        const meetingTypePlaceholder: MeetingType = {id: 0, nome: "Tipo da Reunião", campos: [{id:0, nome:"Tipo da Reunião", tipo:"none"}]}
        const localPlaceholder: Local = {id:0, nome: "Local"}

        meetingTypes.unshift(meetingTypePlaceholder);
        locations.unshift(localPlaceholder);

        setMeetingTypeOptions(meetingTypes)
        setLocalOptions(locations);
        
    }

    const setFormInitialData = useCallback(async () =>{
        if(params.id){

            const token = await getToken();
            const response = api.get(`/Atas/${params.id}`,{
                headers:{
                    Authorization: token
                }
            })

            toast.promise(response, {
                loading: 'Carregando dados...',
                success: () => {  
                  return 'Dados carregados com sucesso!';            
                },
                error: 'Ocorreu um erro!',
              }).then(response =>{
                const initialData: MinuteProps = response.data;
                setInitialData(initialData);

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
                    meetingTypeId: String(initialData.tipoReuniaoId),
                })

                setSelectedMeetingType(initialData.tipoReuniaoId);
            })
        }   
    },[params.id]) 

    const setExtraInitialData = useCallback(()=>{
        
        initialData?.camposAtaReuniao.forEach((field)=>{
            if(field.nome){
                formRef.current?.setFieldValue(`${field.nome}`, field.valor)
            }   
        })
        
    },[initialData?.camposAtaReuniao])

    function getSchema(meetingType: number){

        const schemaObject: any = {
            title: Yup.string().required("Este campo é obrigatório."),
            localId: Yup.string().test("is-a-valid-local", "Escolha um local válido.", localId => Number(localId) > 0),
            startDate: Yup.string().required("Este campo é obrigatório."),
            endDate: Yup.string().required("Este campo é obrigatório."),
            startTime: Yup.string().required("Este campo é obrigatório."),
            endTime: Yup.string().required("Este campo é obrigatório."),
            meetingTypeId: Yup.string().test("is-valid", "Escolha um tipo válido.", meetingType => Number(meetingType) > 0),   
        }

        meetingTypeOptions.find(mt => mt.id === selectedMeetingType)?.campos.forEach((field)=>{
            schemaObject[field.nome] = Yup.string().required("Este campo é obrigatório.");
        })

        return schemaObject
    }

    function parseData(data: any){
        
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

        meetingTypeOptions.find(mt => mt.id === selectedMeetingType)?.campos.forEach((field)=>{
            const extraData = {campoId: field.id, valor: data[field.nome]}
            parsedData.camposAtaReuniao.push(extraData)
        })

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
                loading: 'Criando Ata ...',
                success: () => {
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
            setFormInitialData();
        }
        
    }, [localOptions.length, meetingTypeOptions.length, setFormInitialData])

    useEffect(()=>{
        if(params.id){
            setExtraInitialData();
        }
    },[params.id, setExtraInitialData])

    return(
        <div id="create-minute-form">
            <Toaster />
            <Card>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h2>Identificação</h2>
                    <div>
                        <Input 
                            className={params.id && 'disabled'} 
                            disabled={!!params.id} name="title" 
                            label="Título *" 
                            placeholder="Digite aqui..."
                        />
                    </div>
                    <div>
                        <Select 
                            className={params.id && 'disabled'} 
                            disabled={!!params.id} name="localId" 
                            label="Local *" 
                        >
                            {localOptions?.map((local) => {
                                return(
                                    <option key={local.id} value={local.id}>{local.nome}</option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="date-time-inputs">
                        <div>
                            <Input 
                                className={params.id && 'disabled'} 
                                disabled={!!params.id} type="date" 
                                name="startDate" 
                                label="Data de Início *" 
                            />
                        </div>
                        <div>
                            <Input 
                                className={params.id && 'disabled'} 
                                disabled={!!params.id} 
                                type="date" 
                                name="endDate" 
                                label="Data de Fim *" 
                            />
                        </div>
                    </div>
                    <div className="date-time-inputs">
                        <div>           
                            <Input 
                                className={params.id && 'disabled'} 
                                disabled={!!params.id} 
                                type="time" 
                                name="startTime" 
                                label="Horário de Início *" 
                            />
                        </div>
                        <div>
                            <Input 
                                className={params.id && 'disabled'} 
                                disabled={!!params.id} 
                                type="time" 
                                name="endTime" 
                                label="Horário de Fim *" 
                            />    
                        </div>
                    </div>
                    <div>
                        <Select 
                            name="meetingTypeId" 
                            label="Tipo da Reunião *"
                            className={params.id && 'disabled'}
                            disabled={!!params.id}
                            onChange={()=> setSelectedMeetingType(Number(formRef.current?.getFieldValue('meetingTypeId')))}
                        >
                            {meetingTypeOptions?.map((meetingType) => {
                                return(
                                    <option key={meetingType.id} value={meetingType.id}>{meetingType.nome}</option>
                                )
                            })}
                        </Select>
                    </div>
                    <h2>Conteúdo da Reunião</h2>                        
                    <div>
                        {
                            meetingTypeOptions.find(mt => mt.id === selectedMeetingType)?.campos.map((field)=>{
                                if(field.tipo === "text"){
                                    return(
                                        <div  key={field.id}>
                                            <Input                                          
                                                className={params.id && 'disabled'} 
                                                disabled={!!params.id} 
                                                name={field.nome}
                                                label={field.nome}
                                                placeholder="Digite aqui..."
                                            />
                                        </div>
                                    )
                                }
                    
                                if(field.tipo === "datetime"){
                                    return(
                                    <div className='date-time' key={field.id}>
                                        <Input  
                                            className={params.id && 'disabled'} 
                                            disabled={!!params.id} 
                                            type="date" 
                                            name={field.nome} 
                                            label={field.nome}
                                        />
                                    </div>                    
                                    )
                                }
                    
                                if(field.tipo === "textarea"){
                                    return(
                                        <div key={field.id}>
                                            <Textarea
                                                className={params.id && 'disabled'} 
                                                disabled={!!params.id} 
                                                name={field.nome} 
                                                label={field.nome}
                                                placeholder="Digite aqui..."
                                            />
                                        </div>
                                    )
                                }

                                return(
                                    <div key={field.id} className="meeting-content">
                                        Selecione o tipo da reunião
                                    </div>
                                )
                            
                            })
                        }
                    </div>
                    <div className='form-footer'>
                        <button type="button" className="cancel" onClick={()=>{navigate('/')}}>{params.id ? 'VOLTAR' : 'CANCELAR'}</button>
                        <button hidden={!!params.id} disabled={!!params.id} type="submit" className="save" >SALVAR ATA</button>
                    </div>
                </Form>
            </Card>
        </div>
 
    )
}
