import {format} from 'date-fns'

export function createDateTime(date: string, time: string){
    const dateElements = date.split('-')
    const timeElements = time.split(':')

    const parsedtDate = format(new Date(
        Number(dateElements[0]), 
        Number(dateElements[1]) - 1,
        Number(dateElements[2]),
        Number(timeElements[0]),
        Number(timeElements[1])
    ),  "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    return parsedtDate
}