import React,{useState, useEffect,useCallback, useReducer}from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action)=>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing=>ing.id !== action.id)
    default:
      throw new Error('Error')
  }
}

const Ingredients=()=> {
  const [ingredients,dispatch]= useReducer(ingredientReducer,[])
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifier, clear} = useHttp()

  useEffect(()=>{
    if (!isLoading && reqIdentifier === 'REMOVE_IGREDIENT'){
      dispatch({type:'DELETE', id:reqExtra})
    } else if (!isLoading && !error && reqIdentifier === 'ADD_IGREDIENT'){
      dispatch({
        type: 'ADD', ingredient: {
          id: data.name, ...reqExtra
      }})
    }
  },[data,reqExtra, reqIdentifier,isLoading, error])

  const addIngredient = useCallback(ingredient=>{
  
  sendRequest('https://hooks-udemy-3067e-default-rtdb.firebaseio.com/ingredients.json','POST', JSON.stringify(ingredient),
  ingredient,
   'ADD_IGREDIENT' 
  )
  }, [sendRequest])

  const filteredIngredientsHandler = useCallback(
      filteredIngredients => {
      dispatch({ type: 'SET', ingredients: filteredIngredients})
      },[]
  ) 

  const deleteItem=useCallback((itemId)=>{
    sendRequest(`https://hooks-udemy-3067e-default-rtdb.firebaseio.com/ingredients/${itemId}.json`, 'DELETE', null, itemId,'REMOVE_IGREDIENT')
   
  }, [sendRequest]) 

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={deleteItem}/>
      </section>
    </div>
  );
}

export default Ingredients;
