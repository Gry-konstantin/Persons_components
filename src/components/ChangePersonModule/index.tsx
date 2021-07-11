import React, {useState} from 'react';
import { useEffect } from 'react';
import { ModalTemplate } from '../ModalTemplate';
import {IPerson} from '../../App'
import './index.css'

interface ModalTemplateProps  {
  isOpen: boolean;
  title: string;
  onSubmit: (person:IPerson) => void
  currentPerson?: IPerson 
  handleCloseButton: () => void
};
export const ChangePersonModule: React.FC<ModalTemplateProps> = ({isOpen, title, onSubmit, currentPerson, handleCloseButton}) => {
    const [firstNameValue, setFirstNameValue] = useState<string>(currentPerson ? currentPerson.firstName : "")
    const [lastNameValue, setLastNameValue] = useState<string>(currentPerson ? currentPerson.lastName : "")
    const handleFirstNameField = (event:React.ChangeEvent<HTMLInputElement>) => {
        setFirstNameValue(event.target.value)
    }

    const handleLastNameField = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastNameValue(event.target.value)
    }

    const handleSubmitButton = () => {
        if(currentPerson) onSubmit({...currentPerson, firstName: firstNameValue, lastName: lastNameValue})
        else onSubmit({id: -1, firstName: firstNameValue, lastName: lastNameValue})
    }
    useEffect(() => {   
            setFirstNameValue(currentPerson ? currentPerson.firstName : "")
            setLastNameValue(currentPerson ? currentPerson.lastName : "")
    }, [currentPerson])
    // const isDisabledSubmitButton = () => {
    //     if(firstNameValue && lastNameValue){
    //         return false
    //     } 
    //     return true
    // }
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
            <div className="modal__title_content">{title}</div>
            <div className='modal__content'>
                <div className = "modal__title_inputs">
                    <input onChange={handleFirstNameField} value={firstNameValue}/>
                    <input onChange={handleLastNameField} value={lastNameValue}/>
                </div>
            </div>
        </ModalTemplate>
    )
};
