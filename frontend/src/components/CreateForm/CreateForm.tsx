import { useState } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';

interface CreateFormProps {
     title: string;
     inputLabel: string;
     inputName: string;
     submitButtonText: string;
     emptyFieldError: string;
     createError: string;
     storeAction: (data: any) => Promise<void>;
     loadDataAction: () => Promise<void>;
}

const CreateForm = ({
     title,
     inputLabel,
     inputName,
     submitButtonText,
     emptyFieldError,
     createError,
     storeAction,
     loadDataAction,
}: CreateFormProps) => {
     const [error, setError] = useState<string | null>(null);
     const [inputValue, setInputValue] = useState<string>('');

     const handleSubmit = async (event: React.FormEvent) => {
          event.preventDefault();
          if (!inputValue) {
               setError(emptyFieldError);
               return;
          }
          
          const newData = {
               [inputName]: inputValue,
          };
          
          try {
               await storeAction(newData);
               await loadDataAction();
               setInputValue('');
               setError(null);
          } catch (err) {
               setError(createError);
          }
     };

     return (
          <form onSubmit={handleSubmit} className={classes.createDefaultForm}>
               <h2>{title}</h2>
               <Input
                    name={inputName}
                    label={inputLabel}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={150}
               />
               
               {error && <p className={classes.createTeamForm__error}>{error}</p>}
               
               <button
                    type="submit"
                    className={classes.submit__button}
               >
                    {submitButtonText}
               </button>
          </form>
     );
};

export default CreateForm;