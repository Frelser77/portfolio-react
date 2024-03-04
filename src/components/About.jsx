import { Card, CardBody } from "react-bootstrap";

const About = () => {
	return (
		<div id="About" className="about-container mx-auto">
			<div className="about-content">
				<h1>About me</h1>
				<Card className="border-0">
					<CardBody>
						<p className="fs-5 my-1">
							I am a passionate frontend developer experienced in React, JavaScript, and other modern frameworks.
						</p>
						<p className="fs-5 my-1">
							I am dedicated to crafting smooth and interactive user experiences. In my free time, I love to explore new
							technologies and work on personal projects that challenge me to improve my skills.
						</p>
						<p className="fs-5 my-1">
							In my academic journey, I have also learned to use backend technologies like ASP.NET with C#.
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default About;
