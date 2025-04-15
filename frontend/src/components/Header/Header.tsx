import { toast } from 'sonner';
import Select from '../../UI/Select/Select';
import { useAppContext } from '../../hooks/useAppContext';
import classes from './Header.module.scss';
import { observer } from 'mobx-react-lite';

const Header = () => {
    const { seasonStore } = useAppContext();

    const currentSeason = seasonStore.activeSeason;
    
    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const seasonId = Number(e.target.value);
        seasonStore.setSelectedSeason(seasonId);
    };

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const weekId = value === 'all' ? undefined : Number(value);
        seasonStore.setSelectedWeek(weekId);
    };

    const seasonOptions = seasonStore.seasonWithWeeks.map(season => ({
        value: season.season_id,
        label: season.season_name
    }));

    const weekOptions = [
        { value: 'all', label: 'Все недели' },
        ...(currentSeason?.weeks?.map(week => ({
            value: week.week_id,
            label: `Неделя ${week.week_number}`
        })) || [])
    ];

    return (
        <header>
            <div className={classes.titleContainer}>
                <h1 className={classes.title}>Информационная система кегельной лиги</h1>
            </div>
            <div className={classes.selectionGroup}>
                <Select
                    options={seasonOptions}
                    value={seasonStore.selectedSeasonId || ''}
                    onChange={handleSeasonChange}
                    containerClass={classes.selectContainer}
                />
                <Select
                    options={weekOptions}
                    value={seasonStore.selectedWeekId === undefined ? 'all' : seasonStore.selectedWeekId || ''}
                    onChange={handleWeekChange}
                    disabled={!currentSeason}
                    containerClass={classes.selectContainer}
                />
            </div>
        </header>
    );
};

export default observer(Header);