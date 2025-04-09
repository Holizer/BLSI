import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateCityForm from '../components/CreateForm/CreateCityForm';
import { useEffect } from 'react';
import { useCityTable } from '../configs/useCityTable';
import { useAppContext } from '../hooks/useAppContext';
import { ICity } from '@/models/ICity';
import { usePlayerAddressTable } from '../configs/usePlayerAddressTable';
import { IPlayerAddressView } from '../models/views/IPlayerAddressView';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';

const Addresses = () => {
    const { addressStore } = useAppContext();

    const {
		tableId: cityTableId,
        config: cityConfig,
        isEditing: isCityEditing,
        handleTableChange: handleCityChange,
        toggleDeleteRow: toggleCityDelete,
        toggleEditMode: toggleCityEdit,
        getRowsToDelete: getCityRowsToDelete,
        handleSave: handleCitySave,
    } = useCityTable();
	
	const {
		tableId: addressTableId,
        config: addressConfig,
        isEditing: isAddressEditing,
        handleTableChange: handleAddressChange,
        toggleDeleteRow: toggleAddressDelete,
        toggleEditMode: toggleAddressEdit,
        getRowsToDelete: getAddressRowsToDelete,
        handleSave: handleAddressSave,
	} = usePlayerAddressTable();
	
	useEffect(() => {
		addressStore.loadAllAddressesData();
	}, [])

	return (
		<main className={classes.layout__container}>

			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Адреса игроков</h2>
					<Search />
					<EditButton
						tableId={addressTableId}
                        isEditing={isAddressEditing[addressTableId]} 
                        onEdit={toggleAddressEdit} 
                        onCancel={() => toggleAddressEdit(addressTableId, false)}
                        onSave={handleAddressSave}
					/>
				</div>
				<Table
					tableId={addressTableId}
					config={addressConfig} 
					data={addressStore.playerAddresses || []}
					isEditing={isAddressEditing[addressTableId]}
                    onToggleEdit={() => toggleAddressEdit(addressTableId)}
					onEditChange={(rowIndex: number, updatedData: IPlayerAddressView) => 
						handleAddressChange(addressTableId, rowIndex, updatedData)
					}
                    onDeleteToggle={toggleCityDelete}
                    rowsToDelete={getAddressRowsToDelete(addressTableId)}
				/>
			</div>


			<div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Города</h2>
                    <Search />
                    <EditButton
						tableId={cityTableId}
                        isEditing={isCityEditing[cityTableId]} 
                        onEdit={toggleCityEdit} 
                        onCancel={() => toggleCityEdit(cityTableId, false)}
                        onSave={handleCitySave}
                    />
                    <ModalOpenButton modalItem={ <CreateCityForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table
					tableId={cityTableId}
                    config={cityConfig} 
                    data={addressStore.cities || []}
                    isEditing={isCityEditing[cityTableId]}
                    onToggleEdit={() => toggleCityEdit(cityTableId)}
					onEditChange={(rowIndex: number, updatedData: ICity) => 
						handleCityChange(cityTableId, rowIndex, updatedData)
					}
                    onDeleteToggle={toggleAddressDelete}
                    rowsToDelete={getCityRowsToDelete(cityTableId)}
                />
            </div>
		</main>
	);
};

export default observer(Addresses);