from typing import List, Optional

from sqlalchemy import CheckConstraint, Column, DateTime, Double, ForeignKeyConstraint, Integer, PrimaryKeyConstraint, String, Table, UniqueConstraint, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime

class Base(DeclarativeBase):
    pass


class Auditlog(Base):
    __tablename__ = 'auditlog'
    __table_args__ = (
        PrimaryKeyConstraint('logid', name='auditlog_pkey'),
    )

    logid: Mapped[int] = mapped_column(Integer, primary_key=True)
    actiontime: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    actiontype: Mapped[Optional[str]] = mapped_column(String(50))
    playerid: Mapped[Optional[int]] = mapped_column(Integer)
    playername: Mapped[Optional[str]] = mapped_column(String(100))


class City(Base):
    __tablename__ = 'city'
    __table_args__ = (
        PrimaryKeyConstraint('cityid', name='city_pkey'),
    )

    cityid: Mapped[int] = mapped_column(Integer, primary_key=True)
    cityname: Mapped[str] = mapped_column(String(150))

    address: Mapped[List['Address']] = relationship('Address', back_populates='city')


class Playerlog(Base):
    __tablename__ = 'playerlog'
    __table_args__ = (
        PrimaryKeyConstraint('logid', name='playerlog_pkey'),
    )

    logid: Mapped[int] = mapped_column(Integer, primary_key=True)
    playerid: Mapped[int] = mapped_column(Integer)
    action: Mapped[str] = mapped_column(String(50))
    actiondate: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))


class Playerstats(Base):
    __tablename__ = 'playerstats'
    __table_args__ = (
        PrimaryKeyConstraint('playerstatsid', name='playerstats_pkey'),
    )

    playerstatsid: Mapped[int] = mapped_column(Integer, primary_key=True)
    totalpoints: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    averagepoints: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    totalgames: Mapped[int] = mapped_column(Integer, server_default=text('0'))
    handicap: Mapped[float] = mapped_column(Double(53), server_default=text('0'))
    bestgame: Mapped[Optional[int]] = mapped_column(Integer)
    bestseries: Mapped[Optional[int]] = mapped_column(Integer)

    player_playerstats: Mapped[List['PlayerPlayerstats']] = relationship('PlayerPlayerstats', back_populates='playerstats')


t_view_address_city = Table(
    'view_address_city', Base.metadata,
    Column('addressid', Integer),
    Column('cityname', String(150)),
    Column('street', String(150)),
    Column('housenumber', Integer),
    Column('postalcode', Integer)
)


t_view_player_address = Table(
    'view_player_address', Base.metadata,
    Column('playerid', Integer),
    Column('firstname', String(50)),
    Column('lastname', String(50)),
    Column('cityname', String(150)),
    Column('street', String(150)),
    Column('housenumber', Integer),
    Column('postalcode', Integer)
)


t_view_player_team = Table(
    'view_player_team', Base.metadata,
    Column('playerid', Integer),
    Column('firstname', String(50)),
    Column('lastname', String(50)),
    Column('phone', String(20)),
    Column('age', Integer),
    Column('teamid', Integer)
)


class Address(Base):
    __tablename__ = 'address'
    __table_args__ = (
        ForeignKeyConstraint(['cityid'], ['city.cityid'], name='address_cityid_fkey'),
        PrimaryKeyConstraint('addressid', name='address_pkey')
    )

    addressid: Mapped[int] = mapped_column(Integer, primary_key=True)
    cityid: Mapped[int] = mapped_column(Integer)
    street: Mapped[str] = mapped_column(String(150))
    housenumber: Mapped[int] = mapped_column(Integer)
    postalcode: Mapped[int] = mapped_column(Integer)

    city: Mapped['City'] = relationship('City', back_populates='address')
    player: Mapped[List['Player']] = relationship('Player', back_populates='address')


class Player(Base):
    __tablename__ = 'player'
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 99', name='player_age_check'),
        CheckConstraint("phone::text ~~ '+%%'::text AND length(phone::text) >= 7 AND length(phone::text) <= 15", name='player_phone_check'),
        ForeignKeyConstraint(['addressid'], ['address.addressid'], name='player_addressid_fkey'),
        PrimaryKeyConstraint('playerid', name='player_pkey'),
        UniqueConstraint('phone', name='player_phone_key')
    )

    playerid: Mapped[int] = mapped_column(Integer, primary_key=True)
    firstname: Mapped[str] = mapped_column(String(50))
    lastname: Mapped[str] = mapped_column(String(50))
    age: Mapped[int] = mapped_column(Integer, server_default=text('18'))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    addressid: Mapped[Optional[int]] = mapped_column(Integer)
    teamid: Mapped[Optional[int]] = mapped_column(Integer)

    address: Mapped[Optional['Address']] = relationship('Address', back_populates='player')
    player_playerstats: Mapped[List['PlayerPlayerstats']] = relationship('PlayerPlayerstats', back_populates='player')


class PlayerPlayerstats(Base):
    __tablename__ = 'player_playerstats'
    __table_args__ = (
        ForeignKeyConstraint(['playerid'], ['player.playerid'], name='player_playerstats_playerid_fkey'),
        ForeignKeyConstraint(['playerstatsid'], ['playerstats.playerstatsid'], name='player_playerstats_playerstatsid_fkey'),
        PrimaryKeyConstraint('playerid', 'playerstatsid', name='player_playerstats_pkey')
    )

    playerstatsid: Mapped[int] = mapped_column(Integer, primary_key=True)
    playerid: Mapped[int] = mapped_column(Integer, primary_key=True)
    gameweekid: Mapped[int] = mapped_column(Integer)

    player: Mapped['Player'] = relationship('Player', back_populates='player_playerstats')
    playerstats: Mapped['Playerstats'] = relationship('Playerstats', back_populates='player_playerstats')
