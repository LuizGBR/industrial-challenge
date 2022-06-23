import { useCallback, useEffect, useState } from "react";
import { ListGroup} from "reactstrap";
import api from "../../services/api";
import { getToken } from "../../services/getToken"
import { sortByDate } from "../../utils/sortByDate";
import { Card, Empty, ListGroupItem } from "./style";
import {format} from 'date-fns'
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'theme-ui'

type MinuteBaseData = {
    id: number,
    titulo: string,
    local: string,
    dataInicio: string,
    dataFim: string,
    tipoReuniao: string,
}

export function MinuteList(){

    const navigate = useNavigate()

    const [resumidaMinutes, setResumidaMinutes] = useState<MinuteBaseData[]>([]);
    const [dailyScrumMinutes, setDaylyScrumMinytes] = useState<MinuteBaseData[]>([]);
    const [sprintRetrospectiveMinutes, setSprintRetrospectiveMinutes] = useState<MinuteBaseData[]>([]);
    const [okrMinutes, setOkrMinutes] = useState<MinuteBaseData[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const shouldRender = resumidaMinutes.length !== 0 || dailyScrumMinutes.length !== 0 || sprintRetrospectiveMinutes.length !== 0 || okrMinutes.length !== 0 

    const getMinutesList = useCallback(async()=>{
        const token = await getToken();
        setIsLoading(true);

        try{
            const response = await api.get('/Atas',{
                headers:{
                    Authorization: token,
                }
            })
            setSortedMinutes(response.data);
        }catch(err){
            toast.error("Erro ao carregar Ata(s).")
        }finally{
            setIsLoading(false);
        }

        
    },[])

    function setSortedMinutes(minutes: MinuteBaseData[]){
        const resumidaMinutes: MinuteBaseData[] = minutes.filter((minute) => {
            return minute.tipoReuniao === "Resumida"
        });

        const dailyScrumMinutes: MinuteBaseData[] = minutes.filter((minute) => {
            return minute.tipoReuniao === "Daily Scrum"
        });
        const sprintRetrospectiveMinutes: MinuteBaseData[] = minutes.filter((minute) => {
            return minute.tipoReuniao === "Sprint Retrospective"
        });
        const okrMinutes: MinuteBaseData[] = minutes.filter((minute) => {
            return minute.tipoReuniao === "Acompanhamento de OKRs (Objectives and Key Results)"
        });

        resumidaMinutes.sort((a,b) => sortByDate(a.dataInicio,b.dataInicio));
        dailyScrumMinutes.sort((a,b) => sortByDate(a.dataInicio,b.dataInicio));
        sprintRetrospectiveMinutes.sort((a,b) => sortByDate(a.dataInicio,b.dataInicio));
        okrMinutes.sort((a,b) => sortByDate(a.dataInicio,b.dataInicio));

        setResumidaMinutes(resumidaMinutes);
        setDaylyScrumMinytes(dailyScrumMinutes);
        setSprintRetrospectiveMinutes(sprintRetrospectiveMinutes);
        setOkrMinutes(okrMinutes);
    }

    function renderListItem(minute: MinuteBaseData){

        const minuteDate = new Date(minute.dataInicio);
        const parsedTime = format(minuteDate, 'HH:mm');
        const parsedDate = format(minuteDate, 'dd/MM/yyyy');
        return(
            <ListGroupItem key={minute.id}>
                <div>
                    <h1>{minute.titulo}</h1>
                    <p>{`${parsedDate} às ${parsedTime} na ${minute.local}`}</p>
                </div>
                <div className="buttons-section">
                    <button type="button" onClick={()=> navigate(`minute-form/${minute.id}`)}>
                        <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M11.5 2.50015C13.3387 2.49404 15.1419 3.00694 16.7021 3.97988C18.2624 4.95282 19.5164 6.34631 20.32 8.00015C18.67 11.3702 15.3 13.5002 11.5 13.5002C7.7 13.5002 4.33 11.3702 2.68 8.00015C3.48362 6.34631 4.73763 4.95282 6.29788 3.97988C7.85813 3.00694 9.66126 2.49404 11.5 2.50015ZM11.5 0.500153C6.5 0.500153 2.23 3.61015 0.5 8.00015C2.23 12.3902 6.5 15.5002 11.5 15.5002C16.5 15.5002 20.77 12.3902 22.5 8.00015C20.77 3.61015 16.5 0.500153 11.5 0.500153ZM11.5 5.50015C12.163 5.50015 12.7989 5.76354 13.2678 6.23239C13.7366 6.70123 14 7.33711 14 8.00015C14 8.66319 13.7366 9.29908 13.2678 9.76792C12.7989 10.2368 12.163 10.5002 11.5 10.5002C10.837 10.5002 10.2011 10.2368 9.73223 9.76792C9.26339 9.29908 9 8.66319 9 8.00015C9 7.33711 9.26339 6.70123 9.73223 6.23239C10.2011 5.76354 10.837 5.50015 11.5 5.50015ZM11.5 3.50015C9.02 3.50015 7 5.52015 7 8.00015C7 10.4802 9.02 12.5002 11.5 12.5002C13.98 12.5002 16 10.4802 16 8.00015C16 5.52015 13.98 3.50015 11.5 3.50015Z" fill="#5C5958"/>
                        </svg>  
                    </button>
                    <button type="button" onClick={()=>handleDelete(minute.id)}>
                        <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5 6.00015V16.0002H3.5V6.00015H11.5ZM10 0.000152588H5L4 1.00015H0.5V3.00015H14.5V1.00015H11L10 0.000152588ZM13.5 4.00015H1.5V16.0002C1.5 17.1002 2.4 18.0002 3.5 18.0002H11.5C12.6 18.0002 13.5 17.1002 13.5 16.0002V4.00015Z" fill="#5C5958"/>
                        </svg>
                    </button>
                </div>
            </ListGroupItem>
        )
    }

    async function handleDelete(id:number){
        const token = await getToken();

    
        const response = api.delete(`Atas/${id}`,{
            headers:{
                Authorization: token,
            }
        })

        toast.promise(response, {
            loading: 'Deletando Ata ...',
            success: () => {
              getMinutesList();
              return 'Ata deletada com sucesso!';            
            },
            error: 'Ocorreu um erro!',
          });
    }

    useEffect(()=>{
        getMinutesList();
    },[getMinutesList])

    return(
        <div>
            <Toaster />
            {!isLoading && shouldRender ? (
                <Card>  
                {okrMinutes.length !== 0 && (
                    <div className="minute-container">  
                        <h1>Acompanhamento de OKRs (Objectives and Key Results)</h1>
                        <ListGroup>
                            {okrMinutes.map((minute)=> renderListItem(minute))}
                        </ListGroup>
                    </div>
                )}
                {dailyScrumMinutes.length !== 0 && (
                    <div className="minute-container">
                        <h1>Daily Scrum</h1>
                        <ListGroup>
                            {dailyScrumMinutes.map((minute)=> renderListItem(minute))}
                        </ListGroup>
                    </div>
                )}
                {resumidaMinutes.length !== 0 && (
                    <div className="minute-container">
                        <h1>Resumida</h1>
                        <ListGroup>
                            {resumidaMinutes.map((minute)=> renderListItem(minute))}
                        </ListGroup>
                    </div>
                )}
                {sprintRetrospectiveMinutes.length !== 0 && (
                    <div className="minute-container">
                        <h1>Sprint Retrospective</h1>
                        <ListGroup>
                            {sprintRetrospectiveMinutes.map((minute)=> renderListItem(minute))}
                        </ListGroup>
                    </div>
                )}
            </Card>
            ) : (
                <Empty className="empty"> 
                    {isLoading ? (
                        <Spinner />
                    ):(
                        <div>
                            Parece que não há nenhuma Ata por aqui...
                        </div>
                    )}
                    
                </Empty>
            )}
            
        </div>
    )
}