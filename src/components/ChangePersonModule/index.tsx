import React, {useState} from 'react';
import { useEffect } from 'react';
import { ModalTemplate } from '../ModalTemplate';

interface ModalTemplateProps  {
  isOpen: boolean;
  title: string;
  onSubmit: (person:any) => void
  currentPerson?: any 
  handleCloseButton: () => void
};

// const axios = require('axios');
// axios.post('http://localhost:3000/users', {
//     id: 6,
//     first_name: 'Fred',
//     last_name: 'Blair',
//     email: 'freddyb34@gmail.com'
// }).then(resp => {
//     console.log(resp.data);
// }).catch(error => {
//     console.log(error);
// });   
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
