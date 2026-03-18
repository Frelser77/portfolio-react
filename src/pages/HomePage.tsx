import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainComponent from "../components/MainComponents";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiNestjs,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiTailwindcss,
  SiNginx,
  SiCloudflare,
  SiDotnet,
  SiCsharp,
} from "react-icons/si";
import { FaCode, FaServer, FaNetworkWired } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
  }),
};

const techIcons = [
  { icon: SiReact, label: "React", color: "#61DAFB" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { icon: SiNextdotjs, label: "Next.js", color: "#ffffff" },
  { icon: SiNestjs, label: "NestJS", color: "#E0234E" },
  { icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { icon: SiMysql, label: "MySQL", color: "#4479A1" },
  { icon: SiRedis, label: "Redis", color: "#FF4438" },
  { icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
  { icon: SiNginx, label: "Nginx", color: "#009639" },
  { icon: SiCloudflare, label: "Cloudflare", color: "#F48120" },
  { icon: SiDotnet, label: ".NET", color: "#512BD4" },
  { icon: SiCsharp, label: "C#", color: "#9B4F96" },
];

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* ── HERO ── */}
      <MainComponent />

      <hr className="section-divider" />

      {/* ── STATS ── */}
      <section style={{ padding: "2.5rem 0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 justify-items-center max-w-lg mx-auto">
            {[
              { value: "2+", label: t("stats_years") },
              { value: "20+", label: t("stats_tech") },
              { value: "5+", label: t("stats_projects") },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    background: "linear-gradient(135deg, var(--primary-color) 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: ".85rem", opacity: 0.65, marginTop: "6px" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── COSA SO FARE ── */}
      <section style={{ padding: "2rem 0 2.5rem" }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t("whatIDo")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: <FaCode size={30} color="var(--primary-color)" />,
                title: t("frontend_title"),
                desc: t("frontend_desc"),
                i: 0,
              },
              {
                icon: <FaServer size={30} color="var(--primary-color)" />,
                title: t("backend_title"),
                desc: t("backend_desc"),
                i: 1,
              },
              {
                icon: <FaNetworkWired size={30} color="var(--primary-color)" />,
                title: t("infra_title"),
                desc: t("infra_desc"),
                i: 2,
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                className="card h-full p-8"
                variants={fadeUp}
                custom={card.i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: "0 0 28px rgba(113,99,212,0.45)" }}
              >
                <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
                <h5 style={{ fontWeight: 700, color: "var(--primary-color)", marginBottom: ".5rem" }}>
                  {card.title}
                </h5>
                <p style={{ fontSize: ".9rem", opacity: 0.75, marginBottom: 0 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── TECH MARQUEE ── */}
      <section style={{ padding: "2rem 0", overflow: "hidden" }}>
        <div className="w-full">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              opacity: 0.4,
              fontSize: ".72rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              marginBottom: "1.2rem",
            }}
          >
            TECH STACK
          </motion.p>
          <div className="tech-marquee-wrapper">
            <div className="tech-marquee">
              {[...techIcons, ...techIcons].map(({ icon: Icon, label, color }, idx) => (
                <div className="tech-marquee-item" key={idx}>
                  <Icon size={30} color={color} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── CTA ── */}
      <section style={{ padding: "3rem 0 4.5rem" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glow-border mx-auto"
            style={{
              display: "inline-block",
              padding: "3rem 2.5rem",
              borderRadius: 20,
              maxWidth: 620,
              width: "100%",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "2rem",
                background: "linear-gradient(135deg, var(--primary-color), #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              {t("cta_title")}
            </h2>
            <p style={{ color: "#fff", marginBottom: "2rem" }}>{t("cta_desc")}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/contact"
                className="btn"
                style={{
                  background: "var(--primary-color)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: ".7rem 2rem",
                  fontWeight: 600,
                }}
              >
                {t("cta_contact")}
              </Link>
              <Link
                to="/projects"
                className="btn"
                style={{
                  borderRadius: 12,
                  padding: ".7rem 2rem",
                  fontWeight: 600,
                  border: "2px solid rgba(255,255,255,0.75)",
                  color: "#fff",
                  background: "transparent",
                }}
              >
                {t("cta_projects")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
