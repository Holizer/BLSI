import { AppContext } from '../../index';
import { useContext } from 'react';
import CreateForm from './CreateForm';

const CreatePlaygroundTypeForm = () => {
     const { playgroundStore } = useContext(AppContext);
     
     return (
          <CreateForm
               title="Создание нового типа игровой площадки"
               inputLabel="Тип игровой площадки"
               inputName="playground_type"
               submitButtonText="Создать тип игровой площадки"
               emptyFieldError="Название типа обязательно для заполнения."
               createError="Произошла ошибка при создании типа площадки. Попробуйте снова."
               storeAction={(data) => playgroundStore.createPlaygroundType(data)}
               loadDataAction={() => playgroundStore.fetchPlaygroundTypes()}
          />
     );
};

export default CreatePlaygroundTypeForm;