import React, {useEffect, useState} from 'react';
import api from './api';
import {ChangePersonModule} from './components/ChangePersonModule';
import './App.css';
import {TableRow} from './components/TableRow';
import {TableCell} from './components/TableCell';
import {PersonsTable} from './components/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IPerson  {
  id:number;
  firstName:string;
  lastName:string;
};

const App:React.FC = () =>   {
  const [persons, setPersons] = useState<IPerson[]>([])
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false)
  const [currentEditPersonIndex, setCurrentEditPersonIndex] = useState<number>(-1)
  const [isDisabledAddButton, SetIsDisabledAddButton] = useState<boolean>(true)
  const renderNotification = (status:number) =>{
    switch (status) {
      case 200:
      case 201:
        toast.success('Успешное действие');
        break
      case 400:
      case 401:
        toast.error('Неверный запрос');
        break
      case 500:
        toast.error('Cерверная ошибка');
        break
    }
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
  const changePerson = async (person:IPerson) =>{
    const personsCopy = [...persons]
    if(person.id === -1) {
      //Добавил переменную для id
      const currentId = (new Date()).getTime();
      person.id = currentId;
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

      const retrieveContacts = async () => {
        //Обработка запроса
        toast.info('Проверка соединения с сервером');
    
        const response = await api.get('/persons')
    
        .then(response => { 
          SetIsDisabledAddButton(false)
          toast.success('Соединение с сервером установлено');
           return response.data
        }) 
        .catch(err => { 
          if (err.response) { 
            renderNotification(err.response)
          } else if (err.request) { 
            toast.error('Отсутствует соединение с сервером');
          } else { 
            toast.error('Другая ошибка');
          } 
        })
        return response;
      }

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
        currentPerson = {persons[currentEditPersonIndex]}
       />
      <div className = 'container'>
        <button
          type = 'button'
          className = 'btn btn-addPerson'
          onClick = {() => setIsOpenAddModal(true)}
          disabled = {isDisabledAddButton}
        >
          Добавить сотрудника
        </button>
      </div>
      <ToastContainer
        autoClose={3000}
        />
    </div>
  );
}

export default App;
