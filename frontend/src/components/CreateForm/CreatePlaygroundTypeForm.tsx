import CreateForm from './CreateForm';
import { useAppContext } from '../../hooks/useAppContext';

const CreatePlaygroundTypeForm = () => {
     const { playgroundStore } = useAppContext();
     
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