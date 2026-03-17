// Skeleton.jsx
import styles from "./Skeleton.module.css"; // Assicurati di creare questo file di stile

const Skeleton = () => {
	return (
		<div className={styles.skeleton}>
			<div className={styles.skeletonImage}></div>
			<div className={styles.skeletonTitle}></div>
			<div className={styles.skeletonText}></div>
			<div className={styles.skeletonText}></div>
			<div className={styles.skeletonButton}></div>
		</div>
	);
};

export default Skeleton;
