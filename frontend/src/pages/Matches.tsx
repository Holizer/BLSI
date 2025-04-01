import { observer } from 'mobx-react-lite';
import classes from './../styles/layout.module.scss'

const Matches = () => {
      return (
            <main className={classes.layout__container}>
                  <h1>Matches</h1>
            </main>
      )
}

export default observer(Matches);