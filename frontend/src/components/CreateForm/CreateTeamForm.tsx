import CreateForm from './CreateForm';
import { useAppContext } from '../../hooks/useAppContext';

const CreateTeamForm = () => {
     const { teamStore } = useAppContext();
     
     return (
          <CreateForm
               title="Создание новой команды"
               inputLabel="Название команды"
               inputName="team_name"
               submitButtonText="Создать"
               emptyFieldError="Название типа обязательно для заполнения."
               createError="Произошла ошибка при создании команды. Попробуйте снова."
               storeAction={(data) => teamStore.createTeam(data)}
               loadDataAction={() => teamStore.loadAllTeamsData()}
          />
     );
};

export default CreateTeamForm;