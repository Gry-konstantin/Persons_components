import React, {useState} from 'react';
import { useEffect } from 'react';
import { ModalTemplate } from '../ModalTemplate';
import {IPerson} from '../../App'

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

    const isDisabledSubmitButton = () => !firstNameValue || lastNameValue || (currentPerson && firstNameValue === currentPerson.firstName)

    return(
        <ModalTemplate isOpen={isOpen} title={title} handleCloseButton={handleCloseButton} handleSubmitButton={handleSubmitButton}>
        <div className='add-profile-modal'>
            <div className="add-profile-modal_title">{title}</div>
            <input onChange={handleFirstNameField} value={firstNameValue}/>
            <input onChange={handleLastNameField} value={lastNameValue}/>
        </div>
        </ModalTemplate>
    )
};
