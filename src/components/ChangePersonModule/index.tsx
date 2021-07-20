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
  onClose: () => void
};
export const ChangePersonModule: React.FC<IModalTemplateProps> = ({isOpen, title, onSubmit, currentPerson, onClose}) => {
    const [firstNameValue, setFirstNameValue] = useState<string>(currentPerson ? currentPerson.firstName : '')
    const [lastNameValue, setLastNameValue] = useState<string>(currentPerson ? currentPerson.lastName : '')
    //Добавил валидацию полей input (19,20)
    const validateNameField = (str:string) => {
        let formatStr = str.replace(/[^a-zA-ZА-Яа-яЁё]/gi, '')
        return formatStr && formatStr[0].toUpperCase() + formatStr.slice(1)
    }
    const handleNameField = (event:React.ChangeEvent<HTMLInputElement>) => {
        const formatValue = validateNameField(event.target.value)
        if (event.target.name === 'lastName') {
            setLastNameValue(formatValue)
        }else{
            setFirstNameValue(formatValue) 
        }
    }
    const clearInputs = () => {
        setFirstNameValue('')
        setLastNameValue('')
    }
    const handleSubmitButton = () => {
        if(currentPerson) onSubmit({...currentPerson, firstName: firstNameValue, lastName: lastNameValue})
        else 
            onSubmit({id: -1, firstName: firstNameValue, lastName: lastNameValue})
            // Очистка предыдущих значений добавленного сотрудника 
            clearInputs()
    }
    const handleCloseButton = () => {
        onClose()
        clearInputs()
    }
    
    useEffect(() => {   
            setFirstNameValue(currentPerson ? currentPerson.firstName : '')
            setLastNameValue(currentPerson ? currentPerson.lastName : '')
    }, [currentPerson])

    const isDisabledSubmitButton = () => {
        return !(firstNameValue && lastNameValue) || Boolean(currentPerson && currentPerson.firstName === firstNameValue &&  currentPerson.lastName === lastNameValue)
    }

    return(
        <ModalTemplate isDisabledSubmitButton = {isDisabledSubmitButton()}isOpen={isOpen} title={title} handleCloseButton={handleCloseButton} handleSubmitButton={handleSubmitButton}>
            <div className='modal__title_content'>{title}</div>
            <div className='modal__content'>
                <div className = 'modal__title_inputs'>
                    <input onChange={handleNameField} name = 'firstName' value={firstNameValue} minLength = {3} maxLength = {12}/>
                    <input onChange={handleNameField} name = 'lastName' value={lastNameValue} minLength = {3} maxLength = {16}/>
                </div>
            </div>
        </ModalTemplate>
    )
};
