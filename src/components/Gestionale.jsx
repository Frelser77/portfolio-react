import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const Gestionale = () => {
	const { t } = useTranslation();

	return (
		<div id="Gestionale" className="my-4">
			<h4 className="text-center section-title">{t("gestionaleSection")}</h4>
			<p className="text-center mb-4 px-2" style={{ maxWidth: "700px", margin: "0 auto 1.5rem" }}>
				{t("gestionaleDesc")}
			</p>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<div
					style={{
						position: "relative",
						width: "100%",
						paddingTop: "56.25%",
						borderRadius: "12px",
						overflow: "hidden",
						border: "2px solid var(--primary-color)",
						boxShadow: "0 4px 24px rgba(113,99,212,0.25)",
					}}
				>
					<iframe
						src="https://www.restofull.it"
						title="Restofull.it – Gestionale per ristoranti"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							border: "none",
						}}
						loading="lazy"
					/>
				</div>

				<div className="text-center mt-3">
					<a
						href="https://www.restofull.it"
						target="_blank"
						rel="noopener noreferrer"
						className="btn d-inline-flex align-items-center gap-2"
						style={{
							backgroundColor: "var(--primary-color)",
							borderColor: "var(--primary-color)",
							color: "#fff",
							borderRadius: "8px",
							padding: "0.5rem 1.4rem",
							fontWeight: 600,
						}}
					>
						<FiExternalLink size={18} />
						{t("visitSite")}
					</a>
				</div>
			</motion.div>
		</div>
	);
};

export default Gestionale;
