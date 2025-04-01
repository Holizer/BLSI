import { useState } from 'react';
import { AppContext } from '../../index';
import { useContext } from 'react';
import classes from './CreateForm.module.scss';

const CreateCoachForm = () => {
    const { teamStore } = useContext(AppContext);
    const [coachName, setCoachName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!coachName) {
            setError("Имя тренера обязательно для заполнения.");
            return;
        }

        try {
            // Создаем тренера
          //   const newCoach = await coachStore.createCoach({ name: coachName });
            
            // Если выбрана команда, назначаем тренера
            if (selectedTeamId) {
               // await teamStore.assignCoachToTeam(selectedTeamId, newCoach.id);
            }
            
            // Обновляем данные
          //   await teamStore.loadAllTeamsData();
            
            // Сбрасываем форму и показываем сообщение об успехе
            setCoachName('');
            setSelectedTeamId(null);
            setError(null);
            setSuccess('Тренер успешно создан' + (selectedTeamId ? ' и назначен команде' : ''));
            
            // Через 3 секунды убираем сообщение об успехе
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Произошла ошибка при создании тренера. Попробуйте снова.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.createTeamForm}>
            <h2 className={classes.createTeamForm__title}>Создать тренера</h2>
            
            <div className={classes.createTeamForm__group}>
                <label htmlFor="coach-name" className={classes.createTeamForm__label}>
                    Имя тренера
                </label>
                <input
                    id="coach-name"
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    placeholder="Введите имя тренера"
                    className={classes.createTeamForm__input}
                />
            </div>

            <div className={classes.createTeamForm__group}>
                <label htmlFor="team-select" className={classes.createTeamForm__label}>
                    Назначить команду (необязательно)
                </label>
                <select
                    id="team-select"
                    value={selectedTeamId || ''}
                    onChange={(e) => setSelectedTeamId(e.target.value || null)}
                    className={classes.createTeamForm__select}
                >
                    <option value="">-- Выберите команду --</option>
                    {teamStore.teams.map(team => (
                        <option key={team.team_id} value={team.team_id}>
                            {team.team_name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className={classes.createTeamForm__error}>{error}</p>}
            {success && <p className={classes.createTeamForm__success}>{success}</p>}

            <button
                type="submit"
                className={classes.createTeamForm__submit}
            >
                Создать тренера
            </button>
        </form>
    );
};

export default CreateCoachForm;