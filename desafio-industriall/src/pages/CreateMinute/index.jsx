import {Form} from 'reactstrap';
import {Card, Input, CardBody, Label, FormGroup} from './style'

export function CreateMinute(){

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
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        Conteúdo da Reunião                        
                        <div className="meeting-content">
                            Selecione o tipo da reunião
                        </div>  
                    </Form>
                
                </CardBody>
            </Card>
        </div>
 
    )
}