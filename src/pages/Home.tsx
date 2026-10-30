import AiShowcase from "../components/AiShowcase";
import Digest from "../components/Digest";
import Hero from "../components/Hero";
import { useShown } from "../siteFlags";
import Method from "../components/Method";
import Portal from "../components/Portal";

export default function Home() {
	const shown = useShown();
	return (
		<>
			<Hero />
			{shown("home.ai") && <AiShowcase />}
			{shown("home.digest") && <Digest />}
			{shown("home.portal") && <Portal />}
			{shown("home.method") && <Method />}
		</>
	);
}
