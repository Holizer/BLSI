import { useState } from 'react';
import { AppContext } from '../../index';
import { useContext } from 'react';
import classes from './CreateTeamForm.module.scss';

const CreatePlayerForm = () => {
     const { playerStore } = useContext(AppContext);
     const [error, setError] = useState<string | null>(null);

     const handleSubmit = async (event: React.FormEvent) => {
          event.preventDefault();
         
     };

     return (
          <form onSubmit={handleSubmit} className={classes.createTeamForm}>
               <div>
                    <label htmlFor="team-name" className={classes.createTeamForm__label}>
                         Название команды
                    </label>
                    <input
                       
                    />
               </div>

               {error && <p className={classes.createTeamForm__error}>{error}</p>}

               <button
                    type="submit"
                    className={classes.createTeamForm__submit}
                    >
                    Создать команду
               </button>
          </form>
     );
};

export default CreatePlayerForm;