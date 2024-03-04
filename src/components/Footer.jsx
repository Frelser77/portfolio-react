import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import "boxicons";
import emailjs from "emailjs-com";
import { useState } from "react";

const Footer = () => {
	const year = new Date().getFullYear();
	const [fromName, setFromName] = useState("");
	const [fromEmail, setFromEmail] = useState("");
	const [message, setMessage] = useState("");
	const [alertInfo, setAlertInfo] = useState({ show: false, message: "", variant: "" });
	const [isSubmitting, setIsSubmitting] = useState(false); // Nuovo stato per gestire l'invio
	const maxLength = 500;
	const charactersLeft = maxLength - message.length;

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === "from_name") {
			setFromName(value);
		} else if (name === "from_email") {
			setFromEmail(value);
		} else if (name === "message") {
			if (value.length <= maxLength) {
				setMessage(value);
				if (alertInfo.show) {
					setAlertInfo({ ...alertInfo, show: false });
				}
			}
		}
	};

	const handleTouchEnd = (e) => {
		e.preventDefault();
		if (!isSubmitting) {
			sendEmail(e);
		}
	};

	const sendEmail = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (!e.target.checkValidity()) {
			setAlertInfo({ show: true, message: "Please fill in all required fields.", variant: "danger" });
			setIsSubmitting(false);
			return;
		}

		try {
			const result = await emailjs.sendForm(
				import.meta.env.VITE_SERVICE_ID,
				import.meta.env.VITE_TEMPLATE_ID,
				e.target,
				import.meta.env.VITE_USER_ID
			);
			console.log(result.text);
			setAlertInfo({ show: true, message: "Email sent successfully!", variant: "success" });
			setFromName("");
			setFromEmail("");
			setMessage("");
		} catch (error) {
			console.log(error.text);
			setAlertInfo({ show: true, message: "Failed to send email. Please try again.", variant: "danger" });
		}
		setIsSubmitting(false); // Completa l'invio
		setTimeout(() => setAlertInfo((current) => ({ ...current, show: false })), 5000);
	};

	return (
		<footer id="Contact" className="text-center p-4">
			<Container>
				<Row>
					{alertInfo.show && (
						<Col>
							<Alert
								variant={alertInfo.variant}
								onClose={() => setAlertInfo({ ...alertInfo, show: false })}
								dismissible
							>
								{alertInfo.message}
							</Alert>
						</Col>
					)}
				</Row>
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
						<span>..and don’t forget to leave your contact</span>
						<Form onSubmit={sendEmail} noValidate>
							<Form.Group className="mb-3" controlId="fromName">
								<Form.Label>Your Name</Form.Label>
								<Form.Control
									type="text"
									name="from_name"
									value={fromName}
									onChange={handleInputChange}
									required
									placeholder="Enter your name"
									className="name mx-auto"
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="fromEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									name="from_email"
									value={fromEmail}
									onChange={handleInputChange}
									required
									placeholder="Enter your email"
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
									onChange={handleInputChange}
									maxLength={maxLength}
									required
									placeholder="Write your message here"
								/>
								<Form.Text className="chart position-absolute">{charactersLeft}</Form.Text>
							</Form.Group>
							<Button
								variant="primary"
								type="submit"
								disabled={isSubmitting}
								onTouchEnd={handleTouchEnd}
								className="btn-hover bn20"
							>
								{isSubmitting ? (
									<>
										<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
										<span className="ms-2">Sending...</span>
									</>
								) : (
									"Submit"
								)}
							</Button>
						</Form>
					</Col>
				</Row>
				<Row>
					<Col className="mt-3">{`© ${year} Your Name. All rights reserved.`}</Col>
				</Row>
			</Container>
		</footer>
	);
};
export default Footer;
