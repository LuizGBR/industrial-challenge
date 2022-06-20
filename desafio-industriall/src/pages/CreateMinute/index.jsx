import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { getToken } from '../../services/getToken';
import {Card, Form} from './style'
import Input from '../../components/Form/components/Input';
import Select from '../../components/Form/components/Select';
import Textarea from '../../components/Form/components/TextArea';
import * as Yup from 'yup'
import {format} from 'date-fns'


export function CreateMinute(){

    const navigate = useNavigate();
    const formRef = useRef();


    const [token, setToken] = useState("")
    const [meetingTypeOptions, setMeetingTypeOptions] = useState([]);
    const [localOptions, setLocalOptions] = useState([]);

    const [selectedMeetingType, setSelectedMeetingType] = useState('')

    async function getSelectOptions(){
        const myToken = await getToken()
        setToken(myToken);
        
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
    
    function getMeetingTypeId(meetingType){
        
        if(meetingType === "Resumida"){
            return 1;
        }
        
        if(meetingType === "Daily Scrum"){
            return 2;
        }
        
        if(meetingType === "Sprint Retrospective"){
            return 3;
        }
        
        if(meetingType === "Acompanhamento de OKRs (Objectives and Key Results)"){
            return 4;
        }
        
        return 0;

    }

    const renderMeetingType = useCallback(()=>{
           
         const typeId = getMeetingTypeId(selectedMeetingType);

        return(
            <>
                {typeId === 0 && (
                    <div className="meeting-content">
                        Selecione o tipo da reunião
                    </div>
                )}
                {typeId === 1 && (
                    <Textarea name="description" label="Descrição dos Occoridos *"/>    
                )}
                {typeId === 2 && (
                    <>
                        <Textarea name="todayWork" label="O que foi feito hoje? *"/>
                        <Textarea name="tomorrowWork" label="O que será feito amanhã? *"/>
                    </>
                )}
                {typeId === 3 && (
                    <>
                        <div className='date-time'>
                            <Input type="date" name="sprintEndDate" label="Data de Fim da Sprint *" />
                        </div>
                        <Textarea name="sprintReview" label="Avaliação do Sprint"/>
                    </>
                )}
                {typeId === 4 && (
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
    
    function getValuesForValidation(data){

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

        const typeId = getMeetingTypeId(data.meetingTypeSelect);

        if(typeId === 1){
            formData={
                ...formData,
                description: data.description,
            }
            schemaObject = {
                ...schemaObject,
                description: Yup.string().required("Este campo é obrigatório"),  
            } 
        }else if(typeId === 2){
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
        }else if(typeId === 3){
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
        }else if(typeId === 4){
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

    function parseData(data){

        const {startDate, endDate, startTime, endTime, title, meetingTypeSelect} = data;

        const startDateElements = startDate.split('-');
        const startTimeElements = startTime.split(':');
        
        const parsedStartDate = format(new Date(
            startDateElements[0], 
            startDateElements[1] - 1,
            startDateElements[2],
            startTimeElements[0],
            startTimeElements[1]
        ),  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        const endDateElements = endDate.split('-');
        const endTimeElements = endTime.split(':');
        
        const parsedEndDate = format(new Date(
            endDateElements[0], 
            endDateElements[1] - 1,
            endDateElements[2],
            endTimeElements[0],
            endTimeElements[1]
        ),  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        const typeId = getMeetingTypeId(meetingTypeSelect);
        
        let parsedData = {
            "titulo": title,
            "dataInicio": parsedStartDate,
            "dataFim": parsedEndDate,
            "tipoReuniaoId": typeId,
            "localId": 0,
        }


        if(typeId === 1){
            const extraData = [{campoId: 1, valor: data.description}]
            parsedData = {...parsedData, "camposAtaReuniao": extraData}
        }
        
        
        if(typeId === 2){
            const extraData = [{campoId: 2, valor: data.todayWork}, {campoId:3 , valor: data.tomorrowWork}]
            parsedData = {...parsedData, "camposAtaReuniao": extraData}
        }
    
        
        if(typeId === 3){
            const extraData = [{campoId: 4, valor: data.sprintEndDate}, {campoId:5 , valor: data.sprintReview}]
            parsedData = {...parsedData, "camposAtaReuniao": extraData}
        }
        
        if(typeId === 4){
            const extraData = [{campId: 6, valor: data.quarterStartDate}, {campoId:7 , valor: data.objective}, {campoId:8 , valor: data.keyResults}]
            parsedData = {...parsedData, "camposAtaReuniao": extraData}
        }

        return parsedData;
    }

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

        const {formData, schemaObject} = getValuesForValidation(data);

        try{
            const schema = Yup.object().shape(schemaObject)

            await schema.validate(formData, {abortEarly: false})

            const parsedData = parseData(data);

            console.log(parsedData);

            await api.post('/Atas', {
                headers:{
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                data: parsedData
            })

            
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
        setToken(getToken());
    },[])

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
                            <option>Teste</option>
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
                            onChange={(e)=> setSelectedMeetingType(e.target.value)}
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
