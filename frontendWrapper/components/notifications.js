import { Alert, AlertTitle, Button, Collapse } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from '../../styles/Notification.module.scss';
import { TransitionGroup } from 'react-transition-group';

const notification = {
};

const Notifications = () => {
  const [activeNotifications, setActiveNotifications] = useState([]);

  const open = ({ type, title, text, actions, time }) => {
    const key = `notification${Math.random()}`;

    setActiveNotifications([{
      key,
      content: (
        <Alert
          key={key}
          id={key}
          icon={false}
          severity={type}
          className={styles.notification}
          action={(
            <>
              {actions?.map(({ title, action }) => (
                <Button
                  key={`alertbutton${title}`}
                  onClick={action}
                  size="small"
                  color="inherit"
                >
                  {title}
                </Button>
              ))}
            </>
          )}
        >
          <AlertTitle>{title}</AlertTitle>
          {text}
        </Alert>
      ),
    }, ...activeNotifications]);

    setTimeout(() => {
      close(key);
    }, time || 5000);

    return key;
  };

  const close = key => {
    setActiveNotifications(active => active.filter(notification => notification.key !== key));
  };

  notification.open = open;
  notification.close = close;

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
