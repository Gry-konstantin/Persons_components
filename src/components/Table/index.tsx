import React from 'react';
import './index.css';

interface IProps {
    titles:string[]
}


export const PersonsTable: React.FC<IProps> = ({children, titles}) => {
    return (
    <div className='table'>
        <div className= 'table__header'>
            <div className = 'table__row_header'>
                {titles.map((title, index) => <div key= {`table-title${index}`}className= 'table__cell_header'>{title}</div>)}
            </div>
        </div>
        <div className= 'table__tbody'>
            {children}
        </div>
    </div>
    )
}