import { Alert, AlertTitle } from '@mui/material';
import styles from '../../styles/Notification.module.scss';

class Notifications {
  constructor() {
    this.active = [];
  };

  open = ({ type, title, text }, callback) => {
    const key = `notification${Math.random()}`;

    this.active.push({
      key,
      content: (
        <Alert severity={type} className={styles.notification}>
          <AlertTitle>{title}</AlertTitle>
          {text}
        </Alert>
      ),
    });

    callback(this.active);

    setTimeout(() => {
      this.close(key);
      callback(this.active);
    }, 5000);
  };

  close = key => {
    this.active = this.active.filter(notification => notification.key !== key);
  };

  get = () => this.active;
};

const notifications = new Notifications();

export default notifications;