import { useState, useEffect } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import { useAppContext } from '../../hooks/useAppContext';
import { IMatchCreator } from '@/models/creators/IMatchCreator';
import { toast } from 'sonner';

const CreateMatchForm = () => {
    const { teamStore, playgroundStore, cancellationReasonStore, matchStore, seasonStore } = useAppContext();

    const { statusTypes } = matchStore;
    const { cancellation_reasons } = cancellationReasonStore;
    const { playgrounds } = playgroundStore;
    const { teams } = teamStore;
    const { seasonWithWeeks } = seasonStore;
    
    const [matchData, setMatchData] = useState<IMatchCreator>({
        status_type_id: 0,
        week_id: 0, // Связь с сезоном через week_id
        playground_id: 0,
        team1_id: 0,
        team2_id: 0,
        event_date: '',
        event_time: '',
        cancellation_reason_id: null,
        forfeiting_team_id: null,
        team1_points: null,
        team2_points: null,
        views_count: null,
        match_duration: null,
        player_stats: []
    });

    const [availableWeeks, setAvailableWeeks] = useState<{value: number, label: string}[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<number>(0);

    useEffect(() => {
        matchStore.fetchMatchStatusTypes();
        playgroundStore.fetchPlaygrounds();
        teamStore.fetchTeamsList();
        cancellationReasonStore.fetchCancellationReason();
        seasonStore.fetchSeasonWithWeeks();
    }, []);

    // Обновляем список недель при изменении выбранного сезона
    useEffect(() => {
        if (selectedSeasonId > 0) {
            const selectedSeason = seasonWithWeeks.find(
                s => s.season_id === selectedSeasonId
            );
            
            if (selectedSeason) {
                const weeksOptions = selectedSeason.weeks.map(week => ({
                    value: week.week_id,
                    label: `Неделя ${week.week_number} (${week.week_start} - ${week.week_end})`
                }));
                
                setAvailableWeeks(weeksOptions);
                
                // Автоматически выбираем первую неделю сезона
                if (weeksOptions.length > 0) {
                    setMatchData(prev => ({
                        ...prev,
                        week_id: weeksOptions[0].value
                    }));
                }
            }
        } else {
            setAvailableWeeks([]);
            setMatchData(prev => ({ ...prev, week_id: 0 }));
        }
    }, [selectedSeasonId, seasonStore.seasonWithWeeks]);

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeasonId(Number(e.target.value));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMatchData(prev => ({
            ...prev,
            [name]: name === 'status_type_id' || name === 'week_id' || 
                    name === 'playground_id' || name === 'team1_id' || 
                    name === 'team2_id' || name === 'cancellation_reason_id' || 
                    name === 'forfeiting_team_id'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!matchData.status_type_id) {
            alert('Выберите тип матча');
            return;
        }
        
        if (matchData.status_type_id === 3 && !matchData.cancellation_reason_id) {
            alert('Для отмененного матча укажите причину');
            return;
        }
        
        if (matchData.status_type_id === 5 && !matchData.forfeiting_team_id) {
            alert('Для матча с неявкой укажите команду');
            return;
        }
        
        if (matchData.status_type_id === 2) {
            if (!matchData.team1_points || !matchData.team2_points) {
                alert('Для завершенного матча укажите очки обеих команд');
                return;
            }
        }
        
        try {
            const dataToSend = matchData.status_type_id === 1 || matchData.status_type_id === 3 || matchData.status_type_id === 5 
            ? {
                ...matchData,
                team1_points: null,
                team2_points: null,
                views_count: null,
                match_duration: null,
                player_stats: []
            }
            : matchData;
        
            await matchStore.createMactch(dataToSend);
            toast.success('Матч успешно создан!');
        } catch (error) {
            toast.error('Ошибка при создании матча');
            console.error(error);
        }
    };

    const showCancellationReason = matchData.status_type_id === 3;
    const showForfeitingTeam = matchData.status_type_id === 5;
    const showCompletedFields = matchData.status_type_id === 2;

    return (
        <form onSubmit={handleSubmit} className={classes.createMatchForm}>
            <h2 className={classes.form__title}>Создать новый матч</h2>
            
            <div className={classes.form__group}>
                <label htmlFor="season" className={classes.form__label}>
                    Сезон
                </label>
                <Select
                    id="season"
                    name="season"
                    value={selectedSeasonId}
                    onChange={handleSeasonChange}
                    className={classes.form__input}
                    options={[
                        { value: 0, label: 'Выберите сезон' },
                        ...seasonStore.seasonWithWeeks.map(season => ({
                            value: season.season_id,
                            label: season.season_name
                        }))
                    ]}
                    required
                />
            </div>

            <div className={classes.form__group}>
                <label htmlFor="week_id" className={classes.form__label}>
                    Игровая неделя
                </label>
                <Select
                    id="week_id"
                    name="week_id"
                    value={matchData.week_id}
                    onChange={handleChange}
                    className={classes.form__input}
                    disabled={availableWeeks.length === 0}
                    options={[
                        { value: 0, label: availableWeeks.length === 0 ? 'Сначала выберите сезон' : 'Выберите неделю' },
                        ...availableWeeks
                    ]}
                    required
                />
            </div>

            <div className={classes.form__group}>
                <label htmlFor="status_type_id" className={classes.form__label}>
                    Тип матча
                </label>
                <Select
                    id="status_type_id"
                    name="status_type_id"
                    value={matchData.status_type_id}
                    onChange={handleChange}
                    className={classes.form__input}
                    options={[
                        { value: 0, label: 'Выберите тип матча' },
                        ...(statusTypes.map(type => ({
                            value: type.match_status_type_id,
                            label: type.match_status_type
                        })) || [])
                    ]}
                    required
                />
                {showCancellationReason && (
                    <>
                        <label htmlFor="cancellation_reason_id" className={classes.form__label}>
                            Причина отмены
                        </label>
                        <Select
                            id="cancellation_reason_id"
                            name="cancellation_reason_id"
                            value={matchData.cancellation_reason_id || 0}
                            onChange={handleChange}
                            className={classes.form__input}
                            options={[
                                { value: 0, label: 'Выберите причину' },
                                ...cancellation_reasons.map(reason => ({
                                    value: reason.cancellation_reason_id,
                                    label: reason.reason
                                }))
                            ]}
                            required
                        />
                    </>
                )}
            </div>
            
            <div className={classes.form__group}>
                <label htmlFor="playground_id" className={classes.form__label}>
                    Площадка
                </label>
                <Select
                    id="playground_id"
                    name="playground_id"
                    value={matchData.playground_id}
                    onChange={handleChange}
                    className={classes.form__input}
                    disabled={playgroundStore.loading}
                    options={[
                        { value: 0, label: 'Выберите площадку' },
                        ...playgrounds.map(pg => ({
                            value: pg.playground_id,
                            label: pg.playground_name
                        }))
                    ]}
                    required
                />
            </div>

            <div className={classes.grid__box}>
                <div className={classes.form__group}>
                    <label htmlFor="team1_id" className={classes.form__label}>
                        Команда 1
                    </label>
                    <Select
                        id="team1_id"
                        name="team1_id"
                        value={matchData.team1_id}
                        onChange={handleChange}
                        className={classes.form__input}
                        disabled={teamStore.loading}
                        options={[
                            { value: 0, label: 'Выберите команду' },
                            ...teams.map(team => ({
                                value: team.team_id,
                                label: team.team_name
                            }))
                        ]}
                        required
                    />
                </div>

                <div className={classes.form__group}>
                    <label htmlFor="team2_id" className={classes.form__label}>
                        Команда 2
                    </label>
                    <Select
                        id="team2_id"
                        name="team2_id"
                        value={matchData.team2_id}
                        onChange={handleChange}
                        className={classes.form__input}
                        disabled={teamStore.loading}
                        options={[
                            { value: 0, label: 'Выберите команду' },
                            ...teams.map(team => ({
                                value: team.team_id,
                                label: team.team_name
                            }))
                        ]}
                        required
                    />
                </div>
            </div>

            <label htmlFor="event_time" className={classes.form__label}>
                Дата проведения матча
            </label>
            <Input
                name="event_date"
                type="date"
                value={matchData.event_date}
                onChange={handleChange}
                className={classes.form__input}
                required
            />
            
            <label htmlFor="event_time" className={classes.form__label}>
                Время проведения матча
            </label>
            <Input
                name="event_time"
                type="time"
                value={matchData.event_time}
                onChange={handleChange}
                className={classes.form__input}
                required
            />

            {showForfeitingTeam && (
                <div className={classes.form__group}>
                    <label htmlFor="forfeiting_team_id" className={classes.form__label}>
                        Команда, не явившаяся на матч
                    </label>
                    <Select
                        id="forfeiting_team_id"
                        name="forfeiting_team_id"
                        value={matchData.forfeiting_team_id || 0}
                        onChange={handleChange}
                        className={classes.form__input}
                        options={[
                            { value: 0, label: 'Выберите команду' },
                            { value: matchData.team1_id, label: teams.find(t => t.team_id === matchData.team1_id)?.team_name || 'Команда 1' },
                            { value: matchData.team2_id, label: teams.find(t => t.team_id === matchData.team2_id)?.team_name || 'Команда 2' }
                        ]}
                        required
                    />
                </div>
            )}

            {showCompletedFields && (
                <>
                    <Input
                        label="Очки команды 1"
                        name="team1_points"
                        type="number"
                        value={matchData.team1_points || ''}
                        onChange={handleChange}
                        className={classes.form__input}
                        required
                    />

                    <Input
                        label="Очки команды 2"
                        name="team2_points"
                        type="number"
                        value={matchData.team2_points || ''}
                        onChange={handleChange}
                        className={classes.form__input}
                        required
                    />

                    <Input
                        label="Количество просмотров"
                        name="views_count"
                        type="number"
                        value={matchData.views_count || ''}
                        onChange={handleChange}
                        className={classes.form__input}
                    />

                    <Input
                        label="Длительность матча (чч:мм)"
                        name="match_duration"
                        type="text"
                        value={matchData.match_duration || ''}
                        onChange={handleChange}
                        className={classes.form__input}
                        placeholder="01:30"
                    />
                </>
            )}

            <button
                type="submit"
                className={classes.submit__button}
                disabled={matchStore.loading}
            >
                Создать матч
            </button>
        </form>
    );
};

export default CreateMatchForm;