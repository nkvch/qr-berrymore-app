import { Alert, AlertTitle, Collapse } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from '../../styles/Notification.module.scss';
import { TransitionGroup } from 'react-transition-group';

const notification = {
};

const Notifications = () => {
  const [activeNotifications, setActiveNotifications] = useState([]);

  const open = ({ type, title, text }) => {
    const key = `notification${Math.random()}`;
    console.log('alaaalalal');

    setActiveNotifications([{
      key,
      content: (
        <Alert severity={type} className={styles.notification}>
          <AlertTitle>{title}</AlertTitle>
          {text}
        </Alert>
      ),
    }, ...activeNotifications]);

    setTimeout(() => {
      close(key);
    }, 5000);
  };

  const close = key => {
    setActiveNotifications(active => active.filter(notification => notification.key !== key));
  };

  notification.open = open;

  return (
    <TransitionGroup>
      {
        activeNotifications.map(({ key, content }) => (
          <Collapse key={key}>
            {content}
          </Collapse>
        ))
      }
    </TransitionGroup>
  )
};

export { notification };

export default Notifications;
