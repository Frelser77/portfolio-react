import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "boxicons";
import emailjs from "emailjs-com";

const Footer = () => {
	const year = new Date().getFullYear();
	const [fromName, setFromName] = useState("");
	const [message, setMessage] = useState("");
	const [showError, setShowError] = useState(false);
	const maxLength = 500;
	const charactersLeft = maxLength - message.length;

	const handleInputChange = (e) => {
		if (e.target.value.length <= maxLength) {
			setMessage(e.target.value);
		} else {
			setShowError(true);
		}
	};

	const sendEmail = (e) => {
		e.preventDefault();
		setShowError(false);

		if (!e.target.checkValidity()) {
			// Se il form non è valido, mostra il messaggio di errore
			setShowError(true);
			return; // Non procedere con l'invio dell'email
		}

		emailjs
			.sendForm(
				import.meta.env.VITE_SERVICE_ID,
				import.meta.env.VITE_TEMPLATE_ID,
				e.target,
				import.meta.env.VITE_USER_ID
			)
			.then(
				(result) => {
					console.log(result.text);
					// Reset dei campi del form dopo l'invio
					setFromName("");
					setMessage("");
					// Aggiungi qui altre azioni post-invio, come mostrare un messaggio di successo
					alert("Success!");
				},
				(error) => {
					console.log(error.text);
					alert("Error!");
					// Gestisci l'errore
				}
			);
	};

	return (
		<footer id="Contact" className="text-center p-4">
			<Container>
				<Row>
					<Col className="social-icons mb-3">
						<a
							href="https://github.com/Frelser77"
							className="me-3"
							target="_blank"
							rel="noreferrer"
							title="Link to my GitHub profile"
						>
							<i className="bx bxl-github"></i>
						</a>
						<a
							href="https://www.linkedin.com/in/salvatore-alessandro-d-amico-4a1551267/"
							target="_blank"
							rel="noreferrer"
							title="Link to my LinkedIn profile"
						>
							<i className="bx bxl-linkedin"></i>
						</a>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={{ span: 6, offset: 3 }}>
						{showError && <Alert variant="danger">Please fill in all required fields.</Alert>}
						<span>Write your name and a message to send me a email</span>
						<Form onSubmit={sendEmail}>
							<Form.Group className="mb-3" controlId="fromName">
								<Form.Label>Your Name</Form.Label>
								<Form.Control
									type="text"
									name="from_name"
									value={fromName}
									onChange={handleInputChange}
									required
									title="Please enter your name."
									className="name mx-auto"
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="toName">
								<Form.Control type="hidden" name="to_name" defaultValue={"Salvatore"} />
							</Form.Group>
							<Form.Group className="mb-3 position-relative" controlId="message">
								<Form.Label>Message</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									name="message"
									value={message}
									title="Please write something to be able to send an email."
									onChange={handleInputChange}
									maxLength={maxLength}
									required
								/>
								<span className="text-muted position-absolute chart">{charactersLeft}</span>
							</Form.Group>
							<Button variant="primary" type="submit" className="btn-hover bn20">
								Submit
							</Button>
						</Form>
					</Col>
				</Row>
				<Row>
					<Col className="mt-3">{`© ${year} Salvatore D'Amico / Frelser77. All rights reserved.`}</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
