import { useState } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import { toast } from 'sonner';
import { IPlaygroundCreator } from '../../models/creators/IPlaygroundCreator';
import { useAppContext } from '../../hooks/useAppContext';

const CreatePlaygroundForm = () => {
    const { playgroundStore } = useAppContext();
    
    const [playgroundData, setPlaygroundData] = useState<IPlaygroundCreator>({
        playground_name: '',
        capacity: '',
        playground_type_id: 0,
    });
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlaygroundData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (playgroundData.playground_type_id == 0) {
            toast.warning("Пожалуйста выберите тип игровой площадки");
            return;
        }

        try {
            await playgroundStore.createPlayground(playgroundData);
            await playgroundStore.fetchPlaygrounds();

            setPlaygroundData({
                playground_name: '',
                capacity: '',
                playground_type_id: 0,
            });
        } catch (error) {
            console.error('Ошибка при создании игрока:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.createSpecialForm}>
            <h2 className={classes.form__title}>Создать новую игровую площадку</h2>
            
            <Input
                label="Название площадки"
                name="playground_name"
                type="text"
                value={playgroundData.playground_name}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                maxLength={50}
                required
            />

            <Input
                label="Вместительнось"
                name="capacity"
                type="number"
                onKeyDown={(e) => {
                    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={playgroundData.capacity}
                onChange={handleChange}
                className={classes.createTeamForm__input}
                min={0}
                max={100000}
                maxLength={5}
                required
            />


            <div className={classes.create__item}>
                <label htmlFor="playground_type" className={classes.createTeamForm__label}>
                    Тип игровой площадки
                </label>
                <Select
                    id="playground_type_id"
                    name="playground_type_id"
                    value={playgroundData.playground_type_id}
                    onChange={handleChange}
                    className={classes.createTeamForm__input}
                    options={[
                        { value: 0, label: 'Выберите тип площадки' },
                        ...playgroundStore.playground_types.map(type => ({
                            value: type.playground_type_id,
                            label: type.playground_type
                        }))
                    ]}
                />
            </div>

            <button
                type="submit"
                className={classes.submit__button}
                disabled={playgroundStore.loading}
            >
                Создать
            </button>
        </form>
    );
};

export default CreatePlaygroundForm;