import { useState } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import { useAppContext } from '../../hooks/useAppContext';
import { ICoachCreator } from '../../models/creators/ICoachCreator';

const CreateCoachForm = () => {
    const { coachStore, teamStore } = useAppContext();
    
    const [coachData, setCoachData] = useState<ICoachCreator>({
        first_name: '',
        last_name: '',
        team_id: undefined
    });
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCoachData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await coachStore.createCoach(coachData);
            await coachStore.fetchCoaches();

            setCoachData({
                first_name: '',
                last_name: '',
                team_id: undefined
            });
        } catch (error) {
            console.error('Ошибка при создании тренера:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.createSpecialForm}>
            <h2 className={classes.form__title}>Создать новую игровую площадку</h2>
            
            <Input
                label="Имя"
                name="first_name"
                type="text"
                value={coachData.first_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={50}
                required
            />

            <Input
                label="Фамилия"
                name="last_name"
                type="text"
                value={coachData.last_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={50}
                required
            />


            <div className={classes.create__item}>
                <label htmlFor="coach_team" className={classes.createTeamForm__label}>
                    Команда
                </label>
                <Select
                    id="coach_team_id"
                    name="coach_team"
                    value={coachData.team_id}
                    onChange={handleChange}
                    className={classes.createTeamForm__input}
                    options={[
                        { value: 0, label: 'Выберите команду' },
                        ...teamStore.teams.map(team => ({
                            value: team.team_id,
                            label: team.team_name
                        }))
                    ]}
                />
            </div>

            <button
                type="submit"
                className={classes.submit__button}
                disabled={coachStore.loading}
            >
                Создать
            </button>
        </form>
    );
};

export default CreateCoachForm;