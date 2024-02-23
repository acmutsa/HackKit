export function createPath(path:string,page:string,user:string,checkedBoxes:string){
    return `${path}?page=${page}&user=${user}&checkedBoxes=${checkedBoxes}`
}