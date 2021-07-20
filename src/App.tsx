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
        default: toast.error('Соединение с сервором отсутствует')
    }
  }
  const getChangePersonModuleTitle = ()=>{
    if (isOpenAddModal || currentEditPersonIndex !== -1){
      if(isOpenAddModal){
        return 'Создание сотрудника'
      }
      return 'Редактирование сотрудника'
    }
      return ''
  }
  const changePerson = async (person:IPerson) =>{
    const personsCopy = [...persons]
    handleChangePersonsModalCloseButton()
    try {
      if(person.id === -1) {
        const personCopy = {...person}
        //Добавил переменную для id
        const currentId = new Date().getTime();
        personCopy.id = currentId;
        const response = await api.post('/persons', personCopy)
        renderNotification(response.status)
        personsCopy.push(personCopy)
      } else{
        const response = await api.put(`/persons/${person.id}`, person)
        renderNotification(response.status)
        const personIndex = persons.findIndex(currentPerson => currentPerson.id === person.id)
        personsCopy.splice(personIndex, 1, person)
      }
      setPersons(personsCopy)
    }
    catch(error){
      renderNotification(error.response || -1)
    }
  }
  const handleChangePersonsModalCloseButton = () => {
    if(isOpenAddModal) setIsOpenAddModal(false)
    if(currentEditPersonIndex !== -1)setCurrentEditPersonIndex(-1)
  }
  const removePersonHandler = async (id:number) => {
    try{
      const response = await api.delete(`/persons/${id}`)
      renderNotification(response.status)
      const personsCopy = [...persons]
      const deletetedPersonIndex = personsCopy.findIndex((currntPerson) => currntPerson.id === id)
      personsCopy.splice(deletetedPersonIndex, 1)
      setPersons(personsCopy)
    }
    catch(error){
      renderNotification(error.response || -1)
    }
  }

  useEffect(()=>{
    api.get('/persons')
    .then(response => { 
      SetIsDisabledAddButton(false)
        const allPersons = response.data
        setPersons(allPersons)
        // return response.data
    }) 
    .catch(err => { 
      renderNotification(err.response || -1)
    })
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
        onClose = {handleChangePersonsModalCloseButton}
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
