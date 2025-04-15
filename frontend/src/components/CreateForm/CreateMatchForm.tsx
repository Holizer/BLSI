import { useState, useEffect } from 'react';
import classes from './CreateForm.module.scss';
import Input from '../../UI/Input/Input';
import Select from '../../UI/Select/Select';
import { useAppContext } from '../../hooks/useAppContext';
import { IMatchCreator } from '@/models/creators/IMatchCreator';
import { toast } from 'sonner';
import { IPlayerStat } from '@/models/player/IPlayerStat';

interface CreateMatchFormProps {
    initialStatusTypeId?: number;
}

const CreateMatchForm = ({ initialStatusTypeId = 0 }: CreateMatchFormProps) => {
    const { playerStore, teamStore, playgroundStore, cancellationReasonStore, matchStore, seasonStore } = useAppContext();

    const { statusTypes } = matchStore;
    const { cancellation_reasons } = cancellationReasonStore;
    const { playgrounds } = playgroundStore;
    const { teams } = teamStore;
    const { seasonWithWeeks } = seasonStore;
    
    const [matchData, setMatchData] = useState<IMatchCreator>({
        status_type_id: initialStatusTypeId,
        week_id: 0,
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

    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');
    const [availableWeeks, setAvailableWeeks] = useState<{value: number, label: string}[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<number>(0);
    
    //#region USE EFFECT 
    useEffect(() => {
        const load = async () => {
            await playerStore.fetchPlayerTeamView();
            await teamStore.loadAllTeamsData();
        }
        load();
    }, []);

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
                
                if (weeksOptions.length > 0) {
                    const firstWeek = selectedSeason.weeks[0];
                    setMatchData(prev => ({
                        ...prev,
                        week_id: weeksOptions[0].value
                    }));
                    setMinDate(firstWeek.week_start);
                    setMaxDate(firstWeek.week_end);
                }
            }
        } else {
            setAvailableWeeks([]);
            setMatchData(prev => ({ ...prev, week_id: 0 }));
            setMinDate('');
            setMaxDate('');
        }
    }, [selectedSeasonId, seasonStore.seasonWithWeeks]);

    useEffect(() => {
        let team1Stats: IPlayerStat[] = [];
        let team2Stats: IPlayerStat[] = [];
    
        if (matchData.team1_id > 0) {
            const team1Players = playerStore.getPlayersTeam(matchData.team1_id);
    
            team1Stats = team1Players.map((player) => ({
                player_id: player.player_id,
                scored_points: 0,
            }));
        }
    
        if (matchData.team2_id > 0) {
            const team2Players = playerStore.getPlayersTeam(matchData.team2_id);
    
            team2Stats = team2Players.map((player) => ({
                player_id: player.player_id,
                scored_points: 0,
            }));
        }
    
        const playersScore: IPlayerStat[] = [...team1Stats, ...team2Stats];

        setMatchData(prev => ({
            ...prev,
            player_stats: playersScore,
            team1_points: matchData.status_type_id === 2 ? team1Stats.reduce((sum, stat) => sum + stat.scored_points, 0) : prev.team1_points,
            team2_points: matchData.status_type_id === 2 ? team2Stats.reduce((sum, stat) => sum + stat.scored_points, 0) : prev.team2_points
        }));
    }, [matchData.team1_id, matchData.team2_id]);

    useEffect(() => {
        if (matchData.status_type_id === 2) {
            const team1Points = calculateTeamPoints(matchData.team1_id);
            const team2Points = calculateTeamPoints(matchData.team2_id);
            
            setMatchData(prev => ({
                ...prev,
                team1_points: team1Points,
                team2_points: team2Points
            }));
        }
    }, [matchData.player_stats, matchData.status_type_id]);
    //#endregion
    
    //#region HELPERS
    const calculateTeamPoints = (teamId: number) => {
        if (!teamId) return 0;
        
        const teamPlayers = playerStore.getPlayersTeam(teamId);
        return matchData.player_stats
            .filter(stat => teamPlayers.some(player => player.player_id === stat.player_id))
            .reduce((sum, stat) => sum + (stat.scored_points || 0), 0);
    };
    //#endregion

    //#region HANDLERS 
    const handlePlayerStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const playerId = Number(name.split('_')[2]);
    
        setMatchData(prev => {
            const newPlayerStats = prev.player_stats.map(stat =>
                stat.player_id === playerId
                    ? { ...stat, scored_points: Number(value) }
                    : stat
            );
            
            const shouldUpdateTeamPoints = prev.status_type_id === 2;
            
            return {
                ...prev,
                player_stats: newPlayerStats,
                team1_points: shouldUpdateTeamPoints ? calculateTeamPoints(prev.team1_id) : prev.team1_points,
                team2_points: shouldUpdateTeamPoints ? calculateTeamPoints(prev.team2_id) : prev.team2_points
            };
        });
    };
    
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

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const weekId = Number(e.target.value);
        const selectedWeek = seasonWithWeeks
            .flatMap(s => s.weeks)
            .find(w => w.week_id === weekId);

        if (selectedWeek) {
            setMinDate(selectedWeek.week_start);
            setMaxDate(selectedWeek.week_end);
            if (matchData.event_date && (
                matchData.event_date < selectedWeek.week_start || 
                matchData.event_date > selectedWeek.week_end
            )) {
                setMatchData(prev => ({ ...prev, event_date: '' }));
            }
        }

        handleChange(e);
    };

    const validate = () => {
        if (!matchData.playground_id) {
            toast.warning('Выберите площадку');
            return false;
        }
    
        if (!matchData.status_type_id) {
            toast.warning('Выберите тип матча');
            return false;
        }
    
        if (matchData.status_type_id === 3 && !matchData.cancellation_reason_id) {
            toast.warning('Для отмененного матча укажите причину');
            return false;
        }
    
        if (matchData.status_type_id === 4 && !matchData.forfeiting_team_id) {
            toast.warning('Для матча с неявкой укажите команду');
            return false;
        }
    
        if (matchData.status_type_id === 2) {
            if (matchData.team1_points === null || matchData.team2_points === null) {
                toast.warning('Для завершенного матча укажите очки обеих команд');
                return false;
            }
        }
    
        return true;
    };

    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Проверка соответствия очков команды и игроков
        if (matchData.status_type_id === 2) {
            const calculatedTeam1Points = calculateTeamPoints(matchData.team1_id);
            const calculatedTeam2Points = calculateTeamPoints(matchData.team2_id);
            
            if (matchData.team1_points !== calculatedTeam1Points || 
                matchData.team2_points !== calculatedTeam2Points) {
                toast.warning('Очки команды не соответствуют сумме очков игроков');
                return;
            }
        }

        if (!validate()) return;

        try {
            const dataToSend = [1, 3, 4].includes(matchData.status_type_id)
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
    //#endregion
    
    const showCompletedFields = matchData.status_type_id === 2;
    const showCancellationReason = matchData.status_type_id === 3;
    const showForfeitingTeam = matchData.status_type_id === 4;

    return (
        <form onSubmit={handleSubmit} className={classes.createMatchForm}>
            <h2 className={classes.form__title}>Создать новый матч</h2>
            {/* СЕЗОН */}
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
            {/* ИГРОВАЯ НЕДЕЛЯ */}
            <div className={classes.form__group}>
                <label htmlFor="week_id" className={classes.form__label}>
                    Игровая неделя
                </label>
                <Select
                    id="week_id"
                    name="week_id"
                    value={matchData.week_id}
                    onChange={handleWeekChange} 
                    className={classes.form__input}
                    disabled={availableWeeks.length === 0}
                    options={[
                        { value: 0, label: availableWeeks.length === 0 ? 'Сначала выберите сезон' : 'Выберите неделю' },
                        ...availableWeeks
                    ]}
                    required
                />
            </div>
            {/* ТИП МАТЧА */}
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
            </div>
            {/* ПРИЧИНА ОТМЕНЫ */}
            {showCancellationReason && (
                <div className={classes.form__group}>
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
                </div>  
            )}
            {/* ВЫБОР КОМАНД */}
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
                            ...teams
                                .filter(team => team.team_id !== matchData.team2_id)
                                .map(team => ({
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
                            ...teams
                                .filter(team => team.team_id !== matchData.team1_id)
                                .map(team => ({
                                    value: team.team_id,
                                    label: team.team_name
                                }))
                        ]}
                        required
                    />
                </div>
            </div>
            {/* НЕЯВКА */}
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
                        disabled={
                            !matchData.team1_id || !matchData.team2_id
                        }
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
            {/* ДАТА ПРОВЕДЕНИЯ */}
            <div className={classes.form__group}>
                <label htmlFor="event_time" className={classes.form__label}>
                    Дата проведения матча
                </label>
                <Input
                    name="event_date"
                    type="date"
                    value={matchData.event_date}
                    onChange={handleChange}
                    className={classes.form__input}
                    min={minDate}
                    max={maxDate}
                    required
                />
            </div>
            {/* ВРЕМЯ ПРОВЕДЕНИЯ(НЕ ДЛЯ ЗАВРЕШЕННЫХ МАТЧЕЙ) */}
            {!showCompletedFields && (
                <div className={classes.form__group}>
                    <label htmlFor="event_time" className={classes.form__label}>
                        Время проведения матча
                    </label>
                    <Input
                        name="event_time"
                        type="time"
                        value={matchData.event_time}
                        onChange={handleChange}
                        min={minDate}
                        max={maxDate}
                        className={classes.form__input}
                        required
                    />
                </div>
            )}
            {/* ОЧКИ КОМАНД */}
            {showCompletedFields && (
                <>
                    {matchData.team1_id > 0 && (
                        <div className={classes.firstTeamScore__wrapper}>
                            <div className={classes.teamStats}>
                                <h3 className={classes.teamTitle}>
                                    {teams.find(t => t.team_id === matchData.team1_id)?.team_name || 'Команда 1'} 
                                </h3>
                                <span className={classes.scored_points}>
                                    {matchData.team1_points || 0} очков
                                </span>
                                {playerStore.getPlayersTeam(matchData.team1_id).map(player => (
                                    <div key={`player1_${player.player_id}`} className={classes.playerStat}>
                                        <label>{player.first_name} {player.last_name}</label>
                                        <Input
                                            name={`player_stat_${player.player_id}`}
                                            type="number"
                                            maxLength={4}
                                            value={matchData.player_stats.find(stat => stat.player_id === player.player_id)?.scored_points.toString()}
                                            onChange={handlePlayerStatChange}
                                            className={classes.form__input}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {matchData.team2_id > 0 && (
                        <div className={classes.SecondTeamScore__wrapper}>
                            <div className={classes.teamStats}>
                                <h3 className={classes.teamTitle}>
                                    {teams.find(t => t.team_id === matchData.team2_id)?.team_name || 'Команда 2'}
                                </h3>
                                <span className={classes.scored_points}>
                                    {matchData.team2_points || 0} очков
                                </span>
                                {playerStore.getPlayersTeam(matchData.team2_id).map(player => (
                                    <div key={`player2_${player.player_id}`} className={classes.playerStat}>
                                        <label>{player.first_name} {player.last_name}</label>
                                        <Input
                                            name={`player_stat_${player.player_id}`}
                                            type="number"
                                            maxLength={4}
                                            value={matchData.player_stats.find(stat => stat.player_id === player.player_id)?.scored_points.toString()}
                                            onChange={handlePlayerStatChange}
                                            className={classes.form__input}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={classes.grid__box}>
                        <label htmlFor="event_time" className={classes.form__label}>
                            Время проведения матча
                        </label>
                        <label htmlFor="match_duration" className={classes.form__label}>
                            Длительность матча
                        </label>
                        <Input
                            name="event_time"
                            type="time"
                            value={matchData.event_time}
                            onChange={handleChange}
                            className={classes.form__input}
                            required
                        />
                        <Input
                            name="match_duration"
                            type="time"
                            value={matchData.match_duration || ''}
                            onChange={handleChange}
                            className={classes.form__input}
                        />
                    </div>
                    <Input
                        label="Количество просмотров"
                        name="views_count"
                        type="number"
                        maxLength={7}
                        value={matchData.views_count || ''}
                        onChange={handleChange}
                        className={classes.form__input}
                    />
                </>
            )}
            {/* ПЛОЩАДКА */}
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