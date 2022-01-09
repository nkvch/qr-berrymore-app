import Image from 'next/image';
import { Box } from '@mui/system';
import styles from '../../styles/DroppableImageContainer.module.scss';

const DroppableImageContainer = ({ file }) => (
  <Box className={styles.box}>
    <p className={styles.label}>
      {
        file
        ? <>Фотография заружена. <span className={styles['upload-button']}>Выбрать другую?</span></>
        : <><span className={styles['upload-button']}>Выберите</span> или перетащите сюда фотографию</>
      }
    </p>
    {
      file && (
        <img
          className={styles.image}
          src={URL.createObjectURL(file)}
        />
      )
    }
  </Box>
);

export default DroppableImageContainer;
