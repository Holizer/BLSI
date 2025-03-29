import { useEffect, useState } from 'react';
import classes from './../styles/layout.module.scss';
import { toJS } from 'mobx';

// 1. Определяем тип для капитана
interface Captain {
  player_id: number;
  first_name: string;
  // Добавьте другие поля, которые приходят с API
}

const Teams = () => {
  const [captains, setCaptains] = useState<Captain[]>([]); // 2. Указываем тип состояния
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
      
  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/players/captains');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        
        const data: Captain[] = await response.json(); // 3. Указываем тип данных
        setCaptains(data);
        console.log('Полученные данные:', toJS(data));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
        console.error('Ошибка:', message);
        setError(message);
        alert(`Ошибка: ${message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaptains();
  }, []);
      
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
      
  return (
    <main className={classes.layout__container}>
      <h1>Teams</h1>
      <ul>
        {captains.map((captain) => (
          <li key={captain.player_id}>
            {captain.first_name}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Teams;