import { motion } from "framer-motion";
import Skeleton from "./Skeleton";
import styles from "./Portfolio.module.css";
import type { Repo } from "../types";

interface RepoCardProps {
	repo: Repo;
	isHovered: boolean;
	isTouchDevice: boolean;
	onHover: () => void;
	onLeave: () => void;
	formatDate: (date: string) => string;
}

const RepoCard = ({ repo, isHovered, isTouchDevice, onHover, onLeave, formatDate }: RepoCardProps) => {
	if (!repo) return <Skeleton />;
	return (
		<div
			className={`${styles.cardprt} ${isHovered ? "expandedCard" : ""}`}
			onMouseEnter={!isTouchDevice ? onHover : undefined}
			onMouseLeave={!isTouchDevice ? onLeave : undefined}
		>
			<div className={`${styles.cardprt} my-bg h-full relative rounded-none border-0`}>
				<img src="/img/placeholder.png" alt={repo.name} className="rounded-none w-full" />
				<div className="p-4">
					<h5 className="text-xl truncate font-semibold">{repo.name}</h5>
					{isTouchDevice || isHovered ? (
						<motion.div
							initial={isTouchDevice ? {} : { maxHeight: 0, opacity: 0 }}
							animate={{ maxHeight: [0, 250], opacity: 1 }}
							transition={{ duration: 0.2, times: [0, 0.8, 1] }}
							className={styles.additionalContent}
						>
							<p className="text-sm truncate">{repo.description || "No description available"}</p>
							<div className="flex flex-col items-center justify-center gap-1">
								<span className={`${styles.myBadgeCreate} text-black text-xs px-2 py-1 rounded`}>
									First Commit: {formatDate && formatDate(repo.created_at)}
								</span>
								<span className={`${styles.myBadgeUpdate} text-black text-xs px-2 py-1 rounded`}>
									Last Update: {formatDate && formatDate(repo.pushed_at)}
								</span>
							</div>
						</motion.div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default RepoCard;
