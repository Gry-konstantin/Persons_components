import React, {useEffect, useState} from 'react';
import api from './api/persons'
import {ChangePersonModule} from './components/ChangePersonModule'
import './App.css';
import {TableRow} from './components/TableRow'
import {TableCell} from './components/TableCell'
import {PersonsTable} from './components/Table'
import 'react-notifications/lib/notifications.css';
//@ts-ignore
import {NotificationContainer, NotificationManager} from 'react-notifications';

export interface IPerson  {
  id:number;
  firstName:string;
  lastName:string;
};

const App:React.FC = () =>   {
  const [persons, setPersons] = useState<IPerson[]>([])
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false)
  const [currentEditPersonIndex, setCurrentEditPersonIndex] = useState<number>(-1)
  //Retrieve persons
  const retrieveContacts = async () => {
    const response = await api.get('/persons');
    return response.data;
  }
  const getChangePersonModuleTitle = ()=>{
    if (isOpenAddModal || currentEditPersonIndex !== -1){
      if(isOpenAddModal){
        return 'Создание сотрудника'
      }
      return 'Редактирование сотрудника'
    }else{
      return ''
    }
  }
  const renderNotification = (status:number) =>{
    switch (status) {
      case 200:
      case 201:
        NotificationManager.success('Success message', 'Успешно');
        break
      case 400:
      case 401:
        NotificationManager.error('Success message', 'Неверный запрос');
        break
      case 500:
        NotificationManager.error('Error message', 'Cерверная ошибка');
        break
    }
  }
  const changePerson = async (person:IPerson) =>{
    const personsCopy = [...persons]
    if(person.id === -1) {
      person.id = (new Date).getTime()
      const response = await api.post('/persons', person)
      renderNotification(response.status)
      personsCopy.push(person)
    } else{
      const response = await api.put(`/persons/${person.id}`, person)
      renderNotification(response.status)
      const personIndex = persons.findIndex(currentPerson => currentPerson.id === person.id)
      personsCopy.splice(personIndex, 1, person)
    }
    if(isOpenAddModal) setIsOpenAddModal(false)
    if(currentEditPersonIndex !== -1)setCurrentEditPersonIndex(-1)
    setPersons(personsCopy)
  }

  const handleChangePersonsModalCloseButton = () => {
    if(isOpenAddModal) setIsOpenAddModal(false)
    if(currentEditPersonIndex !== -1)setCurrentEditPersonIndex(-1)
  }
  const removePersonHandler = async (id:number) => {
    const response = await api.delete(`/persons/${id}`)
    renderNotification(response.status)
    const personsCopy = [...persons]
    const deletetedPersonIndex = personsCopy.findIndex((currntPerson) => currntPerson.id === id)
    personsCopy.splice(deletetedPersonIndex, 1)
    setPersons(personsCopy)
  }
  useEffect(()=>{
    const getAllPersons = async () => {
      const allPersons = await retrieveContacts();
      if (allPersons) setPersons(allPersons)
    }
    getAllPersons();
  },[])

  return (
    <div className='App'>
      <PersonsTable titles = {['Имя', 'Фамилия']}>
        {persons.map((item, index) =>   
          <TableRow key = {`table-title${index}`}>
            <TableCell>{item.firstName}</TableCell> 
            <TableCell>{item.lastName}</TableCell>
            <TableCell>
              <button className = 'btn-edit' onClick = {() => setCurrentEditPersonIndex(index)}>&#9998;</button>{/* Content button :✎*/}
              <button className = 'btn-delete' onClick = {() => removePersonHandler(item.id)}>&#10006;</button>{/* Content button :✖*/}
            </TableCell>
          </TableRow>
        )}
      </PersonsTable>
      <ChangePersonModule isOpen={isOpenAddModal || currentEditPersonIndex !== -1} 
      title={getChangePersonModuleTitle()} 
      onSubmit ={changePerson} 
      handleCloseButton={handleChangePersonsModalCloseButton}
       currentPerson = {persons[currentEditPersonIndex]}/>
      <div className = 'container'>
        <button
          type = 'button'
          className = 'btn btn-addPerson'
          onClick = {() => setIsOpenAddModal(true)}
        >
          Добавить сотрудника
        </button>
      </div>
      <NotificationContainer/>
    </div>
  );
}

export default App;
