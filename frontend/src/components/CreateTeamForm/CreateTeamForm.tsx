import { useState } from 'react';
import { AppContext } from '../../index';
import { useContext } from 'react';
import classes from './CreateTeamForm.module.scss';

const CreateTeamForm = () => {
     const { teamStore } = useContext(AppContext);
     const [teamName, setTeamName] = useState('');
     const [error, setError] = useState<string | null>(null);

     const handleSubmit = async (event: React.FormEvent) => {
          event.preventDefault();
          if (!teamName) {
               setError("Название команды обязательно для заполнения.");
               return;
          }
          const newTeamData = {
               team_name: teamName,
          };
          try {
               await teamStore.createTeam(newTeamData);
               await teamStore.fetchTeamsWithCatainAndCoach();
               setTeamName('');
               setError(null);
          } catch (err) {
               setError('Произошла ошибка при создании команды. Попробуйте снова.');
          }
     };

     return (
          <form onSubmit={handleSubmit} className={classes.createTeamForm}>
               <div>
                    <label htmlFor="team-name" className={classes.createTeamForm__label}>
                         Название команды
                    </label>
                    <input
                         id="team-name"
                         type="text"
                         value={teamName}
                         onChange={(e) => setTeamName(e.target.value)}
                         placeholder="Введите название команды"
                         className={classes.createTeamForm__input}
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

export default CreateTeamForm;