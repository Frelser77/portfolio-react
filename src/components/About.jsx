import React from "react";
import { Card, CardBody, Row, Col, Image } from "react-bootstrap";
import bootstrapIcon from "/img/bootstrap_icon.png";
import css3Icon from "/img/css3_icon.png";
import html5Icon from "/img/html5_icon.png";
import jsIcon from "/img/js_icon.png";
import reactNativeIcon from "/img/react_native_icon.png";
import reduxIcon from "/img/redux_icon.png";
import sassIcon from "/img/sass_icon.png";
import csharpIcon from "/img/csharp.png";
import aspnetIcon from "/img/aspnet.png";
import aspnetmvcIcon from "/img/aspnetmvc.png";
import sqlserverIcon from "/img/sqlserver.png";
import sqlsmanIcon from "/img/sqlsman.png";

const images = [
	html5Icon,
	css3Icon,
	sassIcon,
	bootstrapIcon,
	jsIcon,
	reactNativeIcon,
	reduxIcon,
	csharpIcon,
	aspnetIcon,
	aspnetmvcIcon,
	sqlserverIcon,
	sqlsmanIcon,
];

const About = () => {
	return (
		<div id="About" className="about-container">
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
				<Row xs={1} md={3} lg={6} className="g-5 py-3 my-1">
					{images.map((imgSrc, index) => (
						<Col key={index}>
							<Image src={imgSrc} alt="Technology icon" fluid className="tec-icon" />
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

export default About;
