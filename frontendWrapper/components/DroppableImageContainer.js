import { Box } from '@mui/system';
import styles from '../../styles/DroppableImageContainer.module.scss';

const DroppableImageContainer = ({ image, theme }) => (
  <Box className={`${styles.box} ${theme === 'dark' ? styles.darkBox : ''}`}>
    <p className={styles.label}>
      {
        image
          ? <>Фотография заружена. <span className={styles['upload-button']}>Выбрать другую?</span></>
          : <><span className={styles['upload-button']}>Выберите</span> или перетащите сюда фотографию</>
      }
    </p>
    {
      image && (
        <img
          className={styles.image}
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
        />
      )
    }
  </Box>
);

export default DroppableImageContainer;
