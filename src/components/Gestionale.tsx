import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiExternalLink, FiMonitor } from "react-icons/fi";
import { MdSportsEsports } from "react-icons/md";
import styles from "./Gestionale.module.css";

const Gestionale = () => {
	const { t } = useTranslation();

	return (
		<div id="Gestionale" className={`mb-4 mt-1 ${styles.section}`}>
			{/* ── GESTIONALE ── */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className={styles.block}
			>
				<div className={styles.labelRow}>
					<FiMonitor size={22} />
					<span>{t("gestionaleSection")}</span>
					<a href="https://www.restofull.it" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
						<FiExternalLink size={15} /> {t("visitSite")}
					</a>
				</div>
				<p className={styles.desc}>{t("gestionaleDesc")}</p>

				<div className={styles.browserFrame}>
					<div className={styles.browserBar}>
						<span className={styles.dot} style={{ background: "#ff5f57" }} />
						<span className={styles.dot} style={{ background: "#febc2e" }} />
						<span className={styles.dot} style={{ background: "#28c840" }} />
						<div className={styles.urlBar}>restofull.it</div>
					</div>
					<div className={styles.browserContent}>
						<iframe
							src="https://www.restofull.it"
							title="Restofull.it – Gestionale per ristoranti"
							className={styles.iframe}
							loading="lazy"
						/>
					</div>
				</div>
			</motion.div>

			{/* ── ARCADE ── */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.15 }}
				className={styles.block}
			>
				<div className={styles.labelRow}>
					<MdSportsEsports size={24} />
					<span>{t("arcadeSection")}</span>
					<a
						href="https://www.restofull.it/arcade"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkBtn}
					>
						<FiExternalLink size={15} /> {t("visitSite")}
					</a>
				</div>
				<p className={styles.desc}>{t("arcadeDesc")}</p>

				<div className={styles.phoneWrap}>
					<div className={styles.phone}>
						<div className={styles.phoneNotch} />
						<div className={styles.phoneScreen}>
							<iframe
								src="https://www.restofull.it/arcade"
								title="Restofull Arcade"
								className={styles.iframe}
								loading="lazy"
							/>
						</div>
						<div className={styles.phoneHome} />
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default Gestionale;
