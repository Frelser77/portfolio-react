import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
	return (
		<div className="d-flex align-items-center justify-content-center mt-5">
			<div className={styles.loader}></div>
		</div>
	);
};

export default Loading;
