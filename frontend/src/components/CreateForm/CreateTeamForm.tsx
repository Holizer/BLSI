import { AppContext } from '../../index';
import { useContext } from 'react';
import CreateForm from './CreateForm';

const CreateTeamForm = () => {
     const { teamStore } = useContext(AppContext);
     
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