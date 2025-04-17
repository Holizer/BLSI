import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateCityForm from '../components/CreateForm/CreateCityForm';
import { useEffect } from 'react';
import { useCityTable } from '../configs/addresses/useCityTable';
import { useAppContext } from '../hooks/useAppContext';
import { ICity } from '@/models/address/ICity';
import { usePlayerAddressTable } from '../configs/addresses/usePlayerAddressTable';
import { IPlayerAddressView } from '../models/player/IPlayerAddressView';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { useTableSearch } from '../hooks/useTableSearch';

const Addresses = () => {
    const { addressStore } = useAppContext();
    
    const {
        handleSearch,
        getFilteredData
    } = useTableSearch();

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


    const filteredAddresses = getFilteredData(addressTableId, addressStore.playerAddresses, addressConfig);
    const filteredCities = getFilteredData(cityTableId, addressStore.cities, cityConfig);
	
	useEffect(() => {
		addressStore.loadAllAddressesData();
	}, [])

	return (
		<main className={classes.layout__container}>

			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Адреса игроков</h2>
					<Search tableId={addressTableId} onSearch={handleSearch} />
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
					data={filteredAddresses || []} // 🔍 изменено
					isEditing={isAddressEditing[addressTableId]}
                    onToggleEdit={() => toggleAddressEdit(addressTableId)}
					onEditChange={(rowIndex: number, updatedData: IPlayerAddressView) => 
						handleAddressChange(addressTableId, rowIndex, updatedData)
					}
                    onDeleteToggle={toggleAddressDelete}
                    rowsToDelete={getAddressRowsToDelete(addressTableId)}
				/>
			</div>

			<div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Города</h2>
                    <Search tableId={cityTableId} onSearch={handleSearch} />
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
                    data={filteredCities || []}
                    isEditing={isCityEditing[cityTableId]}
                    onToggleEdit={() => toggleCityEdit(cityTableId)}
					onEditChange={(rowIndex: number, updatedData: ICity) => 
						handleCityChange(cityTableId, rowIndex, updatedData)
					}
                    onDeleteToggle={toggleCityDelete}
                    rowsToDelete={getCityRowsToDelete(cityTableId)}
                />
            </div>
		</main>
	);
};

export default observer(Addresses);
