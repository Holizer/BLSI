import CreateForm from './CreateForm';
import { useAppContext } from '../../hooks/useAppContext';

const CreateCancellationReasonForm = () => {
     const { cancellationReasonStore } = useAppContext();
     
     return (
          <CreateForm
               title="Создание причины отмены матча"
               inputLabel="Причниа"
               inputName="reason"
               submitButtonText="Создать"
               emptyFieldError="Поле обязательно для заполнения."
               createError="Произошла ошибка при создании причины. Попробуйте снова."
               storeAction={(data) => cancellationReasonStore.createCancellationReason(data)}
               loadDataAction={() => cancellationReasonStore.fetchCancellationReason()}
          />
     );
};

export default CreateCancellationReasonForm;