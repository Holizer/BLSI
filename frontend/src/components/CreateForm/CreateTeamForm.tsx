import { useState } from 'react';
import { AppContext } from '../../index';
import { useContext } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';

const CreateTeamForm = () => {
     const { teamStore } = useContext(AppContext);
     const [teamName, setTeamName] = useState<string>('');
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
               await teamStore.loadAllTeamsData();
               setTeamName('');
               setError(null);
          } catch (err) {
               setError('Произошла ошибка при создании команды. Попробуйте снова.');
          }
     };

     return (
          <form onSubmit={handleSubmit} className={classes.createDefaultForm}>
               <h2>Создание команды</h2>
               <Input
                    name="team-name"
                    label='Название команды'
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    maxLength={150}
               />

               {error && <p className={classes.createTeamForm__error}>{error}</p>}

               <button
                    type="submit"
                    className={classes.submit__button}
                    >
                    Создать команду
               </button>
          </form>
     );
};

export default CreateTeamForm;