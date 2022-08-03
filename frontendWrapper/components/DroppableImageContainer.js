import { Box } from '@mui/system';
import styles from '../../styles/DroppableImageContainer.module.scss';

const DroppableImageContainer = ({ image, theme }) => (
  <Box className={`${styles.box} ${theme === 'dark' ? styles.darkBox : ''}`}>
    <p className={styles.label}>
      {
        image
          ? <>Image is uploaded. <span className={styles['upload-button']}>Choose another one?</span></>
          : <><span className={styles['upload-button']}>Choose</span> or drop image here</>
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
