import Image from 'next/image';
import { Box } from '@mui/system';
import styles from '../../styles/DroppableImageContainer.module.scss';

const DroppableImageContainer = ({ file }) => (
  <Box className={styles.box}>
    <p className={styles.label}>
      {
        file
        ? 'Фотография заружена'
        : 'Загрузите или перетащите сюда фотографию'
      }
    </p>
    {
      file && (
        <img
          src={URL.createObjectURL(file)}
        />
      )
    }
  </Box>
);

export default DroppableImageContainer;
