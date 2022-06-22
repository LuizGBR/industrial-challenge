export function sortByDate(a: string, b: string){
    const aDate = new Date(a);
    const bDate = new Date(b)
    
    return bDate.getTime() - aDate.getTime() 
}