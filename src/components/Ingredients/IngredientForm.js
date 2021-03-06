import React , {useState} from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
const [inputTitle, setInputTitle]=useState('');
const [inputAmount, setInputAmount]=useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: inputTitle, amount: inputAmount})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
            type="text" 
            id="title" 
            value={inputTitle} 
              onChange={e => {
                setInputTitle(e.target.value)
              }} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
            type="number" 
            id="amount" 
            value={inputAmount} 
              onChange={e => {
                setInputAmount(e.target.value)
              }} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
