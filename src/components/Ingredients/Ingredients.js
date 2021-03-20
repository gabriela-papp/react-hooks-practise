import React,{useState, useEffect,useCallback, useReducer}from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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

const httpReducer=(httpState,action)=>{
  switch(action.type){
    case 'SEND':
      return {loading:true,error:null}
    case 'RESPONSE':
      return {...httpState,loading:false}
    case 'ERROR':
      return {loading:false,error : action.errorMessage}
    case 'CLEAR':
      return { ...httpState, error:null}
    default: 
     throw new Error('Error')  
  }
}

const Ingredients=()=> {
  const [ingredients,dispatch]= useReducer(ingredientReducer,[])
  const [httpState, dispatchHttp] = useReducer(httpReducer,{loading:false, error:null})
  //const [ingredients,setIngredients]=useState([])
  //const [loading,setLoading]=useState(false)
 //const [error,setError]=useState()

  const addIngredient = ingredient=>{
    dispatchHttp({type:'SEND'})
    fetch('https://hooks-udemy-3067e-default-rtdb.firebaseio.com/ingredients.json',{
      method:'POST',
      body: JSON.stringify(ingredient),
      headers:{'Content-Type':'application/json'}
    }).then(response=>{
      dispatchHttp({ type: 'RESPONSE' })
      return response.json()  
    }).then(responseData=>{
     // setIngredients(prevIngredients => [
     //   ...prevIngredients,
     //   { id: responseData.name, ...ingredient }
     // ])
     dispatch({type:'ADD',ingredient:{id:responseData.name, ...ingredient}})
    })
  }

  const filteredIngredientsHandler = useCallback(
      filteredIngredients => {
        //setIngredients(filteredIngredients)
      dispatch({ type: 'SET', ingredients: filteredIngredients})
      },[]
  ) 

  const deleteItem=(itemId)=>{
    dispatchHttp({ type: 'SEND' })
    fetch(`https://hooks-udemy-3067e-default-rtdb.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE'
    }).then(response=>{
      dispatchHttp({ type: 'RESPONSE' })
     // setIngredients(prevIngredients =>
     //   prevIngredients.filter(ingredient => ingredient.id !== itemId)
     //)
     dispatch({ type: 'DELETE', id: itemId})
    }).catch(error=>{
      dispatchHttp({ type: 'ERROR',errorMessage:'Something went wrong' })
      
    })
    }

    const clearError=()=>{
      dispatchHttp({ type: 'CLEAR' })
    }
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={deleteItem}/>
      </section>
    </div>
  );
}

export default Ingredients;
