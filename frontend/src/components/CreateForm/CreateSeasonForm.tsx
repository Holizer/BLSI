import { useState } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import { useAppContext } from '../../hooks/useAppContext';
import { ISeasonCreator } from '@/models/creators/ISeasonCreator';

const CreateSeasonForm = () => {
    const { seasonStore } = useAppContext();
    
    const [seasonData, setSeasonData] = useState<ISeasonCreator>({
        season_name: '',
        season_start: '', 
        season_end: '' 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSeasonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            await seasonStore.createSeason(seasonData);
            await seasonStore.fetchSeasonWithWeeks();
        } catch (error) {
            console.error('Ошибка при создании игрока:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.createSpecialForm}>
            <h2 className={classes.form__title}>Создать нового игрока</h2>
            
            <Input
                label="Название сезона"
                name="season_name"
                type="text"
                value={seasonData.season_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={100}
                required
            />

            <div className={classes.create__item}>
                <label htmlFor="season_start" className={classes.createTeamForm__label}>
                    Начало сезона
                </label>

                <Input
                    name="season_start"
                    type="date"
                    value={seasonData.season_start}
                    onChange={handleChange}
                    className={classes.createTeamForm__input}
                    maxLength={50}
                    required
                />
            </div>

            <div className={classes.create__item}>
                <label htmlFor="season_end" className={classes.createTeamForm__label}>
                    Конец сезона
                </label>
                <Input
                    name="season_end"
                    type="date"
                    value={seasonData.season_end}
                    onChange={handleChange}
                    className={classes.createTeamForm__input}
                    maxLength={50}
                    required
                />
            </div>

            <button
                type="submit"
                className={classes.submit__button}
                disabled={seasonStore.loading}
            >
                Создать
            </button>
        </form>
    );
};

export default CreateSeasonForm;