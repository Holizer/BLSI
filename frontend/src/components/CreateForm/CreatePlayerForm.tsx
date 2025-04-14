import { useState } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import { toast } from 'sonner';
import { IPlayerCreator } from '../../models/creators/IPlayerCreator';
import { useAppContext } from '../../hooks/useAppContext';

const CreatePlayerForm = () => {
    const { playerStore, teamStore, addressStore } = useAppContext();
    
    const [playerData, setPlayerData] = useState<IPlayerCreator>({
        first_name: '',
        last_name: '',
        age: 18,
        phone: '',
        street: '',
        house_number: 0,
        postal_code: 0,
        city_id: undefined,
        team_id: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlayerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const phoneRegex = /^\d{12}$/;
        if (!phoneRegex.test(playerData.phone)) {
            toast.error("Неверный формат телефона!");
            return;
        }

        if (playerData.city_id == null) {
            toast.error("Выбирете город!");
            return;
        }

        try {
            await playerStore.createPlayer(playerData);
            await playerStore.fetchPlayerTeamView();
        } catch (error) {
            console.error('Ошибка при создании игрока:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.createSpecialForm}>
            <h2 className={classes.form__title}>Создать нового игрока</h2>
            
            <Input
                label="Имя игрока"
                name="first_name"
                type="text"
                value={playerData.first_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={50}
                required
            />

            <Input
                label="Фамилия"
                name="last_name"
                type="text"
                value={playerData.last_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={50}
                required
            />

            <Input
                label="Возраст"
                name="age"
                type="number"
                value={playerData.age.toString()}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={3}
                required
            />

            <Input
                label="Телефон"
                name="phone"
                type="text"
                value={playerData.phone}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={12}
                minLength={12}
            />

            <div className={classes.grid__box}>
                <div className={classes.create__item}>
                    <label htmlFor="city_id" className={classes.createTeamForm__label}>
                        Город
                    </label>
                    <Select
                        id="city_id"
                        name="city_id"
                        value={playerData.city_id}
                        onChange={handleChange}
                        className={classes.createTeamForm__input}
                        options={[
                            { value: '', label: 'Сайлент Хилл' },
                            ...addressStore.cities.map(city => ({
                                value: city.city_id,
                                label: city.city_name
                            }))
                        ]}
                    />
                </div>

                <div className={classes.__group}>
                    <label htmlFor="street" className={classes.createTeamForm__label}>
                        Улица
                    </label>
                    <Input
                        containerClass={classes.createTeamForm__group}
                        name="street"
                        type="text"
                        value={playerData.street}
                        onChange={handleChange}
                        className={classes.createTeamForm__input}
                        maxLength={150}
                    />
                </div>
                
                <div className={classes.createTeamForm__group}>
                    <label htmlFor="house_number" className={classes.createTeamForm__label}>
                        Номер дома
                    </label>
                    <Input
                        containerClass={classes.createTeamForm__group}
                        name="house_number"
                        type="number"
                        value={playerData.house_number.toString()}
                        onChange={handleChange}
                        className={classes.createTeamForm__input}
                        required
                        maxLength={3}
                    />
                </div>

                <div className={classes.createTeamForm__group}>
                    <label htmlFor="postal_code" className={classes.createTeamForm__label}>
                        Почтовый индекс
                    </label>
                    <Input
                        containerClass={classes.createTeamForm__group}
                        name="postal_code"
                        type="number"
                        value={playerData.postal_code.toString()}
                        onChange={handleChange}
                        className={classes.createTeamForm__input}
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            <div className={classes.createTeamForm__group}>
                <label htmlFor="team_id" className={classes.createTeamForm__label}>
                    Команда
                </label>
                <Select
                    id="team_id"
                    name="team_id"
                    value={playerData.team_id || ''}
                    onChange={handleChange}
                    className={classes.createTeamForm__input}
                    disabled={teamStore.loading}
                    options={[
                        { value: '', label: 'Не выбрана' },
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
                disabled={playerStore.loading}
            >
                Создать
            </button>
        </form>
    );
};

export default CreatePlayerForm;