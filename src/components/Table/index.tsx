import { table } from "console"
import React from "react"
import {TableRow} from '../TableRow'
import { TableCell } from "../TableCell"

interface IProps {
    titles:string[]
}


export const PersonsTable: React.FC<IProps> = ({children, titles}) => {
    return (
    <table className="table">
        <thead className= "table__header">
            <tr className = "table__row_header">
                {titles.map((title, index) => <th key= {`table-title${index}`}className= 'table__cell_header'>{title}</th>)}
            </tr>
        </thead>
        <tbody className= 'table__tbody'>
            {children}
        </tbody>
    </table>
    )
}