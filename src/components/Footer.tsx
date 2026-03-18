import "boxicons";
import emailjs from "emailjs-com";
import { useState } from "react";

const alertColors: Record<string, string> = {
  success: "bg-green-100 text-green-800 border border-green-300",
  danger: "bg-red-100 text-red-800 border border-red-300",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

const Footer = () => {
  const year = new Date().getFullYear();
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [alertInfo, setAlertInfo] = useState({ show: false, message: "", variant: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 500;
  const charactersLeft = maxLength - message.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "from_name") setFromName(value);
    else if (name === "from_email") setFromEmail(value);
    else if (name === "message") {
      setMessage(value);
      if (value.length > maxLength && !alertInfo.show)
        setAlertInfo({ show: true, message: "Message is too long.", variant: "warning" });
      else if (value.length <= maxLength && alertInfo.show)
        setAlertInfo({ ...alertInfo, show: false });
    }
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target as HTMLFormElement,
        import.meta.env.VITE_USER_ID
      );
      console.log(result.text);
      setAlertInfo({ show: true, message: "Email sent successfully!", variant: "success" });
      setFromName("");
      setFromEmail("");
      setMessage("");
    } catch (error: any) {
      console.log(error.text);
      setAlertInfo({ show: true, message: "Failed to send email. Please try again.", variant: "danger" });
    }
    setIsSubmitting(false);
    setTimeout(() => setAlertInfo((current) => ({ ...current, show: false })), 5000);
  };

  return (
    <footer id="Contact" className="text-center p-4">
      <div className="max-w-7xl mx-auto">
        {alertInfo.show && (
          <div className="mb-3">
            <div className={`rounded px-4 py-3 flex items-center justify-between ${alertColors[alertInfo.variant] ?? ""}`}>
              <span>{alertInfo.message}</span>
              <button onClick={() => setAlertInfo({ ...alertInfo, show: false })} className="ml-4 font-bold" aria-label="Chiudi">&times;</button>
            </div>
          </div>
        )}
        <div className="mt-2">
          <div className="w-full md:w-1/2 mx-auto">
            <span>..and don&apos;t forget to leave your contact</span>
            <form onSubmit={sendEmail}>
              <div className="mb-3 text-left">
                <label htmlFor="fromName" className="block mb-1">Your Name</label>
                <input id="fromName" type="text" name="from_name" value={fromName} onChange={handleInputChange} required placeholder="Your name" className="place mx-auto w-full" />
              </div>
              <div className="mb-3 text-left">
                <label htmlFor="fromEmail" className="block mb-1">Email address</label>
                <input id="fromEmail" type="email" name="from_email" value={fromEmail} onChange={handleInputChange} required placeholder="mail@example.com" className="place mx-auto w-full" />
              </div>
              <input type="hidden" name="to_name" defaultValue="Salvatore" />
              <div className="mb-3 relative text-left">
                <label htmlFor="message" className="block mb-1">Message</label>
                <textarea id="message" rows={3} name="message" value={message} onChange={handleInputChange} maxLength={maxLength} required placeholder="Enter your message here..." className="place mx-auto w-full" />
                <span className="chart absolute">{charactersLeft}</span>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-hover bn20">
                {isSubmitting ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                    <span>Sending...</span>
                  </>
                ) : "Submit"}
              </button>
            </form>
          </div>
        </div>
        <div className="social-icons mb-3 mt-4">
          <a href="https://github.com/Frelser77" className="me-3" target="_blank" rel="noreferrer" title="Link to my GitHub profile"><i className="bx bxl-github"></i></a>
          <a href="https://www.linkedin.com/in/salvatore-dam/" target="_blank" rel="noreferrer" title="Link to my LinkedIn profile"><i className="bx bxl-linkedin"></i></a>
        </div>
        <div className="mt-3">{`\u00a9 ${year} D\'Amico Salvatore || Frelser7. All rights reserved. PS:is a beta version, im working to finish it.`}</div>
      </div>
    </footer>
  );
};
export default Footer;
