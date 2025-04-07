import { useAppContext } from '../../hooks/useAppContext';
import CreateForm from './CreateForm';

const CreateCityForm = () => {
     const { addressStore } = useAppContext();
     
     return (
          <CreateForm
               title="Создание города"
               inputLabel="Название города"
               inputName="city_name"
               submitButtonText="Создать"
               emptyFieldError="Название типа обязательно для заполнения."
               createError="Произошла ошибка при создании города. Попробуйте снова."
               storeAction={(data) => addressStore.createCity(data)}
               loadDataAction={() => addressStore.loadAllAddressesData()}
          />
     );
};

export default CreateCityForm;