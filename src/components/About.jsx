import { Card, CardBody } from "react-bootstrap";

const About = () => {
	return (
		<div id="About" className="about-container mx-auto">
			<div className="about-content">
				<h4>About me</h4>
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
							Throughout my academic journey, I have also learned to use backend technologies like ASP.NET with C#.
						</p>
						<p className="fs-5 my-1">
							I am particularly passionate about frontend development because of the immediate results it delivers and
							the beauty of graphic details. I am also fascinated by SEO and optimization.
						</p>
						<p className="fs-5 my-1">
							On the other hand, backend development is not far behind; being able to develop a personal database to
							store data necessary for the operation of an app or website, building APIs that interact with our database
							and return the response to the frontend, all after numerous validations and checks, makes me realize how
							much I could achieve over time with consistency, dedication, and especially a lot of curiosity!
							<strong> Happy coding!</strong>
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default About;
