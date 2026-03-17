import PropTypes from "prop-types";
import { Badge, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";
import styles from "./Portfolio.module.css";

const RepoCard = ({ repo, isHovered, isTouchDevice, onHover, onLeave, formatDate }) => {
	if (!repo) {
		return <Skeleton />;
	}
	return (
		<div
			className={`${styles.cardprt} ${isHovered ? "expandedCard" : ""}`}
			onMouseEnter={!isTouchDevice ? onHover : undefined}
			onMouseLeave={!isTouchDevice ? onLeave : undefined}
		>
			<Card className={`${styles.cardprt} border-0 my-bg h-100 position-relative`}>
				<Card.Img src="/img/placeholder.png" alt={repo.name} className="rounded-0" />
				<Card.Body>
					<Card.Title className="fs-4 text-truncate">{repo.name}</Card.Title>
					{isTouchDevice || isHovered ? (
						<motion.div
							initial={isTouchDevice ? {} : { maxHeight: 0, opacity: 0 }}
							animate={{ maxHeight: [0, 250], opacity: 1 }}
							transition={{ duration: 0.2, times: [0, 0.8, 1] }}
							className={styles.additionalContent}
						>
							<Card.Text className="fs-6 text-truncate">{repo.description || "No description available"}</Card.Text>
							<div className="d-flex flex-column align-items-center justify-content-center">
								<Badge className={`${styles.myBadgeCreate} text-black`}>
									First Commit: {formatDate && formatDate(repo.created_at)}
								</Badge>
								<Badge className={`${styles.myBadgeUpdate} text-black`}>
									Last Update: {formatDate && formatDate(repo.pushed_at)}
								</Badge>
							</div>
						</motion.div>
					) : null}
				</Card.Body>
			</Card>
		</div>
	);
};

RepoCard.propTypes = {
	repo: PropTypes.object.isRequired,
	isHovered: PropTypes.bool.isRequired,
	isTouchDevice: PropTypes.bool.isRequired,
	onHover: PropTypes.func.isRequired,
	onLeave: PropTypes.func.isRequired,
	formatDate: PropTypes.func.isRequired,
};

export default RepoCard;
