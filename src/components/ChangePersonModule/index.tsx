import React, {useState} from 'react';
import { useEffect } from 'react';
import { ModalTemplate } from '../ModalTemplate';
import {IPerson} from '../../App'
import './index.css'

interface IModalTemplateProps  {
  isOpen: boolean;
  title: string;
  onSubmit: (person:IPerson) => void
  currentPerson?: IPerson 
  handleCloseButton: () => void
};
export const ChangePersonModule: React.FC<IModalTemplateProps> = ({isOpen, title, onSubmit, currentPerson, handleCloseButton}) => {
    const [firstNameValue, setFirstNameValue] = useState<string>(currentPerson ? currentPerson.firstName : '')
    const [lastNameValue, setLastNameValue] = useState<string>(currentPerson ? currentPerson.lastName : '')
    //Добавил валидацию полей input (19,20,25,26)
    const handleFirstNameField = (event:React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value[0].toUpperCase() + event.target.value.slice(1);
        event.target.value = event.target.value.replace(/[^a-zA-ZА-Яа-яЁё]/gi, '')
        setFirstNameValue(event.target.value)
    }

    const handleLastNameField = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value[0].toUpperCase() + event.target.value.slice(1);
        event.target.value = event.target.value.replace(/[^a-zA-ZА-Яа-яЁё]/gi, '')
        setLastNameValue(event.target.value)
    }

    const handleSubmitButton = () => {
        if(currentPerson) onSubmit({...currentPerson, firstName: firstNameValue, lastName: lastNameValue})
        else {
            onSubmit({id: -1, firstName: firstNameValue, lastName: lastNameValue})
            // Очистка предыдущих значений добавленного сотрудника 
            setFirstNameValue('')
            setLastNameValue('')
        }
    }
    useEffect(() => {   
            setFirstNameValue(currentPerson ? currentPerson.firstName : '')
            setLastNameValue(currentPerson ? currentPerson.lastName : '')
    }, [currentPerson])
    const isDisabledSubmitButton = () => {
        if((currentPerson && currentPerson.firstName === firstNameValue)&&(currentPerson && currentPerson.lastName === lastNameValue)){
            return true
        }
        if(firstNameValue && lastNameValue){
            return false
        }
        return true
    }

    return(
        <ModalTemplate isDisabledSubmitButton = {isDisabledSubmitButton()}isOpen={isOpen} title={title} handleCloseButton={handleCloseButton} handleSubmitButton={handleSubmitButton}>
            <div className='modal__title_content'>{title}</div>
            <div className='modal__content'>
                <div className = 'modal__title_inputs'>
                    <input onChange={handleFirstNameField} value={firstNameValue} minLength = {3} maxLength = {12}/>
                    <input onChange={handleLastNameField} value={lastNameValue} minLength = {3} maxLength = {16}/>
                </div>
            </div>
        </ModalTemplate>
    )
};
