import PlayerStore from './store/PlayerStore';
import TeamStore from './store/TeamStore';
import AddressStore from './store/AddressStore';
import CoachStore from './store/CoachStore';
import PlaygroundStore from './store/PlaygroundStore';
import { createContext, useMemo } from 'react';
import CancellationReasonStore from './store/CancellationReasonStore';
import MatchStore from './store/MatchStore';
import SeasonStore from './store/SeasonStore';

export interface State {
    playerStore: PlayerStore,
    teamStore: TeamStore,
    addressStore: AddressStore,
    coachStore: CoachStore,
    playgroundStore: PlaygroundStore,
    cancellationReasonStore: CancellationReasonStore,
    matchStore: MatchStore,
    seasonStore: SeasonStore,
}

const playerStore = new PlayerStore();
const teamStore = new TeamStore();
const addressStore = new AddressStore();
const coachStore = new CoachStore();
const playgroundStore = new PlaygroundStore();
const cancellationReasonStore = new CancellationReasonStore();
const matchStore = new MatchStore();
const seasonStore = new SeasonStore();

export const contextValue = {
    playerStore,
    teamStore,
    addressStore,
    coachStore,
    playgroundStore,
    cancellationReasonStore,
    matchStore,
    seasonStore,
}

export const AppContext = createContext<State>({
    playerStore,
    teamStore,
    addressStore,
    coachStore,
    playgroundStore,
    cancellationReasonStore,
    matchStore,
    seasonStore,
});