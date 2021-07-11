import React, {useEffect, useState} from 'react';
import api from "./api/persons"
import {ChangePersonModule} from './components/ChangePersonModule'
import './App.css';
import {TableRow} from './components/TableRow'
import {TableCell} from './components/TableCell'
import {PersonsTable} from './components/Table'
// import { request } from 'http';

interface IPerson  {
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
    const response = await api.get("/persons");
    return response.data;
  }

  const getChangePersonModuleTitle = ()=>{
    if (isOpenAddModal || currentEditPersonIndex !== -1){
      if(isOpenAddModal){
        return 'Создание'
      }
      return 'Редактирование'
    }else{
      return ''
    }
  }
  const changePerson = async (person:IPerson) =>{
    const personsCopy = [...persons]
    if(person.id === -1) {
      person.id = (new Date).getTime()
      // console.log({ip:(new Date).getTime(), ...person})
      const response = await api.post('/persons', person)
      personsCopy.push(person)

    } else{
      const response = await api.put(`/persons/${person.id}`, person)
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
    await api.delete(`/persons/${id}`)
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
    <div className="App">
      <PersonsTable titles = {['Имя', 'Фамилия']}>
        {persons.map((item, index) =>   
          <TableRow key = {`table-title${index}`}>
            <TableCell>firstName: {item.firstName}</TableCell> 
            <TableCell>lastName: {item.lastName}</TableCell>
            <TableCell>
              <button onClick = {() => setCurrentEditPersonIndex(index)}>edit</button>
              <button onClick = {() => removePersonHandler(item.id)}>delete</button>
            </TableCell>
          </TableRow>
        )}
      </PersonsTable>
      <ChangePersonModule isOpen={isOpenAddModal || currentEditPersonIndex !== -1} 
      title={getChangePersonModuleTitle()} 
      onSubmit ={changePerson} 
      handleCloseButton={handleChangePersonsModalCloseButton}
       currentPerson = {persons[currentEditPersonIndex]}/>
      <button
        type = 'button'
        className = ''
        onClick = {() => setIsOpenAddModal(true)}
      >
        add person
      </button>
    </div>
  );
}

export default App;
