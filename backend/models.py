from typing import List, Optional

from sqlalchemy import CheckConstraint, Column, Date, Double, ForeignKeyConstraint, Integer, PrimaryKeyConstraint, String, Table, Time, UniqueConstraint, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime

class Base(DeclarativeBase):
    pass


class CancellationReason(Base):
    __tablename__ = 'cancellation_reason'
    __table_args__ = (
        PrimaryKeyConstraint('cancellation_reason_id', name='cancellation_reason_pkey'),
    )

    cancellation_reason_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reason: Mapped[str] = mapped_column(String(200))

    match_status: Mapped[List['MatchStatus']] = relationship('MatchStatus', back_populates='cancellation_reason')


class Captain(Base):
    __tablename__ = 'captain'
    __table_args__ = (
        PrimaryKeyConstraint('captain_id', name='captain_pkey'),
    )

    captain_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(Integer)

    team: Mapped[List['Team']] = relationship('Team', back_populates='captain')


t_captains_view = Table(
    'captains_view', Base.metadata,
    Column('player_id', Integer),
    Column('first_name', String(50)),
    Column('last_name', String(50)),
    Column('team_id', Integer),
    Column('team_name', String(100))
)


class City(Base):
    __tablename__ = 'city'
    __table_args__ = (
        PrimaryKeyConstraint('city_id', name='city_pkey'),
    )

    city_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    city_name: Mapped[str] = mapped_column(String(150))

    address: Mapped[List['Address']] = relationship('Address', back_populates='city')


class Coach(Base):
    __tablename__ = 'coach'
    __table_args__ = (
        PrimaryKeyConstraint('coach_id', name='coach_pkey'),
    )

    coach_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))

    team: Mapped[List['Team']] = relationship('Team', back_populates='coach')


class MatchStatusType(Base):
    __tablename__ = 'match_status_type'
    __table_args__ = (
        PrimaryKeyConstraint('match_status_type_id', name='match_status_type_pkey'),
    )

    match_status_type_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_status_type: Mapped[str] = mapped_column(String(50))

    match_status: Mapped[List['MatchStatus']] = relationship('MatchStatus', back_populates='match_status_type')


class PlayerMatchStats(Base):
    __tablename__ = 'player_match_stats'
    __table_args__ = (
        PrimaryKeyConstraint('player_match_stats_id', name='player_match_stats_pkey'),
    )

    player_match_stats_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_id: Mapped[int] = mapped_column(Integer)
    scored_points: Mapped[int] = mapped_column(Integer)

    player: Mapped[List['Player']] = relationship('Player', secondary='player_player_match_stats', back_populates='player_match_stats')


class PlayerStats(Base):
    __tablename__ = 'player_stats'
    __table_args__ = (
        PrimaryKeyConstraint('player_stats_id', name='player_stats_pkey'),
    )

    player_stats_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    total_points: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    average_points: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    total_games: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    handicap: Mapped[float] = mapped_column(Double(53), server_default=text('0'))

    player_player_stats: Mapped[List['PlayerPlayerStats']] = relationship('PlayerPlayerStats', back_populates='player_stats')


t_player_team_view = Table(
    'player_team_view', Base.metadata,
    Column('player_id', Integer),
    Column('first_name', String(50)),
    Column('last_name', String(50)),
    Column('team_id', Integer),
    Column('team_name', String(100))
)


class Playground(Base):
    __tablename__ = 'playground'
    __table_args__ = (
        PrimaryKeyConstraint('playground_id', name='playground_pkey'),
    )

    playground_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    playground_name: Mapped[str] = mapped_column(String(150))
    capacity: Mapped[int] = mapped_column(Integer, server_default=text('0'))

    playground_type: Mapped[List['PlaygroundType']] = relationship('PlaygroundType', secondary='playground_playground_type', back_populates='playground')
    match: Mapped[List['Match']] = relationship('Match', back_populates='playground')


class PlaygroundType(Base):
    __tablename__ = 'playground_type'
    __table_args__ = (
        PrimaryKeyConstraint('playground_type_id', name='playground_type_pkey'),
    )

    playground_type_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    playground_type: Mapped[str] = mapped_column(String(50))

    playground: Mapped[List['Playground']] = relationship('Playground', secondary='playground_playground_type', back_populates='playground_type')


class Season(Base):
    __tablename__ = 'season'
    __table_args__ = (
        PrimaryKeyConstraint('season_id', name='season_pkey'),
    )

    season_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    start_date: Mapped[datetime.date] = mapped_column(Date)
    end_date: Mapped[datetime.date] = mapped_column(Date)

    week: Mapped[List['Week']] = relationship('Week', back_populates='season')


class TeamStats(Base):
    __tablename__ = 'team_stats'
    __table_args__ = (
        PrimaryKeyConstraint('team_stats_id', name='team_stats_pkey'),
    )

    team_stats_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    wins: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    losses: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    draws: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    total_points: Mapped[int] = mapped_column(Integer, server_default=text('0'))

    team_team_stats: Mapped[List['TeamTeamStats']] = relationship('TeamTeamStats', back_populates='team_stats')


class Address(Base):
    __tablename__ = 'address'
    __table_args__ = (
        ForeignKeyConstraint(['city_id'], ['city.city_id'], name='address_city_id_fkey'),
        PrimaryKeyConstraint('address_id', name='address_pkey')
    )

    address_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    city_id: Mapped[int] = mapped_column(Integer)
    street: Mapped[str] = mapped_column(String(150))
    house_number: Mapped[int] = mapped_column(Integer)
    postal_code: Mapped[int] = mapped_column(Integer)

    city: Mapped['City'] = relationship('City', back_populates='address')
    player: Mapped[List['Player']] = relationship('Player', back_populates='address')


class MatchStatus(Base):
    __tablename__ = 'match_status'
    __table_args__ = (
        ForeignKeyConstraint(['cancellation_reason_id'], ['cancellation_reason.cancellation_reason_id'], name='match_status_cancellation_reason_id_fkey'),
        ForeignKeyConstraint(['match_status_type_id'], ['match_status_type.match_status_type_id'], name='match_status_match_status_type_id_fkey'),
        PrimaryKeyConstraint('match_status_id', name='match_status_pkey')
    )

    match_status_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_status_type_id: Mapped[int] = mapped_column(Integer)
    cancellation_reason_id: Mapped[Optional[int]] = mapped_column(Integer)
    forfeiting_team_id: Mapped[Optional[int]] = mapped_column(Integer)

    cancellation_reason: Mapped[Optional['CancellationReason']] = relationship('CancellationReason', back_populates='match_status')
    match_status_type: Mapped['MatchStatusType'] = relationship('MatchStatusType', back_populates='match_status')
    match_info: Mapped[List['MatchInfo']] = relationship('MatchInfo', back_populates='match_status')


t_playground_playground_type = Table(
    'playground_playground_type', Base.metadata,
    Column('playground_type_id', Integer, primary_key=True, nullable=False),
    Column('playground_id', Integer, primary_key=True, nullable=False),
    ForeignKeyConstraint(['playground_id'], ['playground.playground_id'], name='playground_playground_type_playground_id_fkey'),
    ForeignKeyConstraint(['playground_type_id'], ['playground_type.playground_type_id'], name='playground_playground_type_playground_type_id_fkey'),
    PrimaryKeyConstraint('playground_type_id', 'playground_id', name='playground_playground_type_pkey')
)


class Team(Base):
    __tablename__ = 'team'
    __table_args__ = (
        ForeignKeyConstraint(['captain_id'], ['captain.captain_id'], name='team_captain_id_fkey'),
        ForeignKeyConstraint(['coach_id'], ['coach.coach_id'], name='team_coach_id_fkey'),
        PrimaryKeyConstraint('team_id', name='team_pkey'),
        UniqueConstraint('team_name', name='team_team_name_key')
    )

    team_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    team_name: Mapped[str] = mapped_column(String(100))
    captain_id: Mapped[Optional[int]] = mapped_column(Integer)
    coach_id: Mapped[Optional[int]] = mapped_column(Integer)

    captain: Mapped[Optional['Captain']] = relationship('Captain', back_populates='team')
    coach: Mapped[Optional['Coach']] = relationship('Coach', back_populates='team')
    team_match_stats: Mapped[List['TeamMatchStats']] = relationship('TeamMatchStats', secondary='team_team_match_stats', back_populates='team')
    player: Mapped[List['Player']] = relationship('Player', back_populates='team')
    team_team_stats: Mapped[List['TeamTeamStats']] = relationship('TeamTeamStats', back_populates='team')


class Week(Base):
    __tablename__ = 'week'
    __table_args__ = (
        ForeignKeyConstraint(['season_id'], ['season.season_id'], name='week_season_id_fkey'),
        PrimaryKeyConstraint('week_id', name='week_pkey')
    )

    week_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    season_id: Mapped[int] = mapped_column(Integer)
    season_name: Mapped[str] = mapped_column(String(100))
    start_date: Mapped[datetime.date] = mapped_column(Date)
    end_date: Mapped[datetime.date] = mapped_column(Date)

    season: Mapped['Season'] = relationship('Season', back_populates='week')
    match: Mapped[List['Match']] = relationship('Match', back_populates='week')


class MatchInfo(Base):
    __tablename__ = 'match_info'
    __table_args__ = (
        ForeignKeyConstraint(['match_status_id'], ['match_status.match_status_id'], name='match_info_match_status_id_fkey'),
        PrimaryKeyConstraint('match_info_id', name='match_info_pkey')
    )

    match_info_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_status_id: Mapped[int] = mapped_column(Integer)
    team1_id: Mapped[int] = mapped_column(Integer)
    team2_id: Mapped[int] = mapped_column(Integer)
    team1_points: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    team2_points: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    match_duration: Mapped[datetime.time] = mapped_column(Time, server_default=text("'00:00:00'::time without time zone"))
    event_time: Mapped[datetime.time] = mapped_column(Time)
    event_date: Mapped[datetime.date] = mapped_column(Date)
    winning_team_id: Mapped[Optional[int]] = mapped_column(Integer)
    views_count: Mapped[Optional[int]] = mapped_column(Integer, server_default=text('0'))

    match_status: Mapped['MatchStatus'] = relationship('MatchStatus', back_populates='match_info')
    match: Mapped[List['Match']] = relationship('Match', back_populates='match_info')


class Player(Base):
    __tablename__ = 'player'
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 99', name='player_age_check'),
        ForeignKeyConstraint(['address_id'], ['address.address_id'], name='player_address_id_fkey'),
        ForeignKeyConstraint(['team_id'], ['team.team_id'], name='player_team_id_fkey'),
        PrimaryKeyConstraint('player_id', name='player_pkey'),
        UniqueConstraint('phone', name='player_phone_key')
    )

    player_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    age: Mapped[int] = mapped_column(Integer, server_default=text('18'))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    address_id: Mapped[Optional[int]] = mapped_column(Integer)
    team_id: Mapped[Optional[int]] = mapped_column(Integer)

    address: Mapped[Optional['Address']] = relationship('Address', back_populates='player')
    team: Mapped[Optional['Team']] = relationship('Team', back_populates='player')
    player_match_stats: Mapped[List['PlayerMatchStats']] = relationship('PlayerMatchStats', secondary='player_player_match_stats', back_populates='player')
    player_player_stats: Mapped[List['PlayerPlayerStats']] = relationship('PlayerPlayerStats', back_populates='player')


class TeamTeamStats(Base):
    __tablename__ = 'team_team_stats'
    __table_args__ = (
        ForeignKeyConstraint(['team_id'], ['team.team_id'], name='team_team_stats_team_id_fkey'),
        ForeignKeyConstraint(['team_stats_id'], ['team_stats.team_stats_id'], name='team_team_stats_team_stats_id_fkey'),
        PrimaryKeyConstraint('team_id', 'week_id', 'season_id', name='team_team_stats_pkey')
    )

    team_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    season_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    team_stats_id: Mapped[int] = mapped_column(Integer)

    team: Mapped['Team'] = relationship('Team', back_populates='team_team_stats')
    team_stats: Mapped['TeamStats'] = relationship('TeamStats', back_populates='team_team_stats')


class Match(Base):
    __tablename__ = 'match'
    __table_args__ = (
        ForeignKeyConstraint(['match_info_id'], ['match_info.match_info_id'], name='match_match_info_id_fkey'),
        ForeignKeyConstraint(['playground_id'], ['playground.playground_id'], name='match_playground_id_fkey'),
        ForeignKeyConstraint(['week_id'], ['week.week_id'], name='match_week_id_fkey'),
        PrimaryKeyConstraint('match_id', name='match_pkey')
    )

    match_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week_id: Mapped[int] = mapped_column(Integer)
    playground_id: Mapped[int] = mapped_column(Integer)
    match_info_id: Mapped[int] = mapped_column(Integer)

    match_info: Mapped['MatchInfo'] = relationship('MatchInfo', back_populates='match')
    playground: Mapped['Playground'] = relationship('Playground', back_populates='match')
    week: Mapped['Week'] = relationship('Week', back_populates='match')
    team_match_stats: Mapped[List['TeamMatchStats']] = relationship('TeamMatchStats', back_populates='match')


t_player_player_match_stats = Table(
    'player_player_match_stats', Base.metadata,
    Column('player_match_stats_id', Integer, primary_key=True, nullable=False),
    Column('player_id', Integer, primary_key=True, nullable=False),
    ForeignKeyConstraint(['player_id'], ['player.player_id'], name='player_player_match_stats_player_id_fkey'),
    ForeignKeyConstraint(['player_match_stats_id'], ['player_match_stats.player_match_stats_id'], name='player_player_match_stats_player_match_stats_id_fkey'),
    PrimaryKeyConstraint('player_match_stats_id', 'player_id', name='player_player_match_stats_pkey')
)


class PlayerPlayerStats(Base):
    __tablename__ = 'player_player_stats'
    __table_args__ = (
        ForeignKeyConstraint(['player_id'], ['player.player_id'], name='player_player_stats_player_id_fkey'),
        ForeignKeyConstraint(['player_stats_id'], ['player_stats.player_stats_id'], name='player_player_stats_player_stats_id_fkey'),
        PrimaryKeyConstraint('player_id', 'week_id', 'season_id', name='player_player_stats_pkey')
    )

    player_stats_id: Mapped[int] = mapped_column(Integer)
    player_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    season_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    player: Mapped['Player'] = relationship('Player', back_populates='player_player_stats')
    player_stats: Mapped['PlayerStats'] = relationship('PlayerStats', back_populates='player_player_stats')


class TeamMatchStats(Base):
    __tablename__ = 'team_match_stats'
    __table_args__ = (
        ForeignKeyConstraint(['match_id'], ['match.match_id'], name='team_match_stats_match_id_fkey'),
        PrimaryKeyConstraint('team_match_stats_id', name='team_match_stats_pkey')
    )

    team_match_stats_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_id: Mapped[int] = mapped_column(Integer)
    scored_points: Mapped[int] = mapped_column(Integer)
    match_result: Mapped[str] = mapped_column(String(10))

    team: Mapped[List['Team']] = relationship('Team', secondary='team_team_match_stats', back_populates='team_match_stats')
    match: Mapped['Match'] = relationship('Match', back_populates='team_match_stats')


t_team_team_match_stats = Table(
    'team_team_match_stats', Base.metadata,
    Column('team_match_stats_id', Integer, primary_key=True, nullable=False),
    Column('team_id', Integer, primary_key=True, nullable=False),
    ForeignKeyConstraint(['team_id'], ['team.team_id'], name='team_team_match_stats_team_id_fkey'),
    ForeignKeyConstraint(['team_match_stats_id'], ['team_match_stats.team_match_stats_id'], name='team_team_match_stats_team_match_stats_id_fkey'),
    PrimaryKeyConstraint('team_match_stats_id', 'team_id', name='team_team_match_stats_pkey')
)
