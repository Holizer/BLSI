import { useState } from 'react';
import { AppContext } from '../../index';
import { useContext } from 'react';
import classes from './CreateForm.module.scss';

const CreateCityForm = () => {
     const { addressStore } = useContext(AppContext);
     const [error, setError] = useState<string | null>(null);
     const [cityName, setCityName] = useState<string>('');

     const handleSubmit = async (event: React.FormEvent) => {
          event.preventDefault();
          if (!cityName) {
               setError("Название города обязательно для заполнения.");
               return;
          }
          const newCityData = {
               city_name: cityName,
          };
          try {
               await addressStore.createCity(newCityData);
               await addressStore.loadAllAddressesData();
               setCityName('');
               setError(null);
          } catch (err) {
               setError('Произошла ошибка при создании команды. Попробуйте снова.');
          }
     };

     return (
          <form onSubmit={handleSubmit} className={classes.createTeamForm}>
               <div>
                    <label htmlFor="city-name" className={classes.createTeamForm__label}>
                         Название города
                    </label>
                    <input
                         id="city-name"
                         type="text"
                         value={cityName}
                         onChange={(e) => setCityName(e.target.value)}
                         placeholder="Введите название города"
                         className={classes.createTeamForm__input}
                    />
               </div>

               {error && <p className={classes.createTeamForm__error}>{error}</p>}

               <button
                    type="submit"
                    className={classes.createTeamForm__submit}
               >
                    Создать город
               </button>
          </form>
     );
};

export default CreateCityForm;